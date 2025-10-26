import React from 'react';
import { XIcon, FirebaseIcon, SupabaseIcon } from '../ui/Icons';

interface ConnectBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  onSaveTemp: () => void;
}

const ConnectBackendModal: React.FC<ConnectBackendModalProps> = ({ isOpen, onClose, onConnect, onSaveTemp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-panel rounded-lg shadow-2xl w-full max-w-lg border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-xl text-text-primary">Save Your Project Permanently</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        
        <div className="p-6 text-center">
            <p className="text-text-secondary mb-6">
                Your project is currently auto-saved temporarily. To keep it permanently, connect to your own backend. Your data remains entirely under your control.
            </p>

            <div className="space-y-4">
                <button 
                    onClick={onConnect}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-lg font-medium text-text-primary bg-white hover:bg-gray-50 transition-colors"
                >
                    <SupabaseIcon />
                    Connect Supabase
                </button>

                <div className="relative">
                    <button 
                        disabled
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-lg font-medium text-text-primary bg-gray-100 transition-colors cursor-not-allowed opacity-60"
                    >
                        <FirebaseIcon className="text-yellow-500" />
                        Connect Firebase
                    </button>
                     <span className="absolute -top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Coming Soon
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <button onClick={onSaveTemp} className="text-sm text-accent hover:underline">
                    Continue with temporary 2-day storage
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectBackendModal;