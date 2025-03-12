import { Trade } from "@/types/trade.types";

export interface TradeAnalytics {
  totalTrades: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netPnL: number;
  averageRR: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  averageWin: number;
  averageLoss: number;
  successiveWins: number;
  successiveLosses: number;
}

export const calculateAnalytics = (trades: Trade[]): TradeAnalytics => {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winCount: 0,
      lossCount: 0,
      winRate: 0,
      totalProfit: 0,
      totalLoss: 0,
      netPnL: 0,
      averageRR: 0,
      profitFactor: 0,
      largestWin: 0,
      largestLoss: 0,
      averageWin: 0,
      averageLoss: 0,
      successiveWins: 0,
      successiveLosses: 0
    };
  }

  let winCount = 0;
  let lossCount = 0;
  let totalProfit = 0;
  let totalLoss = 0;
  let largestWin = 0;
  let largestLoss = 0;
  let totalWinAmount = 0;
  let totalLossAmount = 0;
  let currentSuccessiveWins = 0;
  let currentSuccessiveLosses = 0;
  let maxSuccessiveWins = 0;
  let maxSuccessiveLosses = 0;
  let totalRR = 0;

  trades.forEach((trade) => {
    const { direction, entryPrice, exitPrice, quantity, stopLoss, takeProfit, fees } = trade;
    
    let pnl: number;
    if (direction === "long") {
      pnl = (exitPrice - entryPrice) * quantity - fees;
    } else {
      pnl = (entryPrice - exitPrice) * quantity - fees;
    }

    // Calculate risk-reward ratio for the trade
    let risk = 0;
    if (stopLoss > 0) {
      risk = Math.abs(direction === "long" ? entryPrice - stopLoss : stopLoss - entryPrice) * quantity;
    }
    
    let reward = 0;
    if (pnl > 0) {
      reward = pnl;
    } else if (takeProfit > 0) {
      reward = Math.abs(direction === "long" ? takeProfit - entryPrice : entryPrice - takeProfit) * quantity;
    }
    
    const rr = risk > 0 ? reward / risk : 0;
    if (rr > 0) totalRR += rr;

    if (pnl > 0) {
      winCount++;
      totalProfit += pnl;
      totalWinAmount += pnl;
      largestWin = Math.max(largestWin, pnl);
      currentSuccessiveWins++;
      currentSuccessiveLosses = 0;
      maxSuccessiveWins = Math.max(maxSuccessiveWins, currentSuccessiveWins);
    } else {
      lossCount++;
      totalLoss += Math.abs(pnl);
      totalLossAmount += pnl;
      largestLoss = Math.max(largestLoss, Math.abs(pnl));
      currentSuccessiveLosses++;
      currentSuccessiveWins = 0;
      maxSuccessiveLosses = Math.max(maxSuccessiveLosses, currentSuccessiveLosses);
    }
  });

  const totalTrades = trades.length;
  const winRate = (winCount / totalTrades) * 100;
  const netPnL = totalProfit - totalLoss;
  const averageWin = winCount > 0 ? totalProfit / winCount : 0;
  const averageLoss = lossCount > 0 ? totalLoss / lossCount : 0;
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
  const averageRR = winCount > 0 ? totalRR / winCount : 0;

  return {
    totalTrades,
    winCount,
    lossCount,
    winRate,
    totalProfit,
    totalLoss,
    netPnL,
    averageRR,
    profitFactor,
    largestWin,
    largestLoss,
    averageWin,
    averageLoss,
    successiveWins: maxSuccessiveWins,
    successiveLosses: maxSuccessiveLosses
  };
};

export const generatePnLChartData = (trades: Trade[]) => {
  if (trades.length === 0) return [];

  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  let cumulativePnL = 0;
  
  return sortedTrades.map(trade => {
    const pnl = trade.direction === "long" 
      ? (trade.exitPrice - trade.entryPrice) * trade.quantity - trade.fees
      : (trade.entryPrice - trade.exitPrice) * trade.quantity - trade.fees;
    
    cumulativePnL += pnl;
    
    return {
      date: trade.date.toISOString().split('T')[0],
      pnl,
      cumulativePnL: Number(cumulativePnL.toFixed(2))
    };
  });
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};
