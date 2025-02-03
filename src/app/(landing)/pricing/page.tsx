import React, { Suspense } from "react";

import { FAQ } from "@/components/pricing/faq";
import PricingSection from "@/components/pricing/pricing-section";
import { H1 } from "@/components/typography/h1";
import { EMAIL } from "@/lib/constants";

export const metadata = {
  title: "Pricing",
  description: "Pricing plans for ease of affordability",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usepdx.tech",
    siteName: "PDX",
    title: "PDX - AI Study Material Generator | Pricing",
    description:
      "Transform your syllabus into in-depth, 100+ page study materials using AI. Customize and generate comprehensive PDFs tailored for your academic success. Pricing plans made for your convenience and affordability.",
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

const page = () => {
  return (
    <div className="mx-auto min-h-screen max-w-[1400px] pt-[20dvh] text-center">
      <div className="container">
        <H1>Plans made for</H1>
        <H1 className="text-brand-green">Your needs</H1>

        <Suspense>
          <PricingSection />
        </Suspense>

        <FAQ />

        <p>
          Still have queries? Mail us at{" "}
          <span className="text-brand-green">{EMAIL}</span>
        </p>
      </div>
    </div>
  );
};

export default page;
