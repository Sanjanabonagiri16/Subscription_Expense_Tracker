import { supabase } from "./supabase";

export interface ChurnPrediction {
  userId: string;
  riskScore: number;
  riskFactors: string[];
  recommendedActions: string[];
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  churnRate: number;
  arpu: number;
  ltv: number;
  revenueByPlan: Record<string, number>;
  historicalRevenue: Array<{
    date: string;
    revenue: number;
    newSubscribers: number;
    churnedSubscribers: number;
  }>;
}

export const getRevenueMetrics = async (
  timeframe: "day" | "week" | "month" | "year",
): Promise<RevenueMetrics> => {
  const { data, error } = await supabase
    .from("revenue_metrics")
    .select("*")
    .eq("timeframe", timeframe)
    .single();

  if (error) throw error;
  return data as RevenueMetrics;
};

export const predictChurn = async (
  userId: string,
): Promise<ChurnPrediction> => {
  const { data, error } = await supabase
    .from("churn_predictions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data as ChurnPrediction;
};

export const exportMetrics = async (format: "csv" | "excel" | "json") => {
  const { data, error } = await supabase
    .from("revenue_metrics")
    .select("*")
    .csv();

  if (error) throw error;
  return data;
};
