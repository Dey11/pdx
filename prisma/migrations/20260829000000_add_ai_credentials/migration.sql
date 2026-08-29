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

-- Persist queue intent so an ambiguous Redis write can be retried safely.
CREATE TABLE "generation_dispatches" (
    "material_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generation_dispatches_pkey" PRIMARY KEY ("material_id")
);

ALTER TABLE "generation_dispatches"
ADD CONSTRAINT "generation_dispatches_material_id_fkey"
FOREIGN KEY ("material_id") REFERENCES "Material"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve question numbering when a multi-topic question-bank job retries.
ALTER TABLE "MaterialTask"
ADD COLUMN "next_question_number" INTEGER;
