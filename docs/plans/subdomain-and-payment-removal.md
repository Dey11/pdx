# PDX BYOK launch plan

Status: implementation and local verification complete; deployment blocked by the Neon compute quota, missing OAuth/Resend credentials, and unavailable authoritative DNS credentials.

Target URL: `https://pdx.sdey.me`

## Goal

Relaunch NoteFormula as a free, bring-your-own-key product. Every account supplies an API key for an OpenAI-compatible provider. The release removes the active billing and credit system, preserves historical billing rows without using them, keeps the old pricing page only as an archive, upgrades the supported dependency set, and deploys a clean Docker Compose application to Coolify.

## Settled product decisions

- BYOK is mandatory for every account, including existing accounts.
- A user without a provider configuration may browse the dashboard, history, settings, and existing downloads, but cannot start topic planning or generation.
- The first authenticated visit without a configured key opens setup. The dialog can be dismissed. Generation actions reopen it until setup succeeds.
- Provider presets are OpenAI, OpenRouter, DeepSeek, and Groq. A Custom option accepts any supported OpenAI-compatible endpoint.
- Each preset supplies a base URL and editable default model ID. Custom requires provider name, HTTPS base URL, model ID, and API key.
- Saving a configuration runs a small real structured-output request. Only a successful configuration is stored.
- API keys are encrypted in PostgreSQL. They are not hashed, because the worker must recover the original key to call the provider.
- `/pricing` remains as an archived historical page with a prominent BYOK notice and no working purchase action. It leaves the primary navigation.
- Transaction, coupon, subscription, credit, and reserved-credit columns and tables remain dormant in the database. Application code stops reading and writing them.
- Google, GitHub, and email/password remain the supported sign-in methods. Email/password does not require verification. Resend still handles password-reset email.
- Dependency upgrades stay within compatible majors. Breaking upgrades such as AI SDK 7, BullMQ 6, ESLint 10, Prisma 8, and Recharts 3 are outside this release.
- Deployment uses a new Coolify application in the existing `noteformula` production project. The broken application remains untouched until the replacement passes verification.

## Current production diagnosis

### Reproduction

The public failure is deterministic:

```text
GET https://noteformula.cooldash.xyz/api/health
HTTP 503
no available server
```

Three consecutive checks on 2026-08-29 produced the same response.

### Confirmed findings

- Coolify reports the current application as `running:unhealthy`.
- The Web service listens on container port `3000` and the source Compose file exposes only `3000`.
- Coolify stores the Web domain as `https://noteformula.cooldash.xyz` without `:3000`. Its documentation requires the internal port in the domain value for non-port-80 Compose services.
- The generated Web proxy labels contain the host rule but no explicit load-balancer port. The public proxy therefore has no usable Web backend and returns `503`.
- The application also retains stale generated-domain labels that target port `80`.
- The deployed Web and Worker images use commit `ae7c64b`; `origin/master` is one code commit newer, and the local branch also contains the documentation checkpoint.
- Live Google OAuth, GitHub OAuth, and Resend variables are empty. Those sign-in/reset paths cannot be considered production-ready.
- `pdx.sdey.me` currently has no DNS record.
- The confirmed Neon target currently rejects connections because its account or project has exceeded the compute-time quota. Schema inspection, baseline adoption, migration, and application health cannot proceed until that quota is restored.
- `sdey.me` uses Namecheap BasicDNS nameservers. The available Cloudflare token does not own that zone, and no Namecheap credential is present, so the A record requires direct Namecheap access or a manual DNS change.

### Secondary checks required during replacement deployment

The routing failure prevents a useful public health result. The clean deployment must still verify:

- Web can query the intended Neon database through `/api/health`.
- Redis accepts authenticated connections and all four BullMQ workers start.
- Worker callback authentication succeeds.
- Chromium, PDF generation, and R2 upload work on ARM64.

The current top-level Coolify log contains only an AI SDK warning and does not expose enough per-service detail to prove those checks now.

## Target architecture

```text
Browser
  |
  | session-authenticated credential setup/status
  v
Next.js Web ---------------------- PostgreSQL / Neon
  |                                  | encrypted API-key envelope
  |                                  | provider, base URL, model, verification
  |                                  ` onboarding dismissal
  |
  | jobs contain material data, never plaintext credentials
  v
Redis / BullMQ
  |
  v
Worker -- authenticated internal credential request --> Web
  |
  | plaintext key exists only in process memory for the provider request
  v
User-selected OpenAI-compatible provider
```

### Credential module

Create one deep `ai-credentials` module in Web. Its external interface should remain small:

- get the signed-in user's configuration status and safe metadata;
- validate and save a configuration;
- mark onboarding dismissed;
- delete a configuration;
- resolve a generation credential for a signed-in user;
- resolve a generation credential for an authenticated Worker request and Material.

Encryption, URL policy, provider presets, validation requests, Prisma access, redaction, and pending-generation rules stay inside the module.

Worker receives only a resolved provider name, base URL, model ID, and plaintext key from an internal no-store endpoint authenticated with `WORKER_CALLBACK_SECRET`. The endpoint derives the user from `materialId`; Worker cannot request by arbitrary user ID. Queue payloads and BullMQ metadata never contain an API key.

Credential updates and deletion are rejected while that user has a pending or in-progress Material. This prevents one Material from switching provider or model halfway through its jobs.

### Data model

Add one credential record per user:

- `userId`, unique foreign key with cascade delete;
- provider preset slug;
- normalized base URL;
- model ID;
- versioned encrypted-key envelope;
- masked key hint, never the recoverable key;
- `verifiedAt`, `createdAt`, and `updatedAt`.

Add `aiSetupPromptDismissedAt` to User. Existing users have no credential and no dismissal timestamp, so they receive the same one-time prompt after launch.

Use AES-256-GCM or an equivalent authenticated-encryption primitive with a dedicated 32-byte production key. Store the nonce, authentication tag, ciphertext, and envelope version together. Keep the master key only in Coolify as `BYOK_ENCRYPTION_KEY`; do not reuse auth, Worker, database, or Redis secrets.

User-facing copy must say:

> Your API key is encrypted at rest, never shown again after saving, and used only for your generation requests. Your prompts and study content are sent directly to the provider you choose.

Do not describe the key as hashed.

### Provider registry and URL safety

The preset registry owns public metadata only: label, base URL, and default model ID. Every default model is confirmed against the provider's current official model list during implementation.

Custom endpoints introduce an SSRF path. The server must:

- accept HTTPS only;
- reject credentials in URLs, fragments, and unexpected query strings;
- reject localhost, loopback, private, link-local, multicast, carrier-grade NAT, and cloud-metadata ranges for IPv4 and IPv6;
- resolve DNS and reject any forbidden result before validation and again before generation;
- follow no cross-origin redirects;
- apply short connection and response timeouts and response-size limits;
- never accept arbitrary user-supplied headers.

### Validation

Saving a credential runs a minimal structured-output request through `@ai-sdk/openai-compatible`. The probe uses the same model construction and structured response mechanism as topic planning. It distinguishes invalid credentials, unreachable endpoints, unknown models, rate limits, and incompatible structured output without reflecting provider responses or secrets into logs.

## Removing the active billing domain

### Remove active behavior

- Delete payment-link, webhook, transactions, coupon-administration, and credit endpoints.
- Remove Dodo Payments and `standardwebhooks` after no imports remain.
- Remove product IDs, checkout URLs, webhook secrets, admin coupon secrets, and payment environment variables.
- Remove Billing, Redeem, and Transactions settings tabs. Replace them with the provider configuration.
- Remove purchase buttons and network calls from the archived pricing page.
- Remove credit balances, estimated-credit copy, reservation checks, insufficient-credit errors, settlement, and deductions from both generation flows.
- Remove billing and credit wording from login, marketing metadata, navigation, settings, legal pages, and email copy.

### Preserve dormant data

Keep existing billing-related Prisma models and User fields in this release. Do not expose them through routes or UI, and do not mutate them. Mark them as intentionally dormant in the schema and architecture documentation.

The generation pipeline continues to record token usage for diagnostics, but token counts no longer map to credits or entitlements.

## Onboarding and settings experience

Implement one provider-setup form used by both the first-run dialog and Settings. It contains:

- provider preset selector;
- Custom HTTPS base URL field when Custom is selected;
- editable model ID;
- password-style API-key input that is cleared after save;
- concise encryption/provider-disclosure note;
- Validate and save action with specific, safe errors;
- masked saved-key hint, last verification time, replace, and delete actions in Settings.

The dialog opens once when an authenticated account has neither a credential nor `aiSetupPromptDismissedAt`. Dismissal records the timestamp. Every generation entry point checks credential status on the server and reopens setup if absent. Client gating is presentation only; API routes enforce the same rule.

## Authentication

Keep Better Auth with Google, GitHub, and email/password.

- Set `BETTER_AUTH_URL=https://pdx.sdey.me`.
- Register `https://pdx.sdey.me/api/auth/callback/google` with Google.
- Register `https://pdx.sdey.me/api/auth/callback/github` with GitHub and include GitHub's email scope.
- Set Google and GitHub client IDs and secrets in the new Coolify application.
- Configure a Resend API key and verified `AUTH_EMAIL_FROM` for password resets.
- Keep `requireEmailVerification` disabled and automatic sign-in after email signup enabled.
- Change password-reset sending to avoid blocking the auth response while preserving delivery through the host runtime.

Google, GitHub, and Resend credentials are not present in the documented VPS credential inventory. Deployment is blocked until the direct credentials and verified sender are available.

## Dependency plan

The dependency checkpoint is complete and verified:

| Package | Before | Now | Reason |
| --- | --- | --- | --- |
| `next` | `16.2.11` | `16.3.3` | Current stable Next.js release |
| `eslint-config-next` | `16.2.11` | `16.3.3` | Keep framework lint rules aligned |
| `ai` | `6.0.233` | `6.0.271` | Compatible fixes without AI SDK 7 migration |
| `@ai-sdk/openai-compatible` | absent | `2.0.73` | One provider adapter for all BYOK endpoints |
| `@ai-sdk/deepseek` | `2.0.x` | remove | Replaced by OpenAI-compatible BYOK adapter |
| `@ai-sdk/google` | `3.0.x` | remove | Server-funded Google path is removed |
| `better-auth` | `1.6.23` | `1.7.2` | Auth code is in scope; verify release notes and flows |
| Prisma packages | `7.9.0` | `7.10.0` | Add credential schema without Prisma 8 migration |
| `zod` | `4.4.3` | `4.5.2` | Credential and endpoint validation |
| `resend` | `6.18.0` | `6.25.0` | Password-reset path is in scope |
| `bullmq` | `5.80.10` | `5.81.4` | Queue fixes without BullMQ 6 migration |

Take other patch/minor updates only when they are touched or required by the selected versions. Keep React `19.2.x`, TypeScript `6.x`, ESLint `9.x`, and all unrelated major versions unchanged.

After each dependency group, run lint, type checking, Worker compilation, and the production build before feature changes continue.

## Database migration plan

The repository has a Prisma schema but no migration history. Do not add automatic production migration execution until this is corrected.

1. Inspect the production Neon schema read-only and compare it with `prisma/schema.prisma`.
2. Create a baseline migration representing the existing schema.
3. Test the baseline on an isolated database.
4. Mark the baseline as applied in production without replaying its DDL.
5. Create a separate additive migration for the credential record and onboarding timestamp.
6. Back up the target database and apply the additive migration.
7. Only then add a one-shot `migrate` Compose service using `prisma migrate deploy` for future releases.

Every database write requires the exact Neon target to be confirmed immediately before execution.

## Docker Compose target

Keep one production Compose file with four roles:

- `redis`: private, password protected, persistent volume, PING health check;
- `migrate`: one-shot schema deployment after migration history is established;
- `web`: public on container port `3000`, depends on healthy Redis and successful migration, has an app-plus-database health check;
- `worker`: private, depends on healthy Redis, healthy Web, and migration completion, has a Redis health check.

Add explicit init and graceful-stop behavior, bounded health-check timing, and sensible restart policies. Keep Worker scratch and Redis data in named volumes. Do not publish Redis, Worker, or migrate ports.

The Coolify Web domain must be configured as `https://pdx.sdey.me:3000`. The `:3000` suffix tells Coolify which internal container port to route; public users still browse normal HTTPS port 443.

Remove server AI provider keys and billing variables from Web and Worker. Add `BYOK_ENCRYPTION_KEY` to Web only. Worker receives credentials through the authenticated private Web endpoint.

## Implementation sequence

### Phase 1: dependency checkpoint, completed

- Upgraded the selected compatible package versions and regenerated the Bun lockfile.
- Added `@ai-sdk/openai-compatible`; existing provider packages remain until their call sites migrate.
- Lint, type checking, Worker compilation, and the Next.js 16.3.3 production build pass.
- Kept this work separate from feature implementation.

### Phase 2: credential data and deep module, completed

- Establish Prisma migration history and add the credential schema.
- Implement authenticated encryption, preset registry, URL policy, validation probe, status/save/delete operations, and internal Worker resolution.
- Add focused tests at the pure module and response boundaries, including encryption tamper detection, redaction, URL rejection, and credential/queue leak prevention. Database ownership and pending-generation behavior remains an integration gate against the adopted schema.

### Phase 3: generation migration, completed

- Replace Web and Worker model factories with OpenAI-compatible model creation from the user's resolved configuration.
- Remove server model fallback and provider environment validation.
- Keep keys out of job payloads and logs.
- Remove all credit gates, reservation, settlement, and credit response fields.
- Add focused credential-response and Worker queue-contract tests.

### Phase 4: product and auth UI, implementation completed

- Build the reusable provider form, first-run dialog, server-side generation gate, and Settings view.
- Archive the pricing page and disable its checkout behavior.
- Remove billing settings and primary pricing navigation.
- Update copy, legal pages, metadata, and privacy disclosure.
- Verify Google, GitHub, email signup/sign-in, and password reset locally with provider test credentials.

Google/GitHub OAuth and Resend remain unverified until production credentials are supplied.

### Phase 5: production Compose, completed locally

- Add the migration target after the production baseline is established.
- Tighten health checks and startup dependencies.
- Render Compose using safe placeholder values and inspect the generated services, networks, volumes, and exposed ports.
- Build both ARM64 targets locally through the repository's safe runner.

### Phase 6: parallel Coolify deployment, pending

1. Resolve the exact `noteformula` project, `production` environment, server, and GitHub App source.
2. Create a new Docker Compose application from `Dey11/pdx.git`, branch `master`, without modifying the current application.
3. Add only the required runtime variables and secrets.
4. Configure the Web domain as `https://pdx.sdey.me:3000`.
5. Create an A record for `pdx.sdey.me` in the authoritative Namecheap DNS zone, pointing to the re-confirmed Coolify server IP.
6. Deploy and wait for migrate, Redis, Web, and Worker to reach their expected states.
7. Verify public health, TLS, authentication, credential setup, one controlled theory generation, one controlled question-bank generation, R2 download, logs, and restart recovery.
8. Stop the old broken application only after the replacement passes. Do not delete the old resource or volumes in this release.

## Verification gates

### Automated

- `bun run lint`
- `bun run typecheck`
- focused credential, URL-policy, route, and queue-contract tests
- `bun run worker:build`
- `bun run build`
- `docker compose --env-file <safe-test-env> config --quiet`
- local container health checks for Redis, Web, and Worker

The implemented release passes focused Bun tests, lint, type checking, Worker compilation, and the Next.js production build. Compose rendering and production database checks remain deployment gates.

### Product

- New and existing accounts see setup once and can dismiss it.
- Every generation API rejects accounts without a verified credential.
- Settings can save, replace, revalidate, and delete a credential without ever returning the key.
- Invalid key, model, endpoint, rate limit, and structured-output failures have safe, distinct messages.
- Provider credentials never appear in browser responses, Redis jobs, logs, traces, analytics, or generated PDFs.
- Pricing has no checkout action; billing endpoints return 404 because they no longer exist.
- Credit balances and estimated-credit copy are absent from active product flows.

### Production

- `https://pdx.sdey.me/api/health` returns HTTP `200` with Web and database checks equal to `ok`.
- TLS is valid and HTTP redirects to HTTPS.
- Google callback: `https://pdx.sdey.me/api/auth/callback/google`.
- GitHub callback: `https://pdx.sdey.me/api/auth/callback/github`.
- Email signup/sign-in and password reset work without email verification.
- Redis and Worker have no public ports.
- Controlled theory and question-bank jobs finish, upload to R2, and download through the authenticated route.
- A Web or Worker restart does not lose queued work or credential access.

## Rollback

- Keep the existing Coolify application stopped but intact until the new deployment is stable.
- Roll DNS back to the prior target only if one exists; `pdx.sdey.me` currently has no record.
- Keep database changes additive in this release. Rolling application code back does not require dropping credential data.
- Preserve the previous application image and the database backup made before the additive migration.
- Never print, export, or copy decrypted user keys during rollback or diagnosis.

## External blockers before deployment

- Google OAuth client ID and secret with the production callback registered.
- GitHub OAuth client ID and secret with the production callback and email scope registered.
- Resend API key and a verified sender address for `pdx.sdey.me` or its parent domain.
- Confirmation of the production Neon database before migration writes.
- Authorization at execution time to create the Cloudflare DNS record and the new Coolify application.

No production provider, DNS, database, or deployment state was changed while preparing this plan.
