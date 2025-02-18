import { supabase } from "./supabase";

export interface PaymentMethod {
  id: string;
  userId: string;
  type: "card" | "bank_account" | "paypal";
  provider: "stripe" | "paypal" | "square";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  paymentMethodId: string;
  subscriptionId: string;
}

export const addPaymentMethod = async (
  userId: string,
  paymentMethodData: Partial<PaymentMethod>,
) => {
  const { data, error } = await supabase
    .from("payment_methods")
    .insert([{ user_id: userId, ...paymentMethodData }])
    .select()
    .single();

  return { data, error };
};

import { encryptSensitiveData } from "./security";
import { logAuditEvent } from "./security";

export const processPayment = async (
  paymentMethodId: string,
  amount: number,
  currency = "usd",
) => {
  // Encrypt sensitive payment data
  const encryptedPaymentMethod = await encryptSensitiveData(paymentMethodId);

  // Log the payment attempt
  await logAuditEvent({
    userId: "current-user",
    action: "payment_attempt",
    resource: "payment_intents",
    metadata: { amount, currency },
  });
  // This would typically call your payment processor's API
  const { data, error } = await supabase
    .from("payment_intents")
    .insert([
      {
        payment_method_id: paymentMethodId,
        amount,
        currency,
        status: "pending",
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const retryFailedPayment = async (paymentIntentId: string) => {
  // Implement retry logic here
  const { data, error } = await supabase
    .from("payment_intents")
    .update({ status: "pending" })
    .eq("id", paymentIntentId)
    .select()
    .single();

  return { data, error };
};
