
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

export interface UserPreferences {
  preferredTechStack: string[];
  codingStyle: {
    indentation: 'spaces' | 'tabs';
    spacesCount: number;
    quoteStyle: 'single' | 'double';
    semicolons: boolean;
    componentStructure: 'functional' | 'class';
  };
  projectTypes: string[];
  uiPreferences: {
    theme: 'light' | 'dark';
    layout: 'sidebar' | 'topbar';
    fontSize: number;
    colorScheme: string[];
  };
  learningFocus: string[];
}

export interface ProjectPattern {
  id: string;
  name: string;
  description: string;
  fileStructure: {
    path: string;
    type: 'file' | 'directory';
    required: boolean;
  }[];
  commonComponents: string[];
  dependencies: string[];
  usageCount: number;
  successRate: number;
  lastUsed: Date;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  language: string;
  context: string[];
  usageCount: number;
  rating: number;
  tags: string[];
  createdFrom: string;
}

export interface UserBehavior {
  id: string;
  timestamp: Date;
  action: string;
  context: string;
  success: boolean;
  filesInvolved: string[];
}

export interface CommonRequest {
  id: string;
  request: string;
  response: string;
  frequency: number;
  lastUsed: Date;
  successRate: number;
  generatedFiles: string[];
}

export interface LearningData {
  userPreferences: UserPreferences;
  projectPatterns: ProjectPattern[];
  codeTemplates: CodeTemplate[];
  userBehavior: UserBehavior[];
  commonRequests: CommonRequest[];
  knowledgeBase: any[];
}

export interface ContactMessage {
  id?: string;
  name: string;
  email?: string;
  message: string;
  created_at?: string;
}
