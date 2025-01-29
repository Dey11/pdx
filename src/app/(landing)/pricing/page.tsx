import React, { Suspense } from "react";

import { FAQ } from "@/components/pricing/faq";
import PricingSection from "@/components/pricing/pricing-section";
import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { EMAIL } from "@/lib/constants";

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
