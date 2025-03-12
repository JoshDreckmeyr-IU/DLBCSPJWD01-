
import React from "react";
import { useTrades } from "@/hooks/useTrades";
import { calculateAnalytics, formatCurrency } from "@/utils/tradeAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PerformanceMetrics = () => {
  const { trades } = useTrades();
  const analytics = calculateAnalytics(trades);

  const metrics = [
    {
      title: "Total Trades",
      value: analytics.totalTrades.toString(),
    },
    {
      title: "Win / Loss",
      value: `${analytics.winCount} / ${analytics.lossCount}`,
    },
    {
      title: "Largest Win",
      value: formatCurrency(analytics.largestWin),
      color: "text-profit",
    },
    {
      title: "Largest Loss",
      value: formatCurrency(analytics.largestLoss),
      color: "text-loss",
    },
    {
      title: "Average Win",
      value: formatCurrency(analytics.averageWin),
      color: "text-profit",
    },
    {
      title: "Average Loss",
      value: formatCurrency(analytics.averageLoss),
      color: "text-loss",
    },
    {
      title: "Successive Wins",
      value: analytics.successiveWins.toString(),
    },
    {
      title: "Successive Losses",
      value: analytics.successiveLosses.toString(),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {metric.title}
              </p>
              <p className={`text-xl font-bold ${metric.color || ''}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
