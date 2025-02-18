import { supabase } from "../supabase";

export interface RefundRequest {
  paymentIntentId: string;
  amount: number;
  reason?: string;
  metadata?: Record<string, any>;
}

export const processRefund = async (request: RefundRequest) => {
  const { data, error } = await supabase.functions.invoke("process-refund", {
    body: request,
  });

  if (error) throw error;
  return data;
};

export const getRefundStatus = async (refundId: string) => {
  const { data, error } = await supabase
    .from("refunds")
    .select("*")
    .eq("id", refundId)
    .single();

  if (error) throw error;
  return data;
};
