
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xfjpxbilihusruuvfgdb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmanB4YmlsaWh1c3J1dXZmZ2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDc5NjAsImV4cCI6MjA1NzEyMzk2MH0.0RFYvMUoGs9e6PvsDu9g6I-tBeFIgQDDHmBnhriYotc';

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing. Check your environment variables.');
}

// Create Supabase client with appropriate type casting
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
