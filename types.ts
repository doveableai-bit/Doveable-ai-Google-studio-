export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeneratedCode {
  title: string;
  html: string;
  css: string;
  javascript: string;
  externalCss: string[];
  externalJs: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  code: GeneratedCode;
  created_at: string;
  updated_at: string;
}

export interface UserInfo {
  id: string;
  email?: string;
  coins: number;
  is_admin?: boolean;
}