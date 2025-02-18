import { supabase } from "../supabase";

export interface StripeConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
}

export const initializeStripe = async (config: StripeConfig) => {
  const { error } = await supabase.from("payment_providers").upsert([
    {
      provider: "stripe",
      config: {
        public_key: config.publicKey,
        webhook_secret: config.webhookSecret,
      },
    },
  ]);

  if (error) throw error;
};

export const createStripePaymentIntent = async (
  amount: number,
  currency: string,
  paymentMethodId: string,
) => {
  const { data, error } = await supabase.functions.invoke(
    "stripe-create-payment",
    {
      body: { amount, currency, paymentMethodId },
    },
  );

  if (error) throw error;
  return data;
};

export const handleStripeWebhook = async (event: any) => {
  const { data, error } = await supabase.functions.invoke("stripe-webhook", {
    body: event,
  });

  if (error) throw error;
  return data;
};
