import { CheckCircle, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { H2 } from "../typography/h2";
import { H3 } from "../typography/h3";
import { Button } from "../ui/button";

type PricingTabProps = {
  name: string;
  price: string;
  features: readonly {
    id: number;
    name: string;
    isAvailable: boolean;
  }[];
  isActive: boolean;
};

export function PricingTab({
  name,
  price,
  features,
  isActive,
}: PricingTabProps) {
  return (
    <div className="relative">
      {isActive && (
        <div className="absolute -top-7 right-0 left-0 -z-10 h-20 rounded-t-3xl bg-gradient-to-r from-[#576265] from-8% via-[#757A7B] via-40% to-[#576265] to-75%">
          <H3 className="text-base">Best value</H3>
        </div>
      )}
      <div
        className={cn(
          "w-full max-w-sm cursor-pointer rounded-3xl p-[1px]",
          "bg-gradient-to-b from-[#FFC947] to-[#666666]"
        )}
      >
        <Card className="bg-background h-full rounded-3xl p-2">
          <div className="space-y-4">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <H3 className="text-xl font-bold">{name}</H3>
              </div>

              <H2 className="text-left text-4xl font-bold">{price}</H2>
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
                    <CheckCircle className="text-brand-yellow h-4 w-4" />
                  ) : (
                    <XCircle className="text-muted-foreground h-4 w-4" />
                  )}
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="bg-brand-yellow hover:bg-brand-yellow/80 mt-10 mb-2 w-full rounded-xl text-black"
            disabled
            type="button"
          >
            Purchases disabled
          </Button>
        </Card>
      </div>
    </div>
  );
}
