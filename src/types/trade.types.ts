
export interface Trade {
  id: string;
  date: Date;
  symbol: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  fees: number;
  notes: string;
}

export type TradingSymbol = "XAUUSD" | "XAGUSD" | "EURUSD" | "USDJPY" | "BTCUSD" | "SPX500";

export interface TradeRecommendation {
  id: string;
  symbol: string;
  direction: "long" | "short";
  currentPrice: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rationale: string;
  source: string;
  timestamp: Date;
  strength: "strong" | "moderate" | "weak";
}

export interface TradeContextType {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, "id">) => Promise<void>;
  updateTrade: (id: string, trade: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  getTradeById: (id: string) => Trade | undefined;
  calculatePnL: (trade: Trade) => number;
  isLoading: boolean;
  error: Error | null;
}
