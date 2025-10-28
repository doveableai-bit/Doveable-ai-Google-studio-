
import React from 'react';
import { XIcon } from '../ui/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStorageUpdate: () => void; // This can be removed in a future refactor
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  
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
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-800">
                This application is now connected to a dedicated backend. All settings and data are managed by the application administrator.
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
