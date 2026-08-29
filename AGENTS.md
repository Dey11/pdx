# PDX — AGENTS.md

PDX is a free BYOK study-material generator. It is one deployable repository containing a Next.js web application, a one-shot migration role, a BullMQ generation worker, and Redis; PostgreSQL and object storage are managed externally.

## Non-Negotiable Core Principles

- Keep the web application and worker queue contracts aligned. Queue names, task payloads, progress callbacks, and completion callbacks form one production contract.
- Treat generated study materials as durable user data. Database records and R2 objects must remain consistent and recoverable.
- Keep orchestration in route handlers and worker entry points thin. Put AI credentials, provider calls, storage, auth, and email behavior behind the existing `src/lib` or `worker/src` boundaries.
- API keys must never enter queue payloads, logs, analytics, browser responses, or generated documents. Keep `BYOK_ENCRYPTION_KEY` on Web only.
- Never expose provider credentials, auth secrets, worker callback secrets, database URLs, or filled environment files.
- Do not run Prisma schema writes until the exact target database has been confirmed. Production schema changes need an explicit migration and rollback plan.
- Preserve the established Next.js, TypeScript, Tailwind CSS, and shadcn/ui conventions. Do not introduce competing UI primitives or a second package manager.

## Note

Explicit user instructions take precedence over this file. Keep changes within the requested scope, favor the smallest clear model, and protect the running Coolify deployment and shared external services. Repository documentation describes intended state; confirm live provider state before any production action.

## Project Glossary

- **Web**: The Next.js application at the repository root. It serves public pages, authentication, the dashboard, and API route handlers.
- **Worker**: The BullMQ consumer under `worker/` that calls AI providers, renders PDFs, merges PDFs, uploads results, and reports progress to Web.
- **Material**: A generated theory-note or question-bank record and its resulting PDF.
- **Generation task**: One queued portion of a Material processed by Worker.
- **Completion callback**: A Worker-to-Web request that updates task or Material state. It is authenticated by `WORKER_CALLBACK_SECRET`.
- **BYOK credential**: A user-selected provider, endpoint, model, and recoverable API key encrypted in PostgreSQL.
- **Compose stack**: The production `migrate`, `redis`, `web`, and `worker` services described by `docker-compose.yml`.
- **Coolify**: The deployment control plane that builds the Compose stack from the GitHub repository and routes the public domain to Web.
- **Neon**: The externally managed PostgreSQL database referenced by `DATABASE_URL`; it is not part of the Compose stack.
- **R2**: Cloudflare object storage for generated PDF artifacts.

## Development & Execution Rules

- Use Bun only. Install with `bun install`; do not create npm, pnpm, or Yarn lockfiles.
- Read [README.md](README.md) and the relevant document under `docs/` before changing architecture, deployment, generation, authentication, storage, or billing behavior.
- Local commands:
  - `bun run dev` starts Web.
  - `bun run worker:dev` starts Worker and requires a compatible Redis instance.
  - `bun run test` runs focused Bun tests.
  - `bun run lint` runs ESLint.
  - `bun run typecheck` runs TypeScript checking.
  - `bun run worker:build` compiles Worker.
  - `bun run prisma:generate` regenerates the Prisma client without writing to a database.
- Builds and type checks are heavy on the shared VPS. Run them through `safe-dev-run`, for example `safe-dev-run bun run build` and `safe-dev-run bun run typecheck`.
- Never run `bun run prisma:push`, migrations, or database writes without confirming the exact `DATABASE_URL` and receiving authorization for that target.
- Keep `.env.local.example`, `.env.production.example`, and `.env.production.docker.example` synchronized with runtime requirements. Never commit a filled `.env` file.
- Keep the four queue names identical in `src/lib/constants.ts` and `worker/src/constants.ts`: `theoryQueue`, `qbankQueue`, `mergePdfQueue`, and `completionQueue`.
- Keep Worker callback authentication intact on both sides: `worker/src/callback.ts` sends `x-worker-secret`; Web verifies it in `src/lib/worker-auth.ts`.
- Provider presets live in `src/lib/ai/providers.ts`; users may edit the model ID. Do not reintroduce server-funded provider keys or put credentials into Redis.
- The production Compose stack owns Redis but not PostgreSQL. Do not add a production Postgres container without an intentional migration plan.
- Coolify uses `/docker-compose.yml` and the GitHub App source. Confirm the application UUID, source branch, environment, domain, and current health before any Coolify write; the parallel BYOK launch tracks `launch/byok-pdx` so the old `master` deployment remains untouched.
- Add focused Bun tests for meaningful credential, URL-policy, and generation-contract behavior. Run tests, lint, type checking, the relevant build, and targeted manual checks.
- Update documentation when routes, environment variables, queue contracts, setup commands, architecture, or visible behavior change.
- Inspect `git diff` before committing. Local checkpoint commits are allowed; pushing, deploying, changing remotes, or rewriting history requires explicit authorization.
