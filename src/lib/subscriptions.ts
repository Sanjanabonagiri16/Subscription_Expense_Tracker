import { supabase } from "./supabase";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: "monthly" | "quarterly" | "yearly";
  features: string[];
  trialDays?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "cancelled" | "past_due";
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export const createSubscription = async (
  userId: string,
  planId: string,
): Promise<{ data: Subscription | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert([{ user_id: userId, plan_id: planId }])
    .select()
    .single();

  return { data: data as Subscription, error };
};

export const updateSubscription = async (
  subscriptionId: string,
  updates: Partial<Subscription>,
) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", subscriptionId)
    .select()
    .single();

  return { data, error };
};

export const cancelSubscription = async (subscriptionId: string) => {
  return updateSubscription(subscriptionId, {
    cancelAtPeriodEnd: true,
    status: "cancelled",
  });
};
