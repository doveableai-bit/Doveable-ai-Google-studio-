import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import projectService from '../../services/projectService';
import type { Project, GeneratedCode } from '../../types';
import { FolderIcon, XIcon, PlusCircleIcon } from '../ui/Icons';

interface ProjectsPanelProps {
    session: Session;
    onProjectSelect: (project: Project) => void;
    onDeleteProject: (projectId: string) => Promise<void>;
    onBackToChat: () => void;
}

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ session, onProjectSelect, onDeleteProject, onBackToChat }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            // FIX: projectService.getProjects does not accept any arguments.
            const userProjects = await projectService.getProjects();
            setProjects(userProjects);
        } catch (err: any) {
            setError(err.message || 'Failed to load projects.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
            try {
                await onDeleteProject(projectId);
                setProjects(prev => prev.filter(p => p.id !== projectId));
            } catch (err: any) {
                alert('Failed to delete project: ' + err.message);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent">
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-lg text-text-primary">My Projects</h2>
                <button
                    onClick={onBackToChat}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors"
                >
                    Back to Chat
                </button>
            </header>
            <main className="flex-grow p-5 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center text-text-secondary">Loading projects...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : projects.length === 0 ? (
                    <div className="text-center text-text-secondary p-8">
                        <FolderIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-semibold text-text-primary">No Projects Yet</h3>
                        <p className="mt-1 text-sm">Create your first project from the top bar!</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {projects.map((project) => (
                            <li key={project.id} className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                                <button
                                    onClick={() => onProjectSelect(project)}
                                    className="flex-grow text-left"
                                >
                                    <div className="font-medium text-text-primary">{project.name}</div>
                                    <div className="text-xs text-text-secondary">
                                        Last updated: {new Date(project.updated_at).toLocaleDateString()}
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete project"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default ProjectsPanel;