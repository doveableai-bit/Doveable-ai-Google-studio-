import { supabase } from './supabase';
import type { Project, GeneratedCode, UserInfo } from '../types';

const defaultCode: GeneratedCode = {
  title: 'New Project',
  html: '<h1>Welcome to your new project!</h1><p>Start by describing what you want to build in the chat.</p>',
  css: 'body { font-family: sans-serif; text-align: center; margin-top: 2rem; }',
  javascript: '',
  externalCss: [],
  externalJs: [],
};

const getProjects = async (): Promise<Project[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
};

const createProject = async (name: string, description: string): Promise<Project> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const newProject = {
        name,
        description,
        user_id: user.id,
        code: { ...defaultCode, title: name },
    };

    const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single();
    
    if (error) throw error;
    return data as Project;
};

const getProject = async (projectId: string): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

    if (error) {
        console.error('Error fetching project:', error);
        return null;
    }
    return data as Project;
};

const updateProjectCode = async (projectId: string, code: GeneratedCode): Promise<Project> => {
    const { data, error } = await supabase
        .from('projects')
        .update({ code, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();
    
    if (error) throw error;
    return data as Project;
};

const getUserInfo = async (): Promise<UserInfo> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    // NOTE: Coins and admin status are mocked as they are not part of the standard Supabase user table.
    return { id: user.id, email: user.email, coins: 100, is_admin: true };
};

interface ContactMessage {
  name: string;
  email?: string;
  message: string;
}

const saveContactMessage = async (messageData: ContactMessage): Promise<void> => {
    console.log('Contact message saved:', messageData);
    // In a real app, this would save to the database via Supabase.
    // const { error } = await supabase.from('contact_messages').insert(messageData);
    // if (error) throw error;
    return Promise.resolve();
};

const projectService = {
  getProjects,
  createProject,
  getProject,
  updateProjectCode,
  getUserInfo,
  saveContactMessage,
};

export default projectService;