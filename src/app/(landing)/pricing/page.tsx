import React, { Suspense } from "react";

import { FAQ } from "@/components/pricing/faq";
import PricingSection from "@/components/pricing/pricing-section";
import { H2 } from "@/components/typography/h2";
import { EMAIL } from "@/lib/constants";

const page = () => {
  return (
    <div className="mx-auto min-h-screen max-w-[1400px] pt-[20dvh] text-center">
      <div className="container">
        <H2>Plans made for</H2>
        <H2 className="text-brand-green">Your needs</H2>

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
