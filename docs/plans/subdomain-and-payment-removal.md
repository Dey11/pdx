# Public subdomain and payment-removal plan

Status: discovery complete; implementation not started.

## Goal

Make NoteFormula reachable on an approved public subdomain and remove the payment integration so the remaining product works without payment-provider configuration.

## Context

The repository already contains a Coolify Compose deployment, but the public NoteFormula hostname returns `503 no available server` and Coolify marks the application unhealthy. The codebase still includes Dodo Payments routes, webhook processing, pricing and billing UI, transaction data, coupon administration, payment environment variables, and the `dodopayments` dependency.

## Scope

- Repair the Web service health and Coolify proxy target.
- Attach the user-approved subdomain and update all public-origin configuration.
- Remove payment purchase and webhook flows.
- Remove or redesign billing-facing UI so no dead checkout actions remain.
- Preserve generation, credits required for generation, authentication, history, settings, email, R2, and Worker behavior unless a product decision explicitly changes them.
- Update environment templates and operator documentation.

## Decisions required before implementation

- Exact subdomain and parent domain.
- Whether all authenticated users receive a fixed credit allowance, unlimited generation, or admin/coupon-issued credits after payments are removed.
- Whether transaction history, coupon redemption, and existing payment records remain visible/read-only, are removed from the product, or are migrated away.
- Whether `/pricing` is removed, redirected, or rewritten as a non-payment product page.
- Whether existing production user and transaction data must be retained.

## Non-goals

- Changing AI providers, generation prompts, PDF layout, or storage architecture.
- Moving away from Coolify, Neon, Redis, or R2.
- Rebranding the remaining old PDX visual and social assets unless separately requested.

## Chosen architectural direction

Treat payment removal as removal of a bounded billing capability, not as disabled environment variables. First define the post-payment entitlement model; then simplify UI, API, data access, dependencies, configuration, and documentation around that model. Keep database migrations backward-compatible until retention requirements are settled.

## Implementation phases

1. Decide the subdomain, entitlement model, and data-retention policy.
2. Restore current Web health without changing product behavior.
3. Remove billing UI and payment entry points.
4. Remove payment API routes, webhook handling, payment-only libraries, and environment requirements.
5. Apply any approved schema migration with a verified backup and rollback path.
6. Configure the approved domain, auth callbacks, email links, and analytics origin in Coolify.
7. Deploy through the existing GitHub App pipeline and run the verification checklist in `docs/deployment/coolify.md`.

## Validation

- Lint, type checking, Worker build, and production Web build pass.
- `/api/health` returns `200` publicly.
- Authentication and password reset use the new public origin.
- A controlled end-to-end generation completes and downloads correctly.
- No page or API route offers checkout or requires Dodo credentials.
- Existing retained users and materials remain accessible.

## Risks

- Removing billing before choosing an entitlement model can block generation or grant unintended usage.
- Changing the public origin can break OAuth callbacks and email links.
- Deleting transaction or subscription fields before confirming retention requirements can destroy useful production records.
- A proxy-only fix can hide an underlying database or Web startup failure; health must be verified at each layer.
