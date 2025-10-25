
import React, { useState, useRef, useEffect } from 'react';
import { DoveIcon, FolderIcon, PlusCircleIcon } from '../ui/Icons';
import type { Project } from '../../types';

interface TopBarProps {
  onLoad: (projectId: string) => void;
  onNew: () => void;
  projects: Project[];
  currentProject: Project | null;
  isUserStorageConfigured: boolean;
}

const TemplatesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
);


const TopBar: React.FC<TopBarProps> = ({ onLoad, onNew, projects, currentProject, isUserStorageConfigured }) => {
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
    <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-panel border-b border-border shadow-sm">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 font-bold text-xl text-text-primary">
                <DoveIcon className="w-7 h-7 text-indigo-600" />
                <h1>Doveable AI</h1>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={onNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors">
                    <PlusCircleIcon className="w-4 h-4" />
                    New Project
                </button>
                <div className="relative" ref={projectsDropdownRef}>
                    <button 
                        onClick={() => setProjectsDropdownOpen(!projectsDropdownOpen)}
                        disabled={!isUserStorageConfigured}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <FolderIcon className="w-4 h-4" />
                        My Projects
                    </button>
                    {projectsDropdownOpen && isUserStorageConfigured && (
                        <div className="absolute left-0 mt-2 w-64 bg-panel border border-border rounded-lg shadow-lg z-20">
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
                 <button 
                    onClick={() => alert('Templates coming soon!')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors">
                    <TemplatesIcon className="w-4 h-4" />
                    Templates
                </button>
            </div>
        </div>
      
        <div className="flex items-center">
            <div className="flex items-center py-1.5 px-3 rounded-md border border-gray-200 bg-gray-50">
                <span className="text-sm font-medium text-text-secondary">
                    Guest Mode
                </span>
            </div>
        </div>
    </header>
  );
};

export default TopBar;