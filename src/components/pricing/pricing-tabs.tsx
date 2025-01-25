import React from "react";

import { CheckCircle, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { H2 } from "../typography/h2";
import { H3 } from "../typography/h3";
import { Button } from "../ui/button";

type PricingTabProps = {
  name: string;
  price: string;
  duration: "monthly" | "annually" | "one-time";
  features: {
    id: number;
    name: string;
    isAvailable: boolean;
  }[];
  isActive: boolean;
  currentPlan: "Student" | "Prodigy" | "Visionary" | "Scholar";
  onClick: () => void;
};

export function PricingTab({
  name,
  price,
  duration,
  features,
  isActive,
  currentPlan,
  onClick,
}: PricingTabProps) {
  return (
    <div className="relative">
      {isActive && (
        <div className="from-8% absolute -top-5 left-0 right-0 -z-10 h-12 rounded-t-3xl bg-gradient-to-r from-[#576265] via-[#757A7B] via-40% to-[#576265] to-75%">
          <H3 className="text-sm">Best value</H3>
        </div>
      )}
      <div
        className={cn(
          "w-full max-w-sm cursor-pointer rounded-3xl p-[1px]",
          "bg-gradient-to-b from-[#04D31C] to-[#666666]"
        )}
      >
        <Card
          className="h-full rounded-3xl bg-background p-2"
          onClick={onClick}
        >
          <div className="space-y-4">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <H3 className="text-xl font-bold">{name}</H3>
              </div>

              <H2 className="text-left text-4xl font-bold">
                {price}
                <span className="text-sm font-normal text-muted-foreground">
                  /
                  {duration === "one-time"
                    ? "once"
                    : duration === "monthly"
                      ? "mo"
                      : "yr"}
                </span>
              </H2>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-[#5D5D5D] to-[#C3C3C3]" />

            <ul className="space-y-2 p-2">
              {features.map((feature) => (
                <li
                  key={feature.id}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    !feature.isAvailable && "text-muted-foreground"
                  )}
                >
                  {feature.isAvailable ? (
                    <CheckCircle className="h-4 w-4 text-brand-green" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mb-2 mt-10 w-full bg-brand-green hover:bg-brand-green/80"
            disabled={name == currentPlan}
          >
            {name == currentPlan ? "Current Plan" : "Buy Now"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
