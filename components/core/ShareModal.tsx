import React, { useState } from 'react';
import type { Project } from '../../types';
import { XIcon, CheckIcon } from '../ui/Icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, project }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;
  
  // In a real application, this would be a real public URL.
  // We're constructing a plausible-looking one for demonstration.
  const shareableLink = `${window.location.origin}/#/share/${project.id}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-panel rounded-xl shadow-2xl w-full max-w-lg border border-border transform transition-all animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-xl text-text-primary">Share Project</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        
        <div className="p-8">
            <p className="text-text-secondary mb-2">
                Anyone with this link will be able to view a preview of your project.
            </p>

            <div className="flex items-center gap-2 mt-4">
                <input 
                    type="text"
                    readOnly
                    value={shareableLink}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-inner text-sm text-text-primary"
                />
                <button
                    onClick={handleCopy}
                    className={`w-32 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-white transition-colors ${
                        copied 
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-accent hover:bg-accent-hover'
                    }`}
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4" />
                            Copied!
                        </>
                    ) : 'Copy Link'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;