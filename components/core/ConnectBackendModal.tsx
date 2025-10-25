import React from 'react';
import { XIcon, FirebaseIcon } from '../ui/Icons';

interface ConnectBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  onSaveTemp: () => void;
}

const SupabaseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M69.1672 34.7818L45.8328 47.4109C45.8328 47.4109 45.8328 67.5891 45.8328 67.5891L69.1672 80.2182C69.1672 80.2182 92.5 67.5891 92.5 57.5C92.5 47.4109 69.1672 34.7818 69.1672 34.7818Z" fill="#3ECF8E"/>
        <path d="M22.5 57.5C22.5 35.7167 45.8328 22.8218 45.8328 22.8218L69.1672 35.4509C69.1672 35.4509 45.8328 48.0764 45.8328 57.5C45.8328 66.9236 69.1672 79.5491 69.1672 79.5491L45.8328 92.1782C45.8328 92.1782 22.5 79.2833 22.5 57.5Z" fill="#3ECF8E"/>
    </svg>
);


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