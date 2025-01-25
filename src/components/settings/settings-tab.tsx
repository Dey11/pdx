import { CreditCard, Gift, HandHelping } from "lucide-react";

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
            "flex cursor-pointer items-center gap-1 rounded-sm p-1 px-2 text-sm hover:bg-brand-text/90",
            activeTab === tab.name &&
              "bg-brand-green font-medium text-brand-text hover:bg-brand-green/80"
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
  // {
  //   id: 3,
  //   name: "Support",
  //   icon: HandHelping,
  // },
];

export default SettingsTabs;
