# Architecture

## Product boundary

NoteFormula accepts a syllabus, turns it into theory notes or a question bank, and delivers a generated PDF. The repository is one deployable unit, but the runtime has three processes and three external service boundaries.

## Runtime topology

```text
Browser
  |
  v
Next.js Web ---- PostgreSQL (Neon)
  |  |  \
  |  |   `------ Email / auth providers
  |  `---------- Redis queues
  |                |
  |                v
  `------------- BullMQ Worker ---- AI providers
                         |
                         `---------- Cloudflare R2
```

The production Compose stack runs Web, Worker, and Redis. PostgreSQL, R2, AI providers, OAuth providers, and email delivery remain external.

## Web

The Next.js App Router application lives under `src/app`. It owns public and authenticated pages, session handling, generation enqueueing, progress APIs, download authorization, and the health endpoint.

`GET /api/health` verifies both the Web process and a live database query. A `503` from this endpoint means the application cannot be considered healthy even if the container is running.

## Worker

Worker starts from `worker/src/index.ts`. It consumes BullMQ jobs, invokes the configured model fallback chain, renders and merges PDFs, uploads artifacts to R2, and calls Web with progress and completion results.

Web and Worker intentionally have separate build targets in the root `Dockerfile`. Both are built from the same commit and share the same dependency lockfile.

## Queue and callback contract

The queue names in `src/lib/constants.ts` and `worker/src/constants.ts` are a literal cross-process contract:

- `theoryQueue`
- `qbankQueue`
- `mergePdfQueue`
- `completionQueue`

Worker callbacks use the internal Compose URL `http://web:3000` and attach `x-worker-secret`. The same `WORKER_CALLBACK_SECRET` must be configured on Web and Worker in production.

## Persistence

- PostgreSQL stores users, sessions, materials, tasks, transactions, activity, and coupons. Prisma models live in `prisma/schema.prisma`.
- Redis stores BullMQ state and uses the named `redis-data` Compose volume.
- R2 stores generated PDF artifacts.
- Worker scratch files use the named `worker-temp` Compose volume.

The Compose stack does not apply Prisma migrations automatically. Schema changes are a separate, explicitly controlled production operation.

## Configuration boundaries

The committed `.env*.example` files are the canonical variable inventory. Production values belong in Coolify, never in Git.

- Web/auth: public URL, auth secrets, OAuth, email.
- Data: PostgreSQL and Redis.
- Generation: model list, provider API keys, token cap.
- Worker link: internal callback URL and shared secret.
- Storage and rendering: R2 and Chromium.
- Billing: webhook and checkout configuration while billing remains enabled.
- Analytics: public PostHog build/runtime values.

## Deployment boundary

Coolify builds `docker-compose.yml` from the GitHub repository. Only Web receives a public route; Worker and Redis remain internal. A healthy launch requires all three services, valid external credentials, a reachable database, and a Coolify proxy route to Web port `3000`.
