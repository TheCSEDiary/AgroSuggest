import { createClient } from '@supabase/supabase-js'

// These environment variables will be stored in a .env file
// which we'll create in the next step.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create the Supabase client
// This client will handle authentication and database queries
export const supabase = createClient(supabaseUrl, supabaseAnonKey)