import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, Building2, AlertCircle } from "lucide-react";

import { PaymentMethod } from "@/lib/payments";

interface PaymentMethodDisplay extends PaymentMethod {
  status: "active" | "failed";
}

interface PaymentMethodsCardProps {
  methods?: PaymentMethod[];
}

const defaultMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    status: "active",
    lastFour: "4242",
    expiryDate: "12/24",
  },
  { id: "2", type: "wallet", status: "active" },
  { id: "3", type: "bank", status: "failed" },
];

const PaymentMethodsCard = ({
  methods = defaultMethods,
}: PaymentMethodsCardProps) => {
  const getIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "wallet":
        return <Wallet className="h-5 w-5" />;
      case "bank":
        return <Building2 className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`${method.status === "failed" ? "text-red-500" : "text-gray-600"}`}
                >
                  {getIcon(method.type)}
                </div>
                <div>
                  <p className="font-medium capitalize">{method.type}</p>
                  {method.lastFour && (
                    <p className="text-sm text-gray-500">
                      ****{method.lastFour}
                    </p>
                  )}
                </div>
              </div>
              {method.status === "failed" && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
