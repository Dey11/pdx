"use client";

import React, { useState } from "react";

import BillingSection from "@/components/settings/billing";
import RedeemSection from "@/components/settings/redeem-section";
import SettingsTabs from "@/components/settings/settings-tab";
import { TransactionList } from "@/components/settings/transactions";
import { H2 } from "@/components/typography/h2";

export type TabType = "Billing" | "Redeem" | "Transactions";

const page = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Billing");

  return (
    <div className="mx-auto min-h-[70dvh] max-w-[1200px] p-4 px-4">
      <H2 className="py-8 text-brand-heading">Settings</H2>

      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Billing" && <BillingSection />}
      {activeTab === "Redeem" && <RedeemSection />}
      {activeTab === "Transactions" && <TransactionList />}
    </div>
  );
};

export default page;
