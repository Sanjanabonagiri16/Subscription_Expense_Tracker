import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: PlanFeature[];
  popular?: boolean;
}

interface SubscriptionPlansProps {
  plans?: Plan[];
  onSelectPlan?: (planId: string) => void;
}

const defaultPlans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    billingPeriod: "monthly",
    features: [
      { name: "Basic Analytics", included: true },
      { name: "Up to 1,000 subscribers", included: true },
      { name: "Email Support", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "Custom Branding", included: false },
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    billingPeriod: "monthly",
    features: [
      { name: "Basic Analytics", included: true },
      { name: "Up to 10,000 subscribers", included: true },
      { name: "Priority Support", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Custom Branding", included: true },
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    billingPeriod: "monthly",
    features: [
      { name: "Basic Analytics", included: true },
      { name: "Unlimited subscribers", included: true },
      { name: "24/7 Phone Support", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Custom Branding", included: true },
    ],
  },
];

const SubscriptionPlans = ({
  plans = defaultPlans,
  onSelectPlan = () => console.log("Plan selected"),
}: SubscriptionPlansProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative bg-white ${plan.popular ? "border-2 border-blue-500" : ""}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Popular
              </span>
            </div>
          )}
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500 ml-1">
                  /{plan.billingPeriod}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <div className="h-5 w-5 border-2 rounded-full mr-2" />
                  )}
                  <span className={!feature.included ? "text-gray-500" : ""}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => onSelectPlan(plan.id)}
            >
              Choose {plan.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
