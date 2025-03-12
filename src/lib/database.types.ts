
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trades: {
        Row: {
          id: string
          user_id: string
          date: string
          symbol: string
          direction: 'long' | 'short'
          entry_price: number
          exit_price: number
          quantity: number
          leverage: number
          stop_loss: number
          take_profit: number
          fees: number
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          symbol: string
          direction: 'long' | 'short'
          entry_price: number
          exit_price: number
          quantity: number
          leverage?: number
          stop_loss: number
          take_profit: number
          fees: number
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          symbol?: string
          direction?: 'long' | 'short'
          entry_price?: number
          exit_price?: number
          quantity?: number
          leverage?: number
          stop_loss?: number
          take_profit?: number
          fees?: number
          notes?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
