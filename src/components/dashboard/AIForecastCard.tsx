import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { ChurnPrediction } from "@/lib/analytics";

interface ForecastData extends Omit<ChurnPrediction, "userId"> {
  predictedMrr: string;
  predictedChurn: string;
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
  trendIndicators: {
    mrr: "up" | "down" | "stable";
    churn: "up" | "down" | "stable";
  };
}

interface AIForecastCardProps {
  forecast?: ForecastData;
}

const defaultForecast: ForecastData = {
  predictedMrr: "$12,500",
  predictedChurn: "2.1%",
  riskLevel: "low",
  recommendations: [
    "Consider offering annual plan discounts",
    "Engage users with new feature announcements",
    "Follow up with at-risk customers",
  ],
};

const AIForecastCard = ({
  forecast = defaultForecast,
}: AIForecastCardProps) => {
  const getRiskBadge = (level: ForecastData["riskLevel"]) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[level]}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </Badge>
    );
  };

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">AI Forecast</h3>
          </div>
          {getRiskBadge(forecast.riskLevel)}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Predicted MRR</span>
            </div>
            <p className="text-xl font-semibold">{forecast.predictedMrr}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Predicted Churn</span>
            </div>
            <p className="text-xl font-semibold">{forecast.predictedChurn}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            AI Recommendations
          </h4>
          <ul className="space-y-2">
            {forecast.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-purple-500">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIForecastCard;
