import React, { useState, useRef, useEffect } from 'react';
import { DoveIcon, SettingsIcon, FolderIcon, PlusCircleIcon, GithubIcon } from '../ui/Icons';
import type { Project } from '../../types';

interface TopBarProps {
  onLoad: (projectId: string) => void;
  onNew: () => void;
  onSettingsClick: () => void;
  projects: Project[];
  currentProject: Project | null;
  isUserStorageConfigured: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onLoad, onNew, onSettingsClick, projects, currentProject, isUserStorageConfigured }) => {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const projectsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(event.target as Node)) {
        setProjectsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-panel border-b border-border shadow-sm">
      <div className="flex items-center gap-2.5 font-bold text-xl text-accent">
        <DoveIcon className="w-7 h-7" />
        <span className="text-text-primary">Doveable AI</span>
      </div>

      <div className="flex items-center gap-4">
        <button 
            onClick={onNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm text-text-primary transition-colors">
            <PlusCircleIcon className="w-4 h-4" />
            New Project
        </button>
        <div className="relative" ref={projectsDropdownRef}>
            <button 
                onClick={() => setProjectsDropdownOpen(!projectsDropdownOpen)}
                disabled={!isUserStorageConfigured}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <FolderIcon className="w-4 h-4" />
                My Projects
            </button>
            {projectsDropdownOpen && isUserStorageConfigured && (
                <div className="absolute right-0 mt-2 w-64 bg-panel border border-border rounded-lg shadow-lg z-20">
                    <div className="p-2">
                        {projects.length > 0 ? projects.map(p => (
                            <button 
                                key={p.id} 
                                onClick={() => { onLoad(p.id); setProjectsDropdownOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${currentProject?.id === p.id ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
                            >
                                {p.name}
                            </button>
                        )) : (
                            <div className="px-3 py-2 text-sm text-text-secondary">No projects found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
        
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); alert('GitHub integration coming soon!'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm text-text-primary transition-colors"
          title="Connect to GitHub (Coming Soon)"
        >
          <GithubIcon className="w-4 h-4" />
          Connect GitHub
        </a>

        <button 
            onClick={onSettingsClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm text-text-primary transition-colors">
            <SettingsIcon className="w-4 h-4" />
            Settings
        </button>
        
        <div className="flex items-center p-1.5 rounded-md border border-gray-200 bg-gray-50">
            <span className="text-sm font-medium text-text-secondary">
                Guest Mode
            </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;