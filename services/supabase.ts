import { createClient, SupabaseClient } from '@supabase/supabase-js';

// This file no longer exports a singleton client.
// Instead, it provides a factory function to create clients on-demand
// based on user-provided credentials.

let currentClient: SupabaseClient | null = null;

/**
 * Creates and returns a new Supabase client instance.
 * @param supabaseUrl The URL of the user's Supabase project.
 * @param supabaseAnonKey The anon key of the user's Supabase project.
 * @returns A new SupabaseClient instance.
 */
export const createSupabaseClient = (supabaseUrl: string, supabaseAnonKey: string): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required to create a client.');
  }
  const client = createClient(supabaseUrl, supabaseAnonKey);
  currentClient = client;
  return client;
};


/**
 * Returns the currently active Supabase client instance.
 * This is useful for components that need to interact with Supabase auth state.
 * @returns The active SupabaseClient or null if not initialized.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
    return currentClient;
}
