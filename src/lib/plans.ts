import { supabase } from "./supabase";

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: "monthly" | "quarterly" | "yearly";
  features: string[];
  trialDays?: number;
  isActive: boolean;
  createdAt: string;
}

export const createPlan = async (
  plan: Omit<Plan, "id" | "createdAt" | "isActive">,
) => {
  const { data, error } = await supabase
    .from("subscription_plans")
    .insert([{ ...plan, isActive: true }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePlan = async (planId: string, updates: Partial<Plan>) => {
  const { data, error } = await supabase
    .from("subscription_plans")
    .update(updates)
    .eq("id", planId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePlan = async (planId: string) => {
  // Soft delete by setting isActive to false
  return updatePlan(planId, { isActive: false });
};

export const getPlans = async () => {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("isActive", true)
    .order("price");

  if (error) throw error;
  return data;
};

export const applyDiscount = async (
  planId: string,
  discountPercent: number,
  expiryDays: number,
) => {
  const plan = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (plan.error) throw plan.error;

  const discountedPrice = plan.data.price * (1 - discountPercent / 100);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  const { error } = await supabase.from("plan_discounts").insert([
    {
      plan_id: planId,
      discount_percent: discountPercent,
      discounted_price: discountedPrice,
      expires_at: expiryDate.toISOString(),
    },
  ]);

  if (error) throw error;
};
