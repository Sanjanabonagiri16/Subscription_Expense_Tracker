import { supabase } from "../supabase";

export interface DunningSettings {
  retrySchedule: number[];
  maxAttempts: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export const updateDunningSettings = async (settings: DunningSettings) => {
  const { error } = await supabase.from("dunning_settings").upsert([settings]);

  if (error) throw error;
};

export const processPaymentRetry = async (paymentIntentId: string) => {
  const { data, error } = await supabase.functions.invoke(
    "process-payment-retry",
    {
      body: { paymentIntentId },
    },
  );

  if (error) throw error;
  return data;
};

export const getDunningStatus = async (subscriptionId: string) => {
  const { data, error } = await supabase
    .from("payment_retries")
    .select("*")
    .eq("subscription_id", subscriptionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
