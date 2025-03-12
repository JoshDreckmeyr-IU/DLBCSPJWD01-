
import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { Trade, TradeContextType } from "@/types/trade.types";
import { 
  fetchUserTrades, 
  addTradeToDb, 
  updateTradeInDb, 
  deleteTradeFromDb,
  calculatePnL
} from "@/services/tradeService";

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch trades when user changes
  useEffect(() => {
    const loadTrades = async () => {
      try {
        setIsLoading(true);
        
        // Only fetch trades if user is authenticated
        if (!user) {
          setTrades([]);
          setIsLoading(false);
          return;
        }

        const fetchedTrades = await fetchUserTrades(user.id);
        setTrades(fetchedTrades);
      } catch (error) {
        console.error("Error fetching trades:", error);
        setError(error as Error);
        toast.error("Failed to load trades");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrades();
  }, [user]);

  const addTrade = async (trade: Omit<Trade, "id">) => {
    try {
      if (!user) {
        toast.error("You must be logged in to add trades");
        return;
      }
      
      const newTrade = await addTradeToDb(trade, user.id);
      setTrades(prevTrades => [newTrade, ...prevTrades]);
      toast.success("Trade added successfully");
    } catch (error) {
      console.error("Error adding trade:", error);
      setError(error as Error);
      toast.error("Failed to add trade");
      throw error;
    }
  };

  const updateTrade = async (id: string, updatedTradeFields: Partial<Trade>) => {
    try {
      if (!user) {
        toast.error("You must be logged in to update trades");
        return;
      }

      await updateTradeInDb(id, updatedTradeFields, user.id);
      
      setTrades(prevTrades =>
        prevTrades.map(trade =>
          trade.id === id ? { ...trade, ...updatedTradeFields } : trade
        )
      );
      
      toast.success("Trade updated successfully");
    } catch (error) {
      console.error("Error updating trade:", error);
      setError(error as Error);
      toast.error("Failed to update trade");
      throw error;
    }
  };

  const deleteTrade = async (id: string) => {
    try {
      if (!user) {
        toast.error("You must be logged in to delete trades");
        return;
      }

      await deleteTradeFromDb(id, user.id);

      setTrades(prevTrades => prevTrades.filter(trade => trade.id !== id));
      toast.success("Trade deleted successfully");
    } catch (error) {
      console.error("Error deleting trade:", error);
      setError(error as Error);
      toast.error("Failed to delete trade");
      throw error;
    }
  };

  const getTradeById = (id: string) => {
    return trades.find((trade) => trade.id === id);
  };

  return (
    <TradeContext.Provider
      value={{
        trades,
        addTrade,
        updateTrade,
        deleteTrade,
        getTradeById,
        calculatePnL,
        isLoading,
        error
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export default TradeContext;
