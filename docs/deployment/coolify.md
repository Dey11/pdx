# Coolify deployment runbook

## Target

- Provider: the existing Coolify installation at `cooldash.xyz`
- Project/environment: `noteformula` / `production`
- Source: GitHub App, `Dey11/pdx.git`, branch `launch/byok-pdx`
- Build pack: Docker Compose at `/docker-compose.yml`
- Public origin: `https://pdx.sdey.me`
- Compose domain value: `https://pdx.sdey.me:3000`
- External database: clean Neon `pdx26` / `production` / `neondb`; all three migrations applied
- Replacement application UUID: `uqk9mqok4z1njt3vwaiizgjq`
- Deployed commit: `d64d9cf530b843ea7314abd179535fb320bbf7bf`

Current production health is `running:healthy`; `https://pdx.sdey.me/api/health` returns HTTP 200 with app and database checks equal to `ok`.

Create a parallel application. Do not modify or stop the old application until the replacement passes all gates.

## Why the old app is unusable

On 2026-08-29, Coolify reported the old application as `running:unhealthy`, while `/` and `/api/health` returned deterministic `503 no available server` responses. Web listened on container port `3000`, but the stored Compose domain omitted `:3000`; generated proxy labels therefore had no usable explicit Web load-balancer port and retained stale port-80 routing.

The deployed image was also behind the repository, and `pdx.sdey.me` had no DNS record. Google, GitHub, and Resend variables were empty; the replacement now launches with email/password only, so those optional providers are intentionally deferred.

The confirmed Neon target currently returns PostgreSQL error `53000` because its compute-time quota is exhausted. `sdey.me` is authoritative on Namecheap BasicDNS, not the available Cloudflare account. No Namecheap DNS credential is in the host inventory.

## Required variables

Start from `.env.production.docker.example`.

- `SERVICE_FQDN_WEB_3000=https://pdx.sdey.me:3000`
- `BETTER_AUTH_URL=https://pdx.sdey.me`
- exact new Neon pooled `DATABASE_URL` for Web/Worker and direct `DIRECT_URL` for migrations
- unique Redis password
- non-empty `WORKER_CALLBACK_SECRET`, shared by Web and Worker
- 32 random bytes in base64 as `BYOK_ENCRYPTION_KEY`, Web only
- optional Google and GitHub client IDs/secrets; leave blank for the initial email-only launch
- optional Resend key and verified `AUTH_EMAIL_FROM`; leave the key blank to disable password reset initially
- intended R2 credentials and bucket

Generate secrets outside Git, for example `openssl rand -base64 32`. Never print or copy filled values into logs or documentation. There are no payment or server AI-provider variables.

Use `sslmode=verify-full` in both Neon URLs so the Node PostgreSQL client keeps hostname and certificate verification explicit across future major releases.

## One-time database adoption

The migration service connects through `DIRECT_URL`; Web and Worker use the pooled `DATABASE_URL`.

The baseline describes the schema that existed before repository migration history. For an existing production database:

1. Resolve the exact Neon host/database and inspect it read-only.
2. Take or confirm a recoverable provider backup.
3. Confirm the live pre-BYOK objects match `00000000000000_baseline`.
4. Run `bunx prisma migrate resolve --applied 00000000000000_baseline` against that exact database.
5. Run `bunx prisma migrate deploy`; this applies `20260829000000_add_ai_credentials`.
6. Run `bunx prisma migrate status` and require no pending migration.

Do not mark the baseline on a new empty database. A new database should replay both migrations normally.

## Authentication

The initial launch uses email/password registration and sign-in without email verification. Leave Google, GitHub, and Resend variables blank. The login page derives its available methods from complete runtime credential pairs, so unavailable providers and password reset remain hidden.

When enabling optional providers later, register these exact callbacks:

- Google: `https://pdx.sdey.me/api/auth/callback/google`
- GitHub: `https://pdx.sdey.me/api/auth/callback/github`

Verify the Resend sender used by `AUTH_EMAIL_FROM` before setting `AUTH_RESEND_KEY`. Password reset remains disabled until then.

## Pre-deployment gates

1. Confirm the project, environment, server, GitHub source, branch, and new app UUID.
2. Confirm no other app owns `pdx.sdey.me`.
3. Confirm the DNS target from the selected Coolify server.
4. Compare variables against the template by presence, without printing values.
5. Confirm both new Neon URLs point to the same empty launch database, then replay both migrations normally.
6. Run tests, lint, type checking, Worker build, Next production build, frozen install, `docker compose config --quiet`, and both ARM64 image builds.
7. Push the reviewed commits only after all checks pass.

## Deployment and cutover

1. Create the parallel Compose application from the GitHub App source.
2. Set its Web domain to `https://pdx.sdey.me:3000`.
3. Set required variables, then create an A record for `pdx.sdey.me` in Namecheap DNS pointing to the re-confirmed Coolify server IP.
4. Deploy and wait for `migrate` to complete, Redis and Web to become healthy, and Worker to start.
5. Require `https://pdx.sdey.me/api/health` to return HTTP 200 with app/database `ok`.
6. Verify `/`, `/login`, authentication redirects, provider setup, Settings, and existing downloads.
7. Run one controlled theory generation and one question-bank generation through R2 download.
8. Inspect Web/Worker logs for missing variables, callback failures, leaked credentials, Redis/DB errors, and Chromium failures.
9. Stop—but do not delete—the old broken application only after every gate passes.

## Expected routing

Only Web receives a public route to container port `3000`. Redis, Worker, and migrate expose no public ports. The `:3000` in Coolify’s Compose domain identifies the internal destination; users browse normal HTTPS port 443.
