import { ArrowLeftRight, CreditCard, Gift, User } from "lucide-react";

import { TabType } from "@/app/(main)/settings/page";
import { cn } from "@/lib/utils";

type SettingsTabsProps = {
  activeTab: TabType;
  setActiveTab: (s: TabType) => void;
};

const SettingsTabs = ({ activeTab, setActiveTab }: SettingsTabsProps) => {
  return (
    <div className="flex w-fit gap-2 rounded-lg bg-brand-bg">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded-sm p-1 px-2 text-xs hover:bg-brand-heading hover:text-black sm:text-sm",
            activeTab === tab.name &&
              "bg-brand-yellow/90 font-medium text-black hover:bg-brand-yellow/80"
          )}
          onClick={() => setActiveTab(tab.name as TabType)}
        >
          <tab.icon className="size-4" />
          {tab.name}
        </div>
      ))}
    </div>
  );
};

const tabs = [
  {
    id: 1,
    name: "Billing",
    icon: CreditCard,
  },
  {
    id: 2,
    name: "Redeem",
    icon: Gift,
  },
  {
    id: 3,
    name: "Transactions",
    icon: ArrowLeftRight,
  },
  {
    id: 4,
    name : "Profile",
    icon : User,
  }
];

export default SettingsTabs;
