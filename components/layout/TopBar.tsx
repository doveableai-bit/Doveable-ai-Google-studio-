import React, { useState, useRef, useEffect } from 'react';
import { DoveIcon, PlusCircleIcon, SettingsIcon, CoinIcon, MenuBarIcon, FolderIcon, StarIcon, LogoutIcon, MailIcon } from '../ui/Icons';
import { getSupabaseClient } from '../../services/supabase';
import type { Project } from '../../types';

interface TopBarProps {
  onLoad: (projectId: string) => void;
  onNew: () => void;
  projects: Project[];
  currentProject: Project | null;
  isUserStorageConfigured: boolean;
  onSettingsClick: () => void;
  onMyProjectsClick: () => void;
  onUpgradeClick: () => void;
  onContactClick: () => void;
  coins: number;
}

const TemplatesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
);


const TopBar: React.FC<TopBarProps> = ({ onLoad, onNew, projects, currentProject, isUserStorageConfigured, onSettingsClick, onMyProjectsClick, onUpgradeClick, onContactClick, coins }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        alert('Failed to log out.');
      } else {
        // Reload the page to clear state and get a new anonymous session
        window.location.reload();
      }
    } else {
      // Fallback for when supabase client isn't initialized
      window.location.reload();
    }
  };


  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-panel border-b border-border shadow-sm">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 font-bold text-xl text-text-primary">
                <DoveIcon className="w-7 h-7 text-indigo-600" />
                <h1>Doveable AI</h1>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={onNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors">
                    <PlusCircleIcon className="w-4 h-4" />
                    New Project
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 border border-amber-200 rounded-lg">
                    <CoinIcon className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-sm text-amber-700">{coins} Credits</span>
                </div>
            </div>
        </div>
      
        <div className="relative" ref={userMenuRef}>
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                 <MenuBarIcon className="w-6 h-6 text-text-secondary" />
            </button>

            {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-panel border border-border rounded-lg shadow-xl z-20">
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base font-bold text-text-secondary">G</div>
                        <div>
                            <div className="font-semibold text-text-primary">Guest Mode</div>
                            <div className="text-xs text-text-secondary">Anonymous User</div>
                        </div>
                    </div>
                    <hr className="border-border" />
                    <div className="p-2">
                        <h3 className="px-3 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">My Projects</h3>
                         {isUserStorageConfigured ? (
                            <div className="mt-1 max-h-48 overflow-y-auto">
                                {projects.length > 0 ? projects.map(p => (
                                    <button 
                                        key={p.id} 
                                        onClick={() => { onLoad(p.id); setIsUserMenuOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-md truncate ${currentProject?.id === p.id ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        {p.name}
                                    </button>
                                )) : (
                                    <div className="px-3 py-2 text-sm text-text-secondary">No projects found.</div>
                                )}
                            </div>
                        ) : (
                             <div className="px-3 py-2 text-sm text-text-secondary">Connect a backend in Settings to see projects.</div>
                        )}
                    </div>
                     <hr className="border-border" />
                      <div className="p-2">
                        <button
                            onClick={() => { onUpgradeClick(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center justify-center gap-2 text-left px-3 py-2.5 text-sm rounded-md text-amber-800 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 transition-all">
                            <StarIcon className="w-5 h-5 text-amber-500" />
                            <span className="font-bold">Become a Pro</span>
                        </button>
                     </div>
                     <div className="p-2 space-y-1">
                        <button 
                            onClick={() => { onMyProjectsClick(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-text-primary">
                            <FolderIcon className="w-4 h-4 text-text-secondary" />
                            My Projects
                        </button>
                        <button 
                            onClick={() => { onNew(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-text-primary">
                            <PlusCircleIcon className="w-4 h-4 text-text-secondary" />
                            New Project
                        </button>
                         <button 
                            onClick={() => { onContactClick(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-text-primary">
                            <MailIcon className="w-4 h-4 text-text-secondary" />
                            Contact Us
                        </button>
                         <button 
                            onClick={() => { onSettingsClick(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-text-primary">
                            <SettingsIcon className="w-4 h-4 text-text-secondary" />
                            Settings
                        </button>
                     </div>
                     <hr className="border-border" />
                     <div className="p-2">
                         <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600 font-medium">
                            <LogoutIcon className="w-4 h-4" />
                            Log Out
                        </button>
                     </div>
                </div>
            )}
        </div>
    </header>
  );
};

export default TopBar;