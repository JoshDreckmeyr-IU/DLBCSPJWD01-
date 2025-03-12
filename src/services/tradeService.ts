import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { Trade } from "@/types/trade.types";

// Convert database trade to our app's Trade format
export const mapDbTradeToTrade = (dbTrade: Database['public']['Tables']['trades']['Row']): Trade => ({
  id: dbTrade.id,
  date: new Date(dbTrade.date),
  symbol: dbTrade.symbol || '',
  direction: dbTrade.direction as "long" | "short",
  entryPrice: Number(dbTrade.entry_price) || 0,
  exitPrice: Number(dbTrade.exit_price) || 0,
  quantity: Number(dbTrade.quantity) || 0,
  leverage: Number(dbTrade.leverage) || 1,
  stopLoss: Number(dbTrade.stop_loss) || 0,
  takeProfit: Number(dbTrade.take_profit) || 0,
  fees: Number(dbTrade.fees) || 0,
  notes: dbTrade.notes || '',
});

// Convert our app's Trade format to database format
export const mapTradeToDbTrade = (trade: Omit<Trade, 'id'>, userId: string): Database['public']['Tables']['trades']['Insert'] => ({
  user_id: userId,
  date: trade.date.toISOString(),
  symbol: trade.symbol,
  direction: trade.direction,
  entry_price: trade.entryPrice,
  exit_price: trade.exitPrice,
  quantity: trade.quantity,
  leverage: trade.leverage,
  stop_loss: trade.stopLoss,
  take_profit: trade.takeProfit,
  fees: trade.fees,
  notes: trade.notes,
});

export const fetchUserTrades = async (userId: string): Promise<Trade[]> => {
  console.log("Fetching trades for user:", userId);
  
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  if (!data) return [];
  
  console.log("Trades fetched:", data.length);
  return data.map(mapDbTradeToTrade);
};

export const addTradeToDb = async (trade: Omit<Trade, "id">, userId: string): Promise<Trade> => {
  console.log("Adding trade for user:", userId, trade);
  
  const dbTrade = mapTradeToDbTrade(trade, userId);
  
  // Log the transformed trade for debugging
  console.log("Transformed trade for DB:", dbTrade);
  
  const { data, error } = await supabase
    .from('trades')
    .insert(dbTrade)
    .select()
    .single();

  if (error) {
    console.error("Error adding trade to Supabase:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to add trade - no data returned");
  }
  
  console.log("Trade added successfully:", data);
  return mapDbTradeToTrade(data);
};

export const updateTradeInDb = async (id: string, updatedTradeFields: Partial<Trade>, userId: string): Promise<void> => {
  // Prepare data for Supabase update (convert from camelCase to snake_case)
  const updates: Partial<Database['public']['Tables']['trades']['Update']> = {};
  
  if (updatedTradeFields.date) updates.date = updatedTradeFields.date.toISOString();
  if (updatedTradeFields.symbol) updates.symbol = updatedTradeFields.symbol;
  if (updatedTradeFields.direction) updates.direction = updatedTradeFields.direction;
  if (updatedTradeFields.entryPrice !== undefined) updates.entry_price = updatedTradeFields.entryPrice;
  if (updatedTradeFields.exitPrice !== undefined) updates.exit_price = updatedTradeFields.exitPrice;
  if (updatedTradeFields.quantity !== undefined) updates.quantity = updatedTradeFields.quantity;
  if (updatedTradeFields.leverage !== undefined) updates.leverage = updatedTradeFields.leverage;
  if (updatedTradeFields.stopLoss !== undefined) updates.stop_loss = updatedTradeFields.stopLoss;
  if (updatedTradeFields.takeProfit !== undefined) updates.take_profit = updatedTradeFields.takeProfit;
  if (updatedTradeFields.fees !== undefined) updates.fees = updatedTradeFields.fees;
  if (updatedTradeFields.notes !== undefined) updates.notes = updatedTradeFields.notes;

  console.log("Updating trade:", id, updates);

  const { error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error("Error updating trade in Supabase:", error);
    throw error;
  }
};

export const deleteTradeFromDb = async (id: string, userId: string): Promise<void> => {
  console.log("Deleting trade:", id);

  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error("Error deleting trade from Supabase:", error);
    throw error;
  }
};

export const calculatePnL = (trade: Trade): number => {
  const { direction, entryPrice, exitPrice, quantity, fees } = trade;
  
  if (direction === "long") {
    return (exitPrice - entryPrice) * quantity - fees;
  } else {
    return (entryPrice - exitPrice) * quantity - fees;
  }
};
