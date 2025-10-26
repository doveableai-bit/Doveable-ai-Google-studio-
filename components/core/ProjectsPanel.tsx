import React from 'react';
import type { Project } from '../../types';
import { FolderIcon, PlusCircleIcon, SettingsIcon } from '../ui/Icons';

interface ProjectsPanelProps {
  projects: Project[];
  onLoadProject: (projectId: string) => void;
  onNewProject: () => void;
  isUserStorageConfigured: boolean;
  onSettingsClick: () => void;
}

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ projects, onLoadProject, onNewProject, isUserStorageConfigured, onSettingsClick }) => {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-panel">
        <h2 className="font-semibold text-lg text-text-primary">My Projects</h2>
        <button 
          onClick={onNewProject} 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover border border-accent rounded-lg text-sm font-medium text-white transition-colors"
        >
          <PlusCircleIcon className="w-4 h-4" />
          New Project
        </button>
      </header>
      <main className="flex-grow p-8 overflow-y-auto">
        {!isUserStorageConfigured ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="max-w-md">
              <SettingsIcon className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-text-primary">Connect a Backend</h3>
              <p className="mt-2 text-text-secondary">To save and manage projects, please connect your own backend storage in the settings. Your data will remain entirely under your control.</p>
              <button 
                onClick={onSettingsClick} 
                className="mt-6 inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                Go to Settings
              </button>
            </div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-panel border border-border rounded-lg p-5 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="flex-grow">
                  <h3 className="font-semibold text-text-primary truncate">{project.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => onLoadProject(project.id)} 
                  className="mt-5 w-full text-center px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-sm font-medium text-text-primary rounded-md shadow-sm transition-colors"
                >
                  Load Project
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="max-w-md">
              <FolderIcon className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-text-primary">No projects yet</h3>
              <p className="mt-2 text-text-secondary">Get started by creating a new project. Your saved projects will appear here.</p>
              <button 
                onClick={onNewProject} 
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                <PlusCircleIcon className="w-5 h-5"/>
                Create New Project
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsPanel;
