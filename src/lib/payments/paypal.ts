import { supabase } from "../supabase";

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  webhookId: string;
}

export const initializePayPal = async (config: PayPalConfig) => {
  const { error } = await supabase.from("payment_providers").upsert([
    {
      provider: "paypal",
      config: {
        client_id: config.clientId,
        webhook_id: config.webhookId,
      },
    },
  ]);

  if (error) throw error;
};

export const createPayPalOrder = async (amount: number, currency: string) => {
  const { data, error } = await supabase.functions.invoke(
    "paypal-create-order",
    {
      body: { amount, currency },
    },
  );

  if (error) throw error;
  return data;
};

export const handlePayPalWebhook = async (event: any) => {
  const { data, error } = await supabase.functions.invoke("paypal-webhook", {
    body: event,
  });

  if (error) throw error;
  return data;
};
