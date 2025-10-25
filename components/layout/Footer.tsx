
import React from 'react';
import type { Project } from '../../types';

export type SaveStatus = 'local' | 'unsaved' | 'saving' | 'saved';

interface FooterProps {
  currentProject: Project | null;
  isUserStorageConfigured: boolean;
  saveStatus: SaveStatus;
}

const Footer: React.FC<FooterProps> = ({ currentProject, isUserStorageConfigured, saveStatus }) => {
  
  const getSaveStatus = () => {
    // If user has not configured their own backend, all saves are temporary.
    // We can treat this similarly to 'unsaved' or a special temporary state.
    if (!isUserStorageConfigured && (saveStatus === 'saved' || saveStatus === 'unsaved')) {
        return { text: 'Saved (Temporary)', bg: 'bg-yellow-100', textColor: 'text-yellow-800' };
    }

    switch(saveStatus) {
        case 'saving':
            return { text: 'Saving...', bg: 'bg-blue-100', textColor: 'text-blue-800' };
        case 'saved':
            return { text: 'All changes saved', bg: 'bg-green-100', textColor: 'text-green-800' };
        case 'unsaved':
             return { text: 'Unsaved changes', bg: 'bg-yellow-100', textColor: 'text-yellow-800' };
        case 'local':
        default:
             return { text: 'Not saved', bg: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };
  
  const status = getSaveStatus();
  const config = isUserStorageConfigured ? JSON.parse(localStorage.getItem('doveable-user-storage-config') || '{}') : {};
  
  const projectUrl = isUserStorageConfigured && currentProject 
    ? `${config.supabaseUrl}/project/${config.supabaseUrl.split('.')[0].split('//')[1]}/editor/${currentProject.id}` 
    : '#';
  const previewUrl = isUserStorageConfigured && currentProject 
    ? `${config.supabaseUrl}/storage/v1/object/public/previews/${currentProject.id}.html` // Example URL
    : '#';

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 bg-panel border-t border-border text-sm text-text-secondary">
      <div className="flex items-center gap-3">
        <span>{currentProject ? `Project: ${currentProject.name}` : 'New Project'}</span>
        <span className={`px-2 py-0.5 ${status.bg} ${status.textColor} rounded-full text-xs font-medium`}>
          {status.text}
        </span>
        {!isUserStorageConfigured && currentProject && <span className="text-xs text-yellow-600">This temporary project will be deleted in 48 hours.</span>}
      </div>
      <div className="flex items-center gap-4">
        {isUserStorageConfigured && currentProject && (
          <>
            <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">
                Project Link
            </a>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">
                Preview Link
            </a>
          </>
        )}
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">v1.4.0</span>
      </div>
    </div>
  );
};

export default Footer;