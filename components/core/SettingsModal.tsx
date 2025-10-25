import React, { useState, useEffect } from 'react';
import { createSupabaseClient } from '../../services/supabase';
import { disconnectStorage, isUserStorageConfigured } from '../../services/projectService';
import type { StorageConfig } from '../../types';
import { XIcon } from '../ui/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStorageUpdate: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onStorageUpdate }) => {
  const [config, setConfig] = useState<Partial<StorageConfig>>({});
  const [isConnected, setIsConnected] = useState(false);
  const USER_CONFIG_KEY = 'doveable-user-storage-config';
  
  useEffect(() => {
    if (isOpen) {
      const userConfigured = isUserStorageConfigured();
      setIsConnected(userConfigured);
      if (userConfigured) {
        const storedConfigString = localStorage.getItem(USER_CONFIG_KEY);
        setConfig(storedConfigString ? JSON.parse(storedConfigString) : {});
      } else {
        setConfig({});
      }
    }
  }, [isOpen]);

  const handleConnect = () => {
    if (config.supabaseUrl && config.supabaseAnonKey) {
        try {
            // Test connection by creating a client. A bad URL/key will throw.
            createSupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
            const newConfig: StorageConfig = {
                provider: 'supabase',
                supabaseUrl: config.supabaseUrl,
                supabaseAnonKey: config.supabaseAnonKey,
            };
            localStorage.setItem(USER_CONFIG_KEY, JSON.stringify(newConfig));
            onStorageUpdate();
            setIsConnected(true);
        } catch (error) {
            alert("Connection failed. Please check your Supabase URL and Anon Key.");
            console.error(error);
        }
    } else {
      alert("Please enter both a Supabase URL and an Anon Key.");
    }
  };

  const handleDisconnect = () => {
    disconnectStorage();
    setConfig({});
    setIsConnected(false);
    onStorageUpdate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-panel rounded-lg shadow-2xl w-full max-w-md border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-lg text-text-primary">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        
        <div className="p-6">
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mb-6 text-sm text-blue-800">
                Connect your own Supabase project to enable auto-saving and project management. Your data remains entirely under your control.
            </div>

            <div className="space-y-4 p-4 border border-border rounded-lg">
                <h3 className="font-medium text-text-primary">Backend Connection</h3>
                <p className="text-xs text-text-secondary">Provide credentials for your own Supabase project.</p>
                <div>
                    <label htmlFor="supabaseUrl" className="block text-sm font-medium text-text-secondary mb-1">Supabase URL</label>
                    <input
                        id="supabaseUrl"
                        type="text"
                        placeholder="https://[...].supabase.co"
                        value={config.supabaseUrl || ''}
                        onChange={(e) => setConfig(c => ({...c, supabaseUrl: e.target.value}))}
                        disabled={isConnected}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-200"
                    />
                </div>
                <div>
                    <label htmlFor="supabaseAnonKey" className="block text-sm font-medium text-text-secondary mb-1">Supabase Anon Key</label>
                    <input
                        id="supabaseAnonKey"
                        type="password"
                        placeholder="ey..."
                        value={config.supabaseAnonKey || ''}
                        onChange={(e) => setConfig(c => ({...c, supabaseAnonKey: e.target.value}))}
                        disabled={isConnected}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-200"
                    />
                </div>
                {isConnected ? (
                      <button onClick={handleDisconnect} className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                        Disconnect
                    </button>
                ) : (
                    <button onClick={handleConnect} className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent-hover">
                        Connect
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;