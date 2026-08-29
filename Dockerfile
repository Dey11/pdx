# syntax=docker/dockerfile:1

FROM oven/bun:1.4.0-debian AS base
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
# Skip puppeteer's browser download during `bun install`: the base image has no
# unzip and the worker uses the apt-installed chromium at runtime. Puppeteer v25
# honors PUPPETEER_SKIP_DOWNLOAD; PUPPETEER_SKIP_CHROMIUM_DOWNLOAD is deprecated.
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS prod-deps
COPY package.json bun.lock ./
# Prisma is an optional peer pulled into Bun's production install; the running
# services need @prisma/client, not the migration CLI owned by the migrate stage.
RUN bun install --frozen-lockfile --production \
  && rm -rf /app/node_modules/prisma

FROM deps AS web-builder
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
COPY . .
RUN bun run build

FROM deps AS worker-builder
COPY . .
RUN bun run worker:build

FROM deps AS migrate
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
CMD ["bunx", "prisma", "migrate", "deploy"]

FROM base AS web
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=web-builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=web-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=web-builder /app/.next ./.next
COPY --from=web-builder /app/public ./public
COPY --from=web-builder /app/package.json ./package.json
COPY --from=web-builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["bun", "run", "start"]

FROM base AS worker
ENV NODE_ENV=production
# Debian's chromium ships for both amd64 and arm64; Google's chrome-stable deb
# is amd64-only and cannot run on the arm64 host this stack deploys to.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    chromium \
    fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=worker-builder /app/package.json ./package.json
COPY --from=worker-builder /app/worker/dist ./worker/dist

RUN mkdir -p /app/worker/temp

CMD ["bun", "worker/dist/index.js"]
