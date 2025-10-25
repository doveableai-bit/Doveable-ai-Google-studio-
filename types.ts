export interface StorageConfig {
  provider: 'supabase';
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface Project {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  expires_at?: string;
}

export interface GeneratedCode {
  title: string;
  plan: string;
  html: string;
  css: string;
  javascript: string;
  externalCss: string[];
  externalJs: string[];
}

export type Message = 
  | {
      id: string;
      type: 'user';
      text: string;
      attachment?: {
        name: string;
        dataUrl: string;
        type: string;
      };
      timestamp: string;
    }
  | {
      id:string;
      type: 'ai-thought';
      timestamp: string;
      status: 'thinking' | 'error';
      error?: string;
    }
  | {
      id: string;
      type: 'ai-response';
      plan: string[];
      files: string[];
      timestamp: string;
    };