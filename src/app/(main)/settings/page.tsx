import { AiCredentialForm } from "@/components/settings/ai-credential-form";
import { H2 } from "@/components/typography/h2";
import { getAiCredentialStatus } from "@/lib/ai/credential-service";
import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();
  const status = await getAiCredentialStatus(session!.user.id);

  return (
    <main className="mx-auto min-h-[70dvh] max-w-[1200px] px-4 py-8">
      <H2 className="text-brand-heading">Settings</H2>
      <section className="border-border bg-brand-bg/50 mt-8 rounded-xl border p-5 sm:p-7">
        <div className="mb-6 max-w-2xl">
          <h3 className="text-brand-heading text-xl font-semibold text-balance">
            AI provider
          </h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
            Choose an OpenAI-compatible provider and model. PDX verifies the
            connection before saving it.
          </p>
        </div>
        <AiCredentialForm initialStatus={status} />
      </section>
    </main>
  );
};

export default Page;
