"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

import { PricingTab } from "./pricing-tabs";

type PricingType = "monthly" | "annually" | "one-time";

const pricingPlans = {
  monthly: [
    {
      name: "Scholar",
      price: "$8",
      duration: "monthly" as const,
      features: [
        { id: 1, name: "300 credits ~ 2-3 subjects", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 3, name: "Basic customer support", isAvailable: true },
        { id: 4, name: "Material Downloads", isAvailable: true },
        { id: 5, name: "Extra credits carried forward", isAvailable: false },
        { id: 6, name: "Priority access to new features", isAvailable: false },
      ],
    },
    {
      name: "Prodigy",
      price: "$15",
      duration: "monthly" as const,
      features: [
        { id: 1, name: "700 credits ~ 4-5 subjects", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 3, name: "Priority customer support", isAvailable: true },
        { id: 4, name: "Material Downloads", isAvailable: true },
        { id: 5, name: "Extra credits carried forward", isAvailable: true },
        { id: 6, name: "Priority access to new features", isAvailable: true },
      ],
    },
    {
      name: "Student",
      price: "$0",
      duration: "monthly" as const,
      features: [
        { id: 1, name: "25 credits ~ for testing", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 4, name: "Material Downloads", isAvailable: true },
        { id: 3, name: "Customer support", isAvailable: false },
        { id: 5, name: "Extra credits carried forward", isAvailable: false },
        { id: 6, name: "Priority access to new features", isAvailable: false },
      ],
    },
  ],
  annually: [
    {
      name: "Visionary",
      price: "$90",
      duration: "annually" as const,
      features: [
        { id: 1, name: "Unlimited credits for the year*", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 3, name: "Priority customer support", isAvailable: true },
        { id: 4, name: "Material Downloads", isAvailable: true },
        { id: 5, name: "Benefits in Community", isAvailable: true },
        { id: 6, name: "Best gen models, always", isAvailable: true },
      ],
    },
  ],
  "one-time": [
    {
      name: "Starter",
      price: "$2",
      duration: "one-time" as const,
      features: [
        { id: 1, name: "50 credits ~ 2-3 topics", isAvailable: true },
        { id: 2, name: "High quality materials", isAvailable: true },
        { id: 3, name: "Material downloads", isAvailable: true },
        { id: 4, name: "Customer support", isAvailable: true },
      ],
    },
  ],
};

const PricingSection = () => {
  const [selectedTab, setSelectedTab] = useState<PricingType>("monthly");
  const [currentPlan, setCurrentPlan] = useState<
    "Student" | "Visionary" | "Prodigy" | "Scholar"
  >("Student");
  const session = useSession();

  const fetchPlan = async () => {
    try {
      const response = await fetch("/api/plan");
      const data = await response.json();
      switch (data.plan) {
        case "visionary":
          setCurrentPlan("Visionary");
          break;
        case "prodigy":
          setCurrentPlan("Prodigy");
          break;
        case "scholar":
          setCurrentPlan("Scholar");
          break;
        default:
          setCurrentPlan("Student");
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPlan();
    } else {
      setCurrentPlan("Student");
    }
  }, [session]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto mb-12 flex w-fit gap-1 rounded-3xl bg-brand-text p-1 text-sm font-semibold shadow-[0px_1px_3px_#00FF1E]">
        {(["monthly", "annually", "one-time"] as PricingType[]).map((tab) => (
          <button
            key={tab}
            className={cn(
              "cursor-pointer rounded-3xl px-4 py-2 capitalize transition-colors",
              selectedTab === tab
                ? "bg-white text-brand-bg"
                : "text-white hover:bg-white/10"
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
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {pricingPlans[selectedTab].map((plan, index) => (
            <PricingTab
              key={index}
              name={plan.name}
              price={plan.price}
              duration={plan.duration}
              features={plan.features}
              isActive={plan.name.includes("Prodigy")}
              onClick={() => setSelectedTab(selectedTab)}
              currentPlan={"Student"}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PricingSection;
