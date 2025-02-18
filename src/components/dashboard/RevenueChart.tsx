import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data?: RevenueData[];
}

const defaultData: RevenueData[] = [
  { date: "2024-01", revenue: 5000 },
  { date: "2024-02", revenue: 7500 },
  { date: "2024-03", revenue: 10000 },
  { date: "2024-04", revenue: 8500 },
  { date: "2024-05", revenue: 12000 },
  { date: "2024-06", revenue: 15000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const RevenueChart = ({ data = defaultData }: RevenueChartProps) => {
  const [timeRange, setTimeRange] = useState("monthly");

  return (
    <Card className="p-6 w-full bg-white">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Revenue Trends</h2>
          <Tabs
            defaultValue="monthly"
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="date"
                stroke="#888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: "#0ea5e9", r: 4 }}
                activeDot={{ r: 6, fill: "#0ea5e9" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default RevenueChart;
