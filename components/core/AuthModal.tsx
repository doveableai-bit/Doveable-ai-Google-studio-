import React from 'react';
import { XIcon, GithubIcon, GoogleIcon, UserIcon } from '../ui/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  if (!isOpen) return null;

  // For now, all buttons will simulate a successful authentication
  // by calling the onAuthSuccess callback.
  const handleAuth = () => {
    // In a real application, this would involve calling Supabase or another auth provider.
    onAuthSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-panel rounded-xl shadow-2xl w-full max-w-md border border-border transform transition-all animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-xl text-text-primary">Welcome to Doveable</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        
        <div className="p-8 text-center">
            <p className="text-text-secondary mb-8">
                Choose an option to get started. Your work will be saved to your account.
            </p>

            <div className="space-y-4">
                <button 
                    onClick={handleAuth}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-md font-medium text-text-primary bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <GoogleIcon className="w-5 h-5" />
                    Continue with Google
                </button>
                <button 
                    onClick={handleAuth}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-800 rounded-lg text-md font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <GithubIcon className="w-5 h-5" />
                    Continue with GitHub
                </button>
                 <button 
                    onClick={handleAuth}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-md font-medium text-text-primary bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <UserIcon className="w-5 h-5" />
                    Continue as Guest
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
