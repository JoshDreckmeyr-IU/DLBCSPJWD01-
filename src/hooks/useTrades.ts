
import { useContext } from "react";
import TradeContext from "@/contexts/TradeContext";
import { Trade } from "@/types/trade.types";

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error("useTrades must be used within a TradeProvider");
  }
  return context;
};

// Re-export Trade type for convenience
export type { Trade };
