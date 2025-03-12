
import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from "recharts";
import { useTrades } from "@/hooks/useTrades";
import { generatePnLChartData, formatCurrency } from "@/utils/tradeAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-chart-tooltip p-2 rounded shadow-lg text-white text-sm">
        <p className="font-semibold">{`Date: ${label}`}</p>
        <p>{`Trade P&L: ${formatCurrency(payload[0].payload.pnl)}`}</p>
        <p>{`Cumulative P&L: ${formatCurrency(payload[0].payload.cumulativePnL)}`}</p>
      </div>
    );
  }

  return null;
};

const PnLChart = () => {
  const { trades } = useTrades();
  const chartData = generatePnLChartData(trades);

  const minValue = Math.min(0, ...chartData.map(item => item.cumulativePnL));
  const maxValue = Math.max(0, ...chartData.map(item => item.cumulativePnL));
  const paddingValue = (maxValue - minValue) * 0.1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Format date to be more readable
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                  domain={[minValue - paddingValue, maxValue + paddingValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Area 
                  type="monotone" 
                  dataKey="cumulativePnL" 
                  stroke="#0EA5E9" 
                  fillOpacity={1} 
                  fill="url(#colorPnL)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Add trades to see your P&L chart</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PnLChart;
