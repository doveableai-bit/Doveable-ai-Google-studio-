
import { createSupabaseClient } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { GeneratedCode, Message, Project, StorageConfig, ContactMessage } from '../types';

interface ProjectData extends Project {
    code: GeneratedCode;
    messages: Message[];
}

// NOTE: These are the credentials for the default Doveable AI backend.
// All projects are saved here by default, with an expiration date.
const DOVEABLE_SUPABASE_CONFIG: StorageConfig = {
    provider: 'supabase',
    supabaseUrl: 'https://your-temp-project-id.supabase.co', // Placeholder
    supabaseAnonKey: 'your-temp-anon-key', // Placeholder
};
const USER_CONFIG_KEY = 'doveable-user-storage-config';


let supabase: SupabaseClient | null = null;

/**
 * Checks if the user has connected their own backend storage.
 * @returns True if a user-specific backend is configured, false otherwise.
 */
export const isUserStorageConfigured = () => !!localStorage.getItem(USER_CONFIG_KEY);

/**
 * Checks if any storage (default or user-provided) is active.
 * With the new logic, this should always be true unless initialization fails.
 * @returns True if a Supabase client is available.
 */
export const isStorageConfigured = () => !!supabase;


/**
 * Initializes the storage service. It first tries to use a user-configured
 * backend from localStorage. If none is found, it falls back to the default
 * Doveable AI backend.
 * @returns True if a client was successfully initialized.
 */
export const initializeStorage = (): boolean => {
    try {
        const userConfigString = localStorage.getItem(USER_CONFIG_KEY);
        if (userConfigString) {
            const config: StorageConfig = JSON.parse(userConfigString);
            if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
                supabase = createSupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
                return true;
            }
        }
        
        // Fallback to default Doveable AI backend
        // Do not initialize if the default credentials are still placeholders.
        if (!DOVEABLE_SUPABASE_CONFIG.supabaseUrl || DOVEABLE_SUPABASE_CONFIG.supabaseUrl.includes('your-temp-project-id')) {
            console.warn("Default Supabase backend is not configured with real credentials. Project saving features will be disabled until a user-specific backend is connected in Settings.");
            supabase = null;
            return false;
        }
        
        supabase = createSupabaseClient(DOVEABLE_SUPABASE_CONFIG.supabaseUrl, DOVEABLE_SUPABASE_CONFIG.supabaseAnonKey);
        return true;

    } catch (error) {
        console.error("Failed to initialize storage service:", error);
    }
    supabase = null;
    return false;
};

/**
 * Disconnects a user's custom backend and reverts to the default
 * Doveable AI backend.
 */
export const disconnectStorage = () => {
    localStorage.removeItem(USER_CONFIG_KEY);
    initializeStorage(); // Re-initialize to fall back to default
}

// Initialize on module load
initializeStorage();


export const getProjects = async (): Promise<Project[]> => {
    if (!supabase) return [];
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.warn("Could not get user session. Projects will not be loaded.");
        return [];
    }

    const { data, error } = await supabase
        .from('projects')
        .select('id, name, user_id, created_at, expires_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }

    return data || [];
};

export const getProject = async (id: string): Promise<ProjectData | null> => {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching project:', error);
        throw error;
    }

    return data;
};

export const saveProject = async (
    project: Omit<ProjectData, 'created_at' | 'user_id'> & { id?: string }
): Promise<Project> => {
    if (!supabase) {
        throw new Error("Storage is not configured. Cannot save project.");
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
         throw new Error("Could not get user session. Cannot save project.");
    }

    const projectData: any = {
        id: project.id,
        user_id: user.id,
        name: project.name,
        code: project.code,
        messages: project.messages,
    };

    // Only add an expiration date if the project is being saved
    // to the default backend (i.e., user has not connected their own).
    if (!isUserStorageConfigured()) {
        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + 2); // 48 hours from now
        projectData.expires_at = expires_at.toISOString();
    } else {
        projectData.expires_at = null; // Ensure permanent projects don't have an expiry
    }
    
    const { data, error } = await supabase
        .from('projects')
        .upsert(projectData)
        .select('id, name, user_id, created_at, expires_at')
        .single();

    if (error) {
        console.error('Error saving project:', error);
        throw error;
    }

    return data;
};

export const saveContactMessage = async (
    message: Omit<ContactMessage, 'id' | 'created_at'>
): Promise<void> => {
    if (!supabase) {
        throw new Error("Storage is not configured. Cannot send message.");
    }
    
    const { error } = await supabase
        .from('contact_messages')
        .insert([
            { name: message.name, email: message.email, message: message.message }
        ]);

    if (error) {
        console.error('Error saving contact message:', error);
        throw new Error(`Failed to send message: ${error.message}`);
    }
};
