# NoteFormula

> Formerly PDX.

AI study material generator. Paste a syllabus and NoteFormula generates
comprehensive, exam-ready PDF study notes and question banks.

This repository is a single deployable unit:

- a **Next.js web app** at the repo root (marketing pages, dashboard, auth, API
  route handlers, BullMQ queue producers, payments)
- a **colocated BullMQ worker** under `worker/` (AI generation, PDF rendering,
  PDF merging) that connects to the same Redis instance
- one **`Dockerfile`** with separate `web` and `worker` build targets
- one **`docker-compose.yml`** that runs `postgres`, `redis`, `web`, and
  `worker`

## Stack

- Next.js 16.2.11 (App Router, Turbopack)
- React 19.2.8
- TypeScript 6
- Tailwind CSS 4 (CSS-first config) with the full shadcn/ui component set
- Prisma 7.9 with `@prisma/adapter-pg` (PostgreSQL)
- Better Auth 1.6.23 (Google, GitHub, email/password)
- BullMQ 5.80 on Redis
- Bun runtime and package manager
- AI SDK v6 — DeepSeek V4 Flash primary with a Gemini fallback chain
- Cloudflare R2 (via the AWS S3 SDK) for generated PDFs
- Dodo Payments (webhook verification via `standardwebhooks`)
- Resend for transactional email
- PostHog and Vercel Analytics / Speed Insights

## Routes

Pages:

- `/`
- `/pricing`
- `/about`
- `/policy`
- `/terms`
- `/login`
- `/login/reset-password`
- `/dashboard`
- `/dashboard/generate/theory`
- `/dashboard/generate/qbank`
- `/history`
- `/settings`

API:

- `/api/auth/[...all]`
- `/api/health`
- `/api/credits`
- `/api/payment-link/[productId]`
- `/api/transactions`
- `/api/webhook`
- `/api/admin/create-coupon`
- `/api/generation/generate-topics`
- `/api/generation/enqueue-generation`
- `/api/generation/update-task`
- `/api/generation/progress`
- `/api/generation/progress/[materialId]`
- `/api/generation/complete`
- `/api/generation/download/[materialId]`

## Commands

Bun is the only supported toolchain.

```bash
bun install

bun run dev            # Next.js dev server (Turbopack)
bun run worker:dev     # run the worker against the same Redis
bun run worker:build   # compile the worker to worker/dist
bun run worker:start   # run the compiled worker

bun run lint           # ESLint

bun run prisma:generate
bun run prisma:push    # only after DATABASE_URL is confirmed

bun run docker:config  # render the compose config
bun run docker:up      # build + start the full stack
bun run docker:down    # stop the stack
```

`prisma.config.ts` owns the Prisma datasource URL. `bunx prisma generate` runs
without a live database; do **not** run `bunx prisma db push` or migrations
until the target `DATABASE_URL` is confirmed.

ESLint is pinned to `9.39.4` because ESLint 10 currently crashes through the
React plugin used by `eslint-config-next@16.2.11`.

Validation note: builds and type checks are heavy. On the shared VPS run them
through the `safe-dev-run` wrapper (e.g. `safe-dev-run bun run build`); never
launch a raw `next build` or `tsc` directly.

## The worker

The generation pipeline is not complete with the Next.js server alone. The
worker must run and connect to the same Redis instance.

Queues (names shared literally between `src/lib/constants.ts` and
`worker/src/constants.ts` — never rename one without the other):

- `theoryQueue`
- `qbankQueue`
- `mergePdfQueue`
- `completionQueue`

The worker posts progress and results back to the web app:

- `/api/generation/update-task`
- `/api/generation/progress`
- `/api/generation/complete`

These callbacks are **authenticated** with a shared secret. The worker attaches
`x-worker-secret: $WORKER_CALLBACK_SECRET` (see `worker/src/callback.ts`) and
the web app verifies it with a timing-safe compare (see
`src/lib/worker-auth.ts`). If `WORKER_CALLBACK_SECRET` is unset, verification is
skipped and a one-time warning is logged, so set it on **both** services in
production. `worker/src/env.ts` requires it in production.

### Model fallback chain

Both the web app and the worker read `AI_GENERATION_MODELS`: an ordered,
comma-separated list of `provider:model-id` entries tried in sequence. Default:

```text
deepseek:deepseek-v4-flash,deepseek:deepseek-chat,google:gemini-2.5-flash
```

Bare `gemini-*` IDs are inferred as Google; other bare IDs are inferred as
DeepSeek. Reorder or replace the list to change the primary model or fallback
chain without editing generator code. `AI_GENERATION_MAX_OUTPUT_TOKENS` caps
output tokens per call.

## Environment

Pick the template that matches how you run the app, copy it, and replace every
placeholder. Never commit a filled-in file.

- `.env.local.example` — local web + worker without Docker
- `.env.production.example` — production web + worker run directly on a host/VM
- `.env.production.docker.example` — combined env list for `docker-compose.yml`
  (also what you paste into Coolify)

Variables by concern:

- **Auth / web** — `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `AUTH_SECRET`,
  `AUTH_TRUST_HOST`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`,
  `AUTH_GITHUB_SECRET`
- **Email** — `AUTH_RESEND_KEY` (the single Resend key), `AUTH_EMAIL_FROM`
- **Database** — `DATABASE_URL` (plus `POSTGRES_DB` / `POSTGRES_USER` /
  `POSTGRES_PASSWORD` for the Compose-managed Postgres)
- **Redis** — `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`
- **Worker link** — `BACKEND_URL`, `WORKER_CALLBACK_SECRET`
- **AI** — `GOOGLE_API_KEY`, `DEEPSEEK_API_KEY`, `AI_GENERATION_MODELS`,
  `AI_GENERATION_MAX_OUTPUT_TOKENS` (read by both web and worker)
- **Storage (Cloudflare R2)** — `CLOUDFLARE_ACCOUNT_ID`,
  `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `BUCKET_NAME`
- **PDF rendering** — `PUPPETEER_EXECUTABLE_PATH`
  (`PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` is a Docker build arg, not a runtime var)
- **Payments** — `WEBHOOK_SECRET`, `STATIC_PAYMENT_LINK`, `ADMIN_KEY`
- **Analytics** — `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_POSTHOG_KEY`

## Deployment

`docker-compose.yml` builds `web` and `worker` from the same `Dockerfile`
(targets `web` and `worker`) and starts the `postgres` and `redis` services
alongside them. For Coolify, paste `.env.production.docker.example` (with
placeholders replaced) and let the connected GitHub App source auto-deploy on
push.

The Compose stack does **not** run Prisma migrations automatically; applying the
schema is a manual step against a confirmed `DATABASE_URL`.

## Known Drift

- The web app (`src/lib` zod usage) and the worker (`worker/src/zod/schema.ts`)
  maintain independent Zod schemas rather than a shared package.
- Database schema migration is a manual deployment step (see Deployment).
- Visual identity still references the old brand pending user input:
  `public/logo.png`, `public/og-image.png`, the design tokens/colors, the social
  handles (`instagram.com/use.pdx`, `x.com/usepdx_`, the `@usepdx_` Twitter
  metadata, `@pdxstudios` on the About page), the Dodo product IDs (`pdt_…`), and
  the Google site-verification file (`public/google38d960025354decc.html`, tied
  to the old domain).
