# PDX

PDX is a free, bring-your-own-key study-material generator. A signed-in user connects an OpenAI-compatible provider, pastes a syllabus, and generates theory notes or question-bank PDFs.

Operational and architectural documentation lives in [`docs/`](docs/README.md).

## Runtime

This repository is one deployable unit with four Compose roles:

- `migrate`: applies committed Prisma migrations and exits;
- `redis`: stores BullMQ state;
- `web`: Next.js pages, Better Auth, APIs, credential storage, and queue producers;
- `worker`: AI generation, PDF rendering/merging, R2 upload, and progress callbacks.

PostgreSQL is an external Neon database. Cloudflare R2, OAuth providers, Resend, and each user’s selected AI provider are external services.

## Stack

- Next.js 16.3.3, React 19.2, TypeScript 6, and Tailwind CSS 4
- shadcn/ui and Radix UI
- Prisma 7.10 with PostgreSQL
- Better Auth 1.7 with Google, GitHub, and email/password
- AI SDK 6 with `@ai-sdk/openai-compatible`
- BullMQ 5 and Redis 7
- Bun 1.4.0
- Cloudflare R2 and Chromium/Puppeteer

## BYOK model

Every account must configure a provider before generation. Presets cover OpenAI, OpenRouter, DeepSeek, and Groq; Custom accepts a public HTTPS OpenAI-compatible endpoint.

Provider API keys are encrypted in PostgreSQL with AES-256-GCM and `BYOK_ENCRYPTION_KEY`. APIs return only safe metadata and a short key hint. Redis jobs contain material IDs and generation inputs, never credentials. Worker resolves the material owner’s credential from Web immediately before inference over an endpoint protected by `WORKER_CALLBACK_SECRET`.

The product has no pricing route, plans, credits, checkout, coupons, transactions, or payment webhooks. Historical billing columns and tables remain dormant for a future deliberate data migration.

## Routes

Pages include `/`, `/about`, `/policy`, `/terms`, `/login`, `/dashboard`, both generation routes, `/history`, and `/settings`.

Important APIs:

- `/api/health`
- `/api/auth/[...all]`
- `/api/ai-credentials` and `/api/ai-credentials/dismiss`
- `/api/internal/ai-credentials/[materialId]`
- `/api/internal/generation-dispatch`
- `/api/internal/generation-state/[materialId]`
- `/api/generation/generate-topics`
- `/api/generation/enqueue-generation`
- `/api/generation/progress`, `/complete`, and `/download/[materialId]`

## Commands

Bun is the only supported toolchain.

```bash
bun install
bun run dev
bun run worker:dev

bun run test
bun run lint
bun run typecheck
bun run worker:build
bun run build

bun run prisma:generate
bunx prisma migrate deploy

bun run docker:config
bun run docker:up
bun run docker:down
```

Do not run migrations or `prisma:push` until the exact database target is confirmed. Production was created before migration history; follow the baseline procedure in [`docs/deployment/coolify.md`](docs/deployment/coolify.md).

## Queue contract

The queue names are a literal Web/Worker contract:

- `theoryQueue`
- `qbankQueue`
- `mergePdfQueue`
- `completionQueue`

Worker completion callbacks are idempotent: each one persists a task outcome, then derives Material progress from terminal task rows. Expensive generation uses a small, classified retry budget; failed generation jobs remain in Redis until a separate reconciler durably publishes their terminal outcomes. A PostgreSQL dispatch outbox, deterministic BullMQ job IDs, deterministic R2 keys, and pre-retry task-state checks make retries safe across service restarts without repeating completed AI work. Worker callbacks and internal endpoints use `x-worker-secret`; every environment fails closed when `WORKER_CALLBACK_SECRET` is absent.

## Environment

Use the matching committed template and never commit a filled environment file:

- `.env.local.example`
- `.env.production.example`
- `.env.production.docker.example`

Main concerns:

- Web/auth: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`; OAuth credentials are optional and each provider appears only when both values are set
- Password reset: optional `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM`; the reset UI is hidden when Resend is not configured
- Data: `DATABASE_URL`, Redis variables
- Credential encryption: `BYOK_ENCRYPTION_KEY` on Web only
- Worker link: `BACKEND_URL`, `WORKER_CALLBACK_SECRET`
- Generation: `AI_GENERATION_MAX_OUTPUT_TOKENS`
- Storage: R2 credentials and `BUCKET_NAME`
- Analytics: public PostHog variables

There are no server-funded AI-provider or payment variables.

## Deployment

Coolify builds `docker-compose.yml` through the repository’s GitHub App source. Only Web receives a public route. For the target deployment, configure its Compose domain as `https://pdx.sdey.me:3000`; the suffix identifies Web’s internal port and is not part of the public browser URL.

See [`docs/deployment/coolify.md`](docs/deployment/coolify.md) for database baselining, OAuth callbacks, deployment gates, and cutover checks.
