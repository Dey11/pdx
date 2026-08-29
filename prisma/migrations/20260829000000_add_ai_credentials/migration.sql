-- Add BYOK onboarding state without altering dormant billing history.
ALTER TABLE "users"
ADD COLUMN "ai_setup_prompt_dismissed_at" TIMESTAMP(3);

CREATE TABLE "ai_credentials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "encrypted_key" TEXT NOT NULL,
    "key_hint" TEXT NOT NULL,
    "verified_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_credentials_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ai_credentials_user_id_key" ON "ai_credentials"("user_id");

ALTER TABLE "ai_credentials"
ADD CONSTRAINT "ai_credentials_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
