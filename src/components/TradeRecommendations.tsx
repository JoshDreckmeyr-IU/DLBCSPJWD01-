
import React, { useState, useEffect } from "react";
import { getSymbolRecommendations } from "@/services/recommendationService";
import { TradeRecommendation, TradingSymbol } from "@/types/trade.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Target, Shield, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const symbolOptions: { value: TradingSymbol; label: string }[] = [
  { value: "XAUUSD", label: "Gold (XAU/USD)" },
  { value: "XAGUSD", label: "Silver (XAG/USD)" },
  { value: "EURUSD", label: "EUR/USD" },
  { value: "USDJPY", label: "USD/JPY" },
  { value: "BTCUSD", label: "Bitcoin (BTC/USD)" },
  { value: "SPX500", label: "S&P 500" },
];

const TradeRecommendations = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<TradingSymbol>("XAUUSD");
  const [recommendations, setRecommendations] = useState<TradeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRecommendations = async (symbol: TradingSymbol) => {
    setLoading(true);
    try {
      const data = await getSymbolRecommendations(symbol);
      setRecommendations(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations. Please try again.");
      toast({
        title: "Error",
        description: `Failed to load ${symbol} recommendations`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(selectedSymbol);
    
    // In a real app, you might want to refresh recommendations periodically
    const intervalId = setInterval(() => fetchRecommendations(selectedSymbol), 300000); // refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [selectedSymbol]);

  const handleSymbolChange = (value: string) => {
    setSelectedSymbol(value as TradingSymbol);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (price: number) => {
    return price.toFixed(price > 1000 ? 0 : price > 100 ? 1 : 2);
  };

  const getStrengthColor = (strength: "strong" | "moderate" | "weak") => {
    switch (strength) {
      case "strong": return "bg-green-500 text-white";
      case "moderate": return "bg-yellow-500 text-white";
      case "weak": return "bg-gray-500 text-white";
    }
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Trading Recommendations</h2>
          <div className="w-full md:w-64">
            <Select
              disabled={true}
              value={selectedSymbol}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Symbol" />
              </SelectTrigger>
              <SelectContent>
                {symbolOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-red-800">Error Loading Recommendations</h3>
        </div>
        <p className="text-red-700">{error}</p>
        <Button onClick={() => fetchRecommendations(selectedSymbol)} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const getSymbolName = (symbol: string) => {
    const option = symbolOptions.find(opt => opt.value === symbol);
    return option ? option.label : symbol;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Trading Recommendations</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <Select
              value={selectedSymbol}
              onValueChange={handleSymbolChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Symbol" />
              </SelectTrigger>
              <SelectContent>
                {symbolOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => fetchRecommendations(selectedSymbol)} 
            variant="outline" 
            size="default"
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Refreshing..." : "Refresh"}
            <RefreshCw className={`h-4 w-4 ml-1 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className={rec.direction === "long" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getSymbolName(rec.symbol)}
                    {rec.direction === "long" ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <Badge className={getStrengthColor(rec.strength)}>
                      {rec.strength.charAt(0).toUpperCase() + rec.strength.slice(1)}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(rec.timestamp)} • {rec.source}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${rec.direction === "long" ? "text-green-600" : "text-red-600"}`}>
                    {rec.direction === "long" ? "BUY" : "SELL"} at {formatPrice(rec.entryPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current: {formatPrice(rec.currentPrice)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-4">{rec.rationale}</div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 border border-red-100">
                  <Shield className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">Stop Loss</div>
                    <div className="font-medium">{formatPrice(rec.stopLoss)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 border border-green-100">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">Take Profit</div>
                    <div className="font-medium">{formatPrice(rec.takeProfit)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex justify-between w-full">
                <span className="text-sm text-muted-foreground">
                  Risk/Reward Ratio: {Math.abs((rec.takeProfit - rec.entryPrice) / (rec.stopLoss - rec.entryPrice)).toFixed(2)}
                </span>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                  <ExternalLink className="h-4 w-4 mr-1" /> View Analysis
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TradeRecommendations;
