"use client";

import React, { useState } from "react";

import BillingSection from "@/components/settings/billing";
import RedeemSection from "@/components/settings/redeem-section";
import SettingsTabs from "@/components/settings/settings-tab";
import { H2 } from "@/components/typography/h2";

export type TabType = "Billing" | "Redeem";

const page = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Redeem");

  return (
    <div className="mx-auto min-h-[70dvh] max-w-[1200px] p-4 px-4">
      <H2 className="py-8 text-brand-green">Settings</H2>

      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Billing" && <BillingSection />}
      {activeTab === "Redeem" && <RedeemSection />}
    </div>
  );
};

export default page;
