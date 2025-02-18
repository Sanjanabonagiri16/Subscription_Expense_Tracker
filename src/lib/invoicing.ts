import { supabase } from "./supabase";

export interface TaxRate {
  id: string;
  country: string;
  region?: string;
  rate: number;
  type: "vat" | "gst" | "sales";
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  tax: number;
  taxRate: TaxRate;
  status: "draft" | "pending" | "paid" | "failed";
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxable: boolean;
}

export const generateInvoice = async (
  subscriptionId: string,
): Promise<Invoice> => {
  const { data, error } = await supabase
    .from("invoices")
    .insert([{ subscription_id: subscriptionId, status: "draft" }])
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
};

export const calculateTax = async (
  amount: number,
  countryCode: string,
  regionCode?: string,
) => {
  const { data: taxRate } = await supabase
    .from("tax_rates")
    .select("*")
    .eq("country", countryCode)
    .eq("region", regionCode || "")
    .single();

  return {
    taxAmount: amount * (taxRate?.rate || 0),
    taxRate: taxRate as TaxRate,
  };
};

export const sendInvoiceEmail = async (invoiceId: string) => {
  // Implement email sending logic
  return supabase.functions.invoke("send-invoice-email", {
    body: { invoiceId },
  });
};

export const retryFailedInvoice = async (invoiceId: string) => {
  const { data, error } = await supabase
    .from("invoices")
    .update({ status: "pending" })
    .eq("id", invoiceId)
    .select()
    .single();

  return { data, error };
};
