import { supabase } from "./supabase";

export interface CacheConfig {
  key: string;
  ttl: number;
  data: any;
}

export interface PerformanceMetrics {
  apiLatency: number;
  databaseQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  timestamp: string;
}

export const cacheData = async (config: CacheConfig) => {
  const { error } = await supabase.from("cache").upsert([
    {
      key: config.key,
      data: config.data,
      expires_at: new Date(Date.now() + config.ttl).toISOString(),
    },
  ]);

  if (error) throw error;
};

export const getCachedData = async (key: string) => {
  const { data, error } = await supabase
    .from("cache")
    .select("data")
    .eq("key", key)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error) return null;
  return data?.data;
};

export const recordPerformanceMetrics = async (
  metrics: Omit<PerformanceMetrics, "timestamp">,
) => {
  const { error } = await supabase
    .from("performance_metrics")
    .insert([{ ...metrics, timestamp: new Date().toISOString() }]);

  if (error) throw error;
};
