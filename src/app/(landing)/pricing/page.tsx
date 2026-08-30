import { Suspense } from "react";

import { FAQ } from "@/components/pricing/faq";
import PricingSection from "@/components/pricing/pricing-section";
import { H1 } from "@/components/typography/h1";
import { EMAIL } from "@/lib/constants";

export const metadata = {
  title: "Pricing | PDX",
  description:
    "PDX is free with BYOK. The previous pricing plans remain visible for reference, but purchasing is disabled.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pdx.sdey.me/pricing",
    siteName: "PDX",
    title: "PDX - AI Study Material Generator | Pricing",
    description:
      "PDX is free with BYOK. Connect an OpenAI-compatible provider and generate study materials without buying a PDX plan.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDX - Transform Your Study Experience",
      },
    ],
  },
};

const PricingPage = () => {
  return (
    <div className="mx-auto min-h-screen max-w-[1400px] pt-[20dvh] text-center">
      <div className="container mx-auto">
        <H1 className="text-brand-heading">Plans made for</H1>
        <H1 className="text-brand-blue">Your needs</H1>

        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl px-4 text-base leading-relaxed sm:text-lg">
          PDX is now free with BYOK. Bring your own OpenAI-compatible API key;
          no PDX plan or payment is required.
        </p>

        <Suspense>
          <PricingSection />
        </Suspense>

        <FAQ />

        <p>
          Still have queries? Mail us at{" "}
          <span className="text-brand-yellow">{EMAIL}</span>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
