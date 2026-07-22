# syntax=docker/dockerfile:1

FROM oven/bun:1.3.4-debian AS base
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

FROM deps AS builder
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
COPY . .
RUN bun run build
RUN bun run worker:build

FROM base AS web
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# node_modules came from the deps stage (install only); the Prisma client is
# generated in the builder stage, so regenerate it here for the runtime image.
RUN bunx prisma generate

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

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/worker/dist ./worker/dist

RUN mkdir -p /app/worker/temp

CMD ["bun", "worker/dist/index.js"]
