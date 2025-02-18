import React from "react";
import MetricsGrid from "./dashboard/MetricsGrid";
import RevenueChart from "./dashboard/RevenueChart";
import QuickActions from "./dashboard/QuickActions";
import NotificationPanel from "./dashboard/NotificationPanel";
import SubscriptionTable from "./dashboard/SubscriptionTable";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Home = () => {
  const { metrics, subscriptions, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <MetricsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <NotificationPanel />
        </div>
      </div>
      <SubscriptionTable />
    </div>
  );
};

export default Home;
