import React from 'react';
import type { Project } from '../../types';
import { XIcon, PlusCircleIcon, FolderIcon } from '../ui/Icons';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (projectId: string) => void;
  onNew: () => void;
  projects: Project[];
  isUserStorageConfigured: boolean;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
    isOpen, 
    onClose, 
    onLoad, 
    onNew, 
    projects,
    isUserStorageConfigured 
}) => {
  const handleNewProject = () => {
    onNew();
    onClose();
  };

  const handleLoadProject = (id: string) => {
    onLoad(id);
    onClose();
  };

  const TemplatesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
);


  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`} aria-modal="true" role="dialog">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 300ms ease-in-out' }}
      ></div>
      
      {/* Sidebar */}
      <div 
        className="relative w-80 max-w-[80vw] h-full bg-panel shadow-xl flex flex-col transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg">
                G
            </div>
            <span className="font-semibold text-text-primary">Guest Mode</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-text-secondary">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-4">
            <button 
                onClick={handleNewProject} 
                className="w-full flex items-center gap-3 py-2.5 px-3 text-text-primary font-medium hover:bg-gray-100 rounded-lg transition-colors">
                <PlusCircleIcon className="w-5 h-5 text-text-secondary" />
                New Project
            </button>
            <button 
                onClick={() => alert('Templates coming soon!')}
                className="w-full flex items-center gap-3 py-2.5 px-3 text-text-primary font-medium hover:bg-gray-100 rounded-lg transition-colors">
                <TemplatesIcon className="w-5 h-5 text-text-secondary" />
                Templates
            </button>

            <div className="border-t border-border pt-4 space-y-2">
                <h3 className="px-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">My Projects</h3>
                {isUserStorageConfigured ? (
                    projects.length > 0 ? (
                        <div className="space-y-1 max-h-96 overflow-y-auto">
                            {projects.map(p => (
                                <button 
                                    key={p.id} 
                                    onClick={() => handleLoadProject(p.id)}
                                    className="w-full flex items-center gap-3 py-2.5 px-3 text-text-primary hover:bg-gray-100 rounded-lg transition-colors text-left"
                                >
                                    <FolderIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
                                    <span className="truncate">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="px-3 text-sm text-text-secondary">No projects found. Save a project to see it here.</p>
                    )
                ) : (
                     <p className="px-3 text-sm text-text-secondary">Connect a backend in Settings to see your projects.</p>
                )}
            </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;