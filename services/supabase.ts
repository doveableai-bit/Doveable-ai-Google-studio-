
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugibwxuskjdwyrdlenjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaWJ3eHVza2pkd3lyZGxlbmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzgxNDMsImV4cCI6MjA3Njg1NDE0M30._NhSM_qoWDAIZ4lk26jRH8anoUbk8CgjhnvcXKQoIrY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
