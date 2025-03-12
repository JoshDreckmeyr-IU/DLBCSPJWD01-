
import React from "react";
import { useTrades } from "@/hooks/useTrades";
import { calculateAnalytics, formatCurrency, formatPercentage } from "@/utils/tradeAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";

const AnalyticsSummary = () => {
  const { trades } = useTrades();
  const analytics = calculateAnalytics(trades);

  const metrics = [
    {
      title: "Win Rate",
      value: formatPercentage(analytics.winRate),
      icon: <PieChart className="h-4 w-4 text-muted-foreground" />,
      description: `${analytics.winCount} wins / ${analytics.totalTrades} trades`,
      color: analytics.winRate > 50 ? "text-profit" : "text-loss",
    },
    {
      title: "Net P&L",
      value: formatCurrency(analytics.netPnL),
      icon: analytics.netPnL >= 0 
        ? <TrendingUp className="h-4 w-4 text-muted-foreground" />
        : <TrendingDown className="h-4 w-4 text-muted-foreground" />,
      description: `${analytics.totalTrades} trades`,
      color: analytics.netPnL >= 0 ? "text-profit" : "text-loss",
    },
    {
      title: "Avg. R:R",
      value: analytics.averageRR.toFixed(2),
      icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
      description: "Risk/Reward Ratio",
      color: analytics.averageRR >= 1 ? "text-profit" : "text-loss",
    },
    {
      title: "Profit Factor",
      value: analytics.profitFactor.toFixed(2),
      icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
      description: "Profit / Loss",
      color: analytics.profitFactor >= 1 ? "text-profit" : "text-loss",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsSummary;
