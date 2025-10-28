// Application configuration constants.

// NOTE: In a typical build environment, these would be loaded from 
// environment variables (e.g., process.env.REACT_APP_SUPABASE_URL).
// Since this app appears to run directly in the browser without a build step,
// we are defining them as constants here to ensure the application can start.
export const SUPABASE_URL = 'https://ugibwxuskjdwyrdlenjq.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaWJ3eHVza2pkd3lyZGxlbmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzgxNDMsImV4cCI6MjA3Njg1NDE0M30._NhSM_qoWDAIZ4lk26jRH8anoUbk8CgjhnvcXKQoIrY';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // This check is kept for robustness, although with hardcoded values it's less likely to fail.
    console.error("Supabase URL or Anon Key is not set. Authentication and database features will not work.");
}
