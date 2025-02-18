import React from "react";
import { Card, CardContent } from "../ui/card";
import { ArrowUpIcon, ArrowDownIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  prefix?: string;
  tooltip?: string;
  currency?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  prefix = "",
  tooltip,
  currency = "USD",
}: MetricCardProps) => {
  const isPositive = change >= 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold text-gray-900">
                    {prefix}
                    {value}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    {currency !== "USD" && currency}
                  </span>
                </div>
                <span
                  className={`ml-2 flex items-center text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  {isPositive ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                  {Math.abs(change)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

import { exportMetrics } from "@/lib/analytics";

interface MetricsGridProps {
  metrics?: {
    mrr: { value: string; change: number };
    arr: { value: string; change: number };
    subscribers: { value: string; change: number };
    churnRate: { value: string; change: number };
    arpu: { value: string; change: number };
    ltv: { value: string; change: number };
  };
  onExport?: (format: "csv" | "excel" | "json") => void;
}

const MetricsGrid = ({
  metrics = {
    mrr: { value: "10,500", change: 12.5 },
    arr: { value: "126,000", change: 15.2 },
    subscribers: { value: "1,234", change: 8.2 },
    churnRate: { value: "2.4", change: -0.5 },
    arpu: { value: "85", change: 4.3 },
    ltv: { value: "1,250", change: 7.8 },
  },
  onExport = () => console.log("Export metrics"),
}: MetricsGridProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport("csv")}>
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("excel")}>
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("json")}>
              JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={metrics.mrr.value}
          change={metrics.mrr.change}
          prefix="$"
          tooltip="Total revenue generated from all active subscriptions"
        />
        <MetricCard
          title="Annual Recurring Revenue"
          value={metrics.arr.value}
          change={metrics.arr.change}
          prefix="$"
          tooltip="Projected annual revenue based on current MRR"
        />
        <MetricCard
          title="Total Subscribers"
          value={metrics.subscribers.value}
          change={metrics.subscribers.change}
          tooltip="Total number of active subscribers"
        />
        <MetricCard
          title="Churn Rate"
          value={metrics.churnRate.value}
          change={metrics.churnRate.change}
          prefix=""
          tooltip="Percentage of subscribers who cancelled this month"
        />
        <MetricCard
          title="Average Revenue Per User"
          value={metrics.arpu.value}
          change={metrics.arpu.change}
          prefix="$"
          tooltip="Average monthly revenue per subscriber"
        />
        <MetricCard
          title="Customer Lifetime Value"
          value={metrics.ltv.value}
          change={metrics.ltv.change}
          prefix="$"
          tooltip="Average total revenue generated per customer"
        />
      </div>
    </div>
  );
};

export default MetricsGrid;
