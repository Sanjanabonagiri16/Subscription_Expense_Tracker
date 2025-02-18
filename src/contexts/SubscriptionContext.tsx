import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RevenueMetrics, getRevenueMetrics } from "@/lib/analytics";
import { Subscription } from "@/lib/subscriptions";
import { Invoice } from "@/lib/invoicing";
import { PaymentMethod } from "@/lib/payments";

interface SubscriptionContextType {
  metrics: RevenueMetrics | null;
  subscriptions: Subscription[];
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch metrics
      const metricsData = await getRevenueMetrics("month");
      setMetrics(metricsData);

      // Fetch subscriptions
      const { data: subscriptionsData } = await supabase
        .from("subscriptions")
        .select("*");
      setSubscriptions(subscriptionsData || []);

      // Fetch invoices
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*");
      setInvoices(invoicesData || []);

      // Fetch payment methods
      const { data: paymentMethodsData } = await supabase
        .from("payment_methods")
        .select("*");
      setPaymentMethods(paymentMethodsData || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const subscriptionsSubscription = supabase
      .channel("subscriptions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions" },
        fetchData,
      )
      .subscribe();

    const invoicesSubscription = supabase
      .channel("invoices")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices" },
        fetchData,
      )
      .subscribe();

    return () => {
      subscriptionsSubscription.unsubscribe();
      invoicesSubscription.unsubscribe();
    };
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        metrics,
        subscriptions,
        invoices,
        paymentMethods,
        loading,
        error,
        refreshData: fetchData,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
};
