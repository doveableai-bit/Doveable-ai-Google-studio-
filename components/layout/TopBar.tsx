import React, { useState, useRef, useEffect } from 'react';
import { PlusCircleIcon, SettingsIcon, CoinIcon, MenuBarIcon, FolderIcon, StarIcon, LogoutIcon, MailIcon, UserIcon } from '../ui/Icons';
import type { User } from '@supabase/supabase-js';

interface TopBarProps {
  user: User;
  onNew: () => void;
  onSettingsClick: () => void;
  onMyProjectsClick: () => void;
  onUpgradeClick: () => void;
  onContactClick: () => void;
  onLogout: () => void;
  coins: number;
}

const TopBar: React.FC<TopBarProps> = ({ user, onNew, onSettingsClick, onMyProjectsClick, onUpgradeClick, onContactClick, onLogout, coins }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // FIX: Corrected typo from userMenu_ref to userMenuRef.
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    onLogout();
  };

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <header className="relative z-10 flex-shrink-0 flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center rounded-lg text-white font-bold text-xl">D</div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Doveable</span>
            <span className="text-gray-900"> AI</span>
          </h1>
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
        <button 
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
          className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
          aria-label="Open user menu"
        >
          <MenuBarIcon className="w-6 h-6 text-text-primary" />
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white/80 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-gray-200/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">{userInitial}</div>
              <div>
                <div className="font-semibold text-text-primary truncate">{user.email ?? 'User'}</div>
                <div className="text-xs text-text-secondary">Logged In</div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => { onMyProjectsClick(); setIsUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-text-primary">
                <FolderIcon className="w-4 h-4 text-text-secondary" />
                My Projects
              </button>
              <button
                onClick={() => { onUpgradeClick(); setIsUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-sm rounded-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-indigo-50 transition-all">
                <StarIcon className="w-5 h-5 text-purple-500" />
                <span>Become a Pro</span>
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