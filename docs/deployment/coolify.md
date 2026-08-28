# Coolify deployment runbook

## Intended production shape

- Provider: Coolify at `cooldash.xyz`.
- Project: `noteformula`.
- Environment: `production`.
- Source repository: `Dey11/pdx.git`.
- Branch: `master`.
- Build pack: Docker Compose using `/docker-compose.yml`.
- Public service: `web` on container port `3000`.
- Internal services: `worker` and `redis`.
- External database: Neon through `DATABASE_URL`.

Never assume those values still match the provider. Resolve the exact application, environment, and domain before a write.

## Current finding (2026-08-28 UTC)

Coolify contains an application for this repository in the NoteFormula production environment. The application is running but reports `unhealthy`.

The intended Compose domain is `https://noteformula.cooldash.xyz`, but public requests to `/` and `/api/health` return `503 no available server`. The application record also exposes a generated hostname with an erroneous-looking `:3000` suffix. This is a configured deployment, not a working hosted site.

No production settings were changed while recording this finding.

## Required configuration

Start from `.env.production.docker.example` and replace every placeholder in Coolify. Important invariants:

- `SERVICE_FQDN_WEB_3000` is the public HTTPS origin routed to Web port `3000`.
- `BETTER_AUTH_URL` uses that same public origin.
- OAuth callback URLs and password-reset links use that same origin.
- `DATABASE_URL` names the confirmed Neon production database.
- `REDIS_PASSWORD` is set; Web and Worker use the Compose service name `redis`.
- `WORKER_CALLBACK_SECRET` is non-empty and identical for Web and Worker.
- `BACKEND_URL` remains `http://web:3000` inside Compose.
- Every provider named by `AI_GENERATION_MODELS` has a corresponding API key.
- R2 credentials and `BUCKET_NAME` point to the intended production bucket.

If billing is intentionally removed, remove its UI, routes, webhook behavior, schema assumptions, dependencies, and environment variables as one coherent product change. Do not merely blank the payment secrets on a build that still exposes billing actions.

## Pre-deployment checks

1. Confirm the Coolify project, production environment, application UUID, Git repository, and branch.
2. Confirm the chosen public subdomain and its DNS target.
3. Confirm no unrelated application already owns the domain.
4. Compare Coolify variables with `.env.production.docker.example` without printing secret values.
5. Render the Compose configuration locally with safe placeholder values and inspect the `web`, `worker`, and `redis` services.
6. Run `safe-dev-run bun run lint`, `safe-dev-run bun run typecheck`, `safe-dev-run bun run worker:build`, and `safe-dev-run bun run build` in proportion to the change.
7. Confirm the production Prisma schema separately. Coolify does not apply it.

## Post-deployment verification

1. Confirm all three Compose services are running and inspect their individual health states.
2. Request `/api/health`; require HTTP `200` with both `app` and `database` equal to `ok`.
3. Load `/`, `/login`, and `/dashboard` through the public HTTPS domain.
4. Verify authentication callbacks use the public domain and do not redirect to an old origin.
5. Enqueue one controlled generation and verify queue progress, Worker callbacks, PDF rendering, R2 upload, and authenticated download.
6. Check Web and Worker logs for missing variables, database failures, Redis failures, callback authentication failures, and Chromium errors.
7. If payment removal is part of the release, confirm that pricing, settings, navigation, API routes, webhooks, and environment requirements no longer expose or depend on billing.

## Diagnosing `503 no available server`

Work from the public route inward:

1. Confirm the domain is attached specifically to the Compose `web` service.
2. Confirm Coolify routes to container port `3000`, not host port `3000` and not port `80`.
3. Inspect the Web container status and logs. A running container can still fail its health check.
4. From inside the Web container, request `http://127.0.0.1:3000/api/health`.
5. If Web responds but health is `503`, validate database reachability and `DATABASE_URL`.
6. If Web does not respond, inspect the build output, startup command, `HOSTNAME=0.0.0.0`, and `PORT=3000`.
7. After correcting the application-level cause, verify Coolify regenerated proxy labels for the intended HTTPS hostname and removed stale generated-domain routing.

Do not restart the Coolify daemon or alter unrelated proxy, server, application, or DNS resources while diagnosing this application.
