import Link from "next/link";

import { Check, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pricing | PDX",
  description:
    "PDX is free. Bring your own API key from an OpenAI-compatible provider and pay that provider directly for your usage.",
};

const included = [
  "Theory notes and question-bank PDFs",
  "Any supported OpenAI-compatible provider",
  "No PDX subscription, credits, or checkout",
  "Encrypted provider-key storage",
] as const;

const PricingPage = () => (
  <main className="mx-auto min-h-[80dvh] max-w-5xl px-5 py-20 sm:py-28">
    <header className="mx-auto max-w-3xl text-center">
      <p className="text-brand-yellow text-sm font-medium tracking-[0.18em] uppercase">
        Free with BYOK
      </p>
      <h1 className="text-brand-heading mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        Pricing isn&apos;t needed anymore
      </h1>
      <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
        PDX is free. Bring an API key from your preferred OpenAI-compatible
        provider and use its models directly. We do not sell plans or credits.
      </p>
    </header>

    <section className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-[1.35fr_0.65fr]">
      <article className="border-brand-yellow/25 bg-brand-bg rounded-3xl border p-7 shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-brand-heading text-xl font-semibold">PDX</p>
            <p className="text-muted-foreground mt-1 text-sm">
              The complete study-material generator
            </p>
          </div>
          <span className="bg-brand-yellow/10 text-brand-yellow rounded-full px-3 py-1 text-xs font-medium">
            Free
          </span>
        </div>

        <div className="mt-8 flex items-end gap-2">
          <span className="text-brand-heading text-6xl font-semibold tracking-tight tabular-nums">
            $0
          </span>
          <span className="text-muted-foreground pb-2">from PDX</span>
        </div>

        <ul className="mt-8 space-y-3">
          {included.map((item) => (
            <li
              key={item}
              className="text-brand-heading flex items-start gap-3"
            >
              <Check
                aria-hidden="true"
                className="text-brand-yellow mt-0.5 size-5 shrink-0"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Button asChild className="mt-9 h-11 w-full active:scale-[0.96]">
          <Link href="/login">Create a free account</Link>
        </Button>
      </article>

      <aside className="border-brand-blue/20 bg-brand-bg/70 rounded-3xl border p-7 sm:p-8">
        <div className="bg-brand-blue/10 text-brand-blue flex size-11 items-center justify-center rounded-2xl">
          <KeyRound aria-hidden="true" className="size-5" />
        </div>
        <h2 className="text-brand-heading mt-6 text-xl font-semibold text-balance">
          You control provider costs
        </h2>
        <p className="text-muted-foreground mt-3 leading-relaxed text-pretty">
          Your provider may charge for the tokens you use. Those charges go
          directly to that provider under its own pricing and limits. PDX does
          not add a fee.
        </p>
        <Link
          href="/settings"
          className="text-brand-yellow mt-6 inline-flex min-h-10 items-center text-sm font-medium underline-offset-4 hover:underline"
        >
          Manage your provider
        </Link>
      </aside>
    </section>
  </main>
);

export default PricingPage;
