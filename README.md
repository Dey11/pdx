# PDX Web App

Last audited: 2026-05-27

This folder is the current Next.js app for PDX. It is one of two nested repositories in the project root. The worker currently lives in `../worker`, but the planned architecture is to move both apps into one Bun workspace with a root Docker Compose setup.

Read the root `Docs/` folder before changing application behavior.

## What This App Owns

- public marketing pages
- authenticated dashboard
- Auth.js/NextAuth configuration
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

- `/api/auth/[...nextauth]`
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

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- Auth.js/NextAuth beta
- BullMQ
- Cloudflare R2 via S3 SDK
- Google Gemini through Vercel AI SDK
- Dodo Payments webhook verification
- PostHog, Umami, Vercel Analytics, Vercel Speed Insights

## Environment

Copy `example.env` to `.env` and fill in values.

Required for core local web boot:

- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_TRUST_HOST`
- `DATABASE_URL`
- `GOOGLE_API_KEY`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ACCESS_KEY_ID`
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `BUCKET_NAME`

Required for email login:

- `AUTH_RESEND_KEY`

Required for billing:

- `WEBHOOK_SECRET`
- `STATIC_PAYMENT_LINK`
- `ADMIN_KEY`

Optional/current analytics:

- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_POSTHOG_KEY`

## Commands

Project policy is to use Bun for new work.

Current package scripts still contain pnpm assumptions, especially the build script. This is documented as technical debt and should be fixed during the Docker/Compose pass.

Typical local commands after dependencies are installed:

```bash
bun run dev
bunx prisma generate
bunx prisma db push
```

Current script caveat:

```json
"build": "pnpm dlx prisma generate && next build"
```

This should become Bun-compatible before deployment work is considered complete.

## Worker Dependency

The generation pipeline is not complete with this app alone. The worker must also run and connect to the same Redis instance.

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

- login UI shows GitHub sign-in, but GitHub provider is not configured
- rate limiting code is commented out
- worker callback routes are unauthenticated
- web and worker do not share schemas
- bucket config is inconsistent with the worker
- there is no root Docker Compose yet
- this app still has a `pnpm-lock.yaml`

See `../Docs/` for the full architecture and modernization plan.
