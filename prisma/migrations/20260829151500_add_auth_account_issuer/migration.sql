-- Better Auth 1.7 scopes provider identities by their trusted issuer.
ALTER TABLE "accounts" ADD COLUMN "issuer" TEXT NOT NULL;

DROP INDEX "accounts_provider_provider_account_id_key";

CREATE UNIQUE INDEX "accounts_issuer_provider_account_id_key"
ON "accounts"("issuer", "provider_account_id");
