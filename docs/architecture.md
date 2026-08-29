# Architecture

## Product boundary

PDX turns a syllabus into theory notes or a question-bank PDF. PDX itself is free; each account supplies an API key for an OpenAI-compatible provider.

## Runtime topology

```text
Browser
  |
  v
Next.js Web ---------------- PostgreSQL / Neon
  |   |                         | sessions, materials, tasks
  |   |                         ` encrypted per-user AI credential
  |   `--- OAuth / Resend
  |
  `--- Redis / BullMQ --- Worker --- selected AI provider
                              |
                              `--- Chromium --- Cloudflare R2
```

Compose runs `migrate`, `redis`, `web`, and `worker`. Only Web is public.

## Credential boundary

Web owns provider presets, input validation, endpoint policy, encryption, persistence, and status APIs. It encrypts keys with a dedicated 32-byte `BYOK_ENCRYPTION_KEY` using AES-256-GCM. The stored envelope is versioned and authenticated.

Generation routes resolve the signed-in user’s credential. Redis payloads never contain an API key. Worker receives only a material ID, then requests that material owner’s resolved credential from `/api/internal/ai-credentials/[materialId]`. The endpoint is no-store and protected by the shared Worker secret. Plaintext exists only in Web/Worker process memory while making a provider request.

Custom endpoints must use HTTPS, cannot contain URL credentials/query/fragment data, and cannot resolve to loopback, private, link-local, carrier-grade NAT, multicast, or metadata destinations. Web verifies this before save and generation; Worker rechecks before provider requests. Redirects are rejected and provider calls have time and response-size limits.

Provider changes are blocked while the user has a pending or in-progress Material so one generation cannot switch models midway.

## Generation and queues

The queue names in `src/lib/constants.ts` and `worker/src/constants.ts` are cross-process contracts: `theoryQueue`, `qbankQueue`, `mergePdfQueue`, and `completionQueue`.

Theory generation fans out one task per topic. Question-bank generation has one job that processes its topics in order. Worker reports task updates and completion to Web using `x-worker-secret`, renders PDFs with Chromium, and stores final artifacts in R2.

Token usage remains diagnostic data. It does not map to credits or entitlement.

## Persistence

- PostgreSQL: users, sessions, encrypted AI credentials, materials, tasks, activity, and dormant historical billing rows.
- Redis: queue state in `redis-data`.
- R2: generated PDFs.
- Worker scratch: `worker-temp`.

The billing and coupon Prisma structures remain intentionally dormant. Active application code neither exposes nor mutates them.

## Authentication

Better Auth supports Google, GitHub, and email/password. Email signup signs in automatically and does not require verification. Resend delivers password-reset messages. Production OAuth callbacks are:

- `https://pdx.sdey.me/api/auth/callback/google`
- `https://pdx.sdey.me/api/auth/callback/github`

## Health and migrations

`GET /api/health` checks the Web process and performs a database query. A `503` is unhealthy even when the container process is running.

Prisma migrations are committed under `prisma/migrations`. Existing production databases must mark `00000000000000_baseline` as applied once, then apply the additive BYOK migration. After that one-time adoption, Compose’s `migrate` service runs `prisma migrate deploy` before Web starts.
