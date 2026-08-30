import { PricingTab } from "./pricing-tabs";

const pricingPlans = [
  {
    name: "Starter",
    price: "$1",
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
    features: [
      { id: 1, name: "1500 credits ~ 16-17 subjects", isAvailable: true },
      { id: 2, name: "High quality materials", isAvailable: true },
      { id: 3, name: "Priority customer support", isAvailable: true },
      { id: 4, name: "Material Downloads", isAvailable: true },
    ],
  },
] as const;

const PricingSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="bg-brand-bg mx-auto mb-12 flex w-fit gap-1 rounded-3xl p-1 text-sm font-semibold shadow-[0px_1px_3px_#FFC947]">
        <span className="rounded-3xl px-4 py-2 capitalize">one-time</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-10 pt-10 sm:gap-6">
        {pricingPlans.map((plan) => (
          <PricingTab
            key={plan.name}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            isActive={plan.name === "Plus"}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
