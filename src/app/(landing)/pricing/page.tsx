import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pricing archived | PDX",
  description: "PDX no longer sells plans or credits.",
};

const PricingArchivePage = () => (
  <main className="mx-auto flex min-h-[75dvh] max-w-2xl items-center px-5 py-20 text-center">
    <section className="border-brand-yellow/20 bg-brand-bg w-full rounded-xl border p-7 sm:p-10">
      <p className="text-brand-yellow text-sm font-medium tracking-[0.18em] uppercase">
        Pricing archived
      </p>
      <h1 className="text-brand-heading mt-4 text-3xl font-semibold text-balance sm:text-4xl">
        PDX is free to use
      </h1>
      <p className="text-muted-foreground mx-auto mt-4 max-w-lg leading-relaxed text-pretty">
        There are no plans, credits, or checkout. Connect your own
        OpenAI-compatible provider in settings and pay that provider directly
        for your usage.
      </p>
      <Button asChild className="mt-7 h-10">
        <Link href="/dashboard">Open PDX</Link>
      </Button>
    </section>
  </main>
);

export default PricingArchivePage;
