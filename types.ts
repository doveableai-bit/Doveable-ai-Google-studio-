import type { User } from '@supabase/supabase-js';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface AiThought {
  step: number;
  action: string;
  details: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

export interface GeneratedCode {
  plan: string;
  html: string;
  css: string;
  javascript: string;
}

export interface UserProfile {
    id: string;
    email?: string;
    created_at?: string;
    free_coins: number;
    purchased_coins: number;
    last_free_coin_grant: string | null;
    is_subscribed: boolean;
    timezone?: string | null;
}