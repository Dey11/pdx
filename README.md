# PDX Web App

Last audited: 2026-05-28

This folder is the current Next.js app for PDX. It now also contains a colocated worker under `worker/`; the old standalone `../worker` folder remains as migration source history until full consolidation is approved.

Read the root `Docs/` folder before changing application behavior.

## What This App Owns

- public marketing pages
- authenticated dashboard
- Better Auth configuration
- Prisma schema and database access
- generation route handlers
- BullMQ queue producers
- Dodo payment webhook handling
- coupon redemption
- transaction history
- Cloudflare R2 signed download URLs

## Important Routes

Pages:

- `/`
- `/pricing`
- `/about`
- `/policy`
- `/terms`
- `/login`
- `/dashboard`
- `/dashboard/generate/theory`
- `/dashboard/generate/qbank`
- `/history`
- `/settings`

APIs:

- `/api/auth/[...all]`
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

## Current Stack

- Next.js 16.2
- React 19.2
- TypeScript 6
- Tailwind CSS 4
- Prisma 7 with `@prisma/adapter-pg`
- Better Auth 1.6
- BullMQ 5.77
- Cloudflare R2 via AWS S3 SDK
- DeepSeek V4 Flash through Vercel AI SDK with Gemini fallback support
- Dodo Payments webhook verification
- PostHog, Umami, Vercel Analytics, Vercel Speed Insights

## Environment

Use the env template that matches how you are running the app:

- `.env.local.example`: local web and worker without Docker
- `.env.production.example`: production web and worker without Docker
- `.env.production.docker.example`: combined Docker/Coolify env list for `docker-compose.yml`
- `example.env`: legacy compatibility template kept for now

Required for core local web boot:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_TRUST_HOST`
- `DATABASE_URL`
- `GOOGLE_API_KEY`
- `DEEPSEEK_API_KEY`
- `AI_GENERATION_MODELS`
- `AI_GENERATION_MAX_OUTPUT_TOKENS`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ACCESS_KEY_ID`
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `BUCKET_NAME`

Required for email login:

- `AUTH_RESEND_KEY`
- `AUTH_EMAIL_FROM`

Required for GitHub login:

- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`

Required for billing:

- `WEBHOOK_SECRET`
- `STATIC_PAYMENT_LINK`
- `ADMIN_KEY`

Optional/current analytics:

- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_POSTHOG_KEY`

## Commands

Project policy is to use Bun for new work.

This package uses Bun.

`prisma.config.ts` owns the Prisma datasource URL for Prisma 7. `bunx prisma generate` and `bun run build` can run without a live database; do not run `bunx prisma db push`, migrations, or deploy commands until the target `DATABASE_URL` is confirmed.

ESLint is pinned to `9.39.4` because ESLint 10 currently crashes through the React plugin used by `eslint-config-next@16.2.6`.

Typical local commands after dependencies are installed:

```bash
bun run dev
bunx prisma generate
```

Only run `bunx prisma db push` or migration commands after confirming the target `DATABASE_URL`.

Current script caveat:

```json
"build": "bunx prisma generate && next build"
```

Worker scripts:

```bash
bun run worker:dev
bun run worker:build
bun run worker:start
```

Docker/Coolify scripts:

```bash
bun run docker:config
bun run docker:up
bun run docker:down
```

For Coolify, use `docker-compose.yml` from this `web/` folder and paste the contents of `.env.production.docker.example` into Coolify after replacing placeholders. The Compose stack starts `postgres`, `redis`, `web`, and `worker`. It does not run Prisma migrations automatically.

## Worker Dependency

The generation pipeline is not complete with the Next.js server alone. The colocated worker must also run and connect to the same Redis instance.

AI generation uses an ordered model list from `AI_GENERATION_MODELS`. The default is:

```text
deepseek:deepseek-v4-flash,deepseek:deepseek-chat,google:gemini-2.5-flash
```

Entries use `provider:model-id`; bare `gemini-*` IDs are inferred as Google and other bare IDs are inferred as DeepSeek. Reorder or replace this list to change the primary model or fallback chain without editing generator code.

Current queue names:

- `theoryQueue`
- `qbankQueue`
- `mergePdfQueue`
- `completionQueue`

The worker posts callbacks to:

- `/api/generation/update-task`
- `/api/generation/progress`
- `/api/generation/complete`

## Known Drift

- rate limiting code is commented out
- worker callback routes are unauthenticated
- web and worker do not share schemas
- schema migration is still a manual deployment step

See `../Docs/` for the full architecture and modernization plan.
