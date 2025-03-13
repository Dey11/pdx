"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

import { PricingTab } from "./pricing-tabs";

type PricingType = "one-time";

const pricingPlans = {
  "one-time": [
    {
      name: "Starter",
      price: "$1",
      duration: "one-time" as const,
      features: [
        { id: 1, name: "150 credits ~ 1-2 subjects", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 3, name: "Basic Customer support", isAvailable: true },
        { id: 4, name: "Material downloads", isAvailable: true },
      ],
    },
    {
      name: "Plus",
      price: "$5",
      duration: "one-time" as const,
      features: [
        { id: 1, name: "700 credits ~ 6-7 subjects", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 3, name: "Basic customer support", isAvailable: true },
        { id: 4, name: "Material Downloads", isAvailable: true },
      ],
    },
    {
      name: "Pro",
      price: "$10",
      duration: "one-time" as const,
      features: [
        { id: 1, name: "1500 credits ~ 16-17 subjects", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 3, name: "Priority customer support", isAvailable: true },
        { id: 4, name: "Material Downloads", isAvailable: true },
      ],
    },
  ],
};

const PricingSection = () => {
  const [selectedTab, setSelectedTab] = useState<PricingType>("one-time");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto mb-12 flex w-fit gap-1 rounded-3xl bg-brand-bg p-1 text-sm font-semibold shadow-[0px_1px_3px_#FFC947]">
        {(["one-time"] as PricingType[]).map((tab) => (
          <button
            key={tab}
            className={cn(
              "cursor-pointer rounded-3xl px-4 py-2 capitalize transition-colors"
              // selectedTab === tab
              //   ? "bg-white text-brand-bg"
              //   : "text-white hover:bg-white/10"
            )}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-10 pt-10 sm:gap-6"
        >
          {pricingPlans[selectedTab].map((plan, index) => (
            <PricingTab
              key={index}
              name={plan.name}
              price={plan.price}
              duration={plan.duration}
              features={plan.features}
              isActive={plan.name.includes("Plus")}
              onClick={() => setSelectedTab(selectedTab)}
              currentPlan={"Student"}
              setError={setError}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default PricingSection;
