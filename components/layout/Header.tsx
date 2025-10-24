import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../../types';
import { getProfile } from '../../services/userService';
import { DoveIcon, CoinIcon } from '../ui/Icons';

interface HeaderProps {
  user: User;
  isAdmin: boolean;
  onToggleAdminView: () => void;
  currentView: 'dashboard' | 'admin';
}

const Header: React.FC<HeaderProps> = ({ user, isAdmin, onToggleAdminView, currentView }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile(user);
        setProfile(userProfile);
      } catch (error) {
        console.error("Failed to fetch profile for header:", error);
        // Don't crash the app, just fail gracefully
      }
    };
    fetchProfile();
    
    // Listen for profile updates from other components
    const channel = supabase.channel(`profile-changes-for-${user.id}`);
    channel
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, payload => {
        setProfile(payload.new as UserProfile);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
  const connectGitHub = async () => {
     await supabase.auth.linkIdentity({
      provider: 'github',
    });
  }
  
  const totalCoins = (profile?.free_coins ?? 0) + (profile?.purchased_coins ?? 0);

  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 bg-secondary border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <DoveIcon className="w-8 h-8 text-white" />
        <span className="text-xl font-bold text-white">Doveable AI</span>
      </div>
      <div className="flex items-center space-x-4">
        {isAdmin && (
          <button 
            onClick={onToggleAdminView}
            className="px-3 py-1.5 text-sm font-semibold text-white bg-accent rounded-md hover:bg-accent-hover transition"
          >
            {currentView === 'admin' ? 'Dashboard' : 'Admin Panel'}
          </button>
        )}
        <div className="flex items-center space-x-2 bg-primary px-3 py-1.5 rounded-full">
          <CoinIcon className="w-5 h-5" />
          <span className="text-sm font-medium text-white">{totalCoins} Coins</span>
        </div>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
            <img
              src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=4f46e5&color=fff`}
              alt="User Avatar"
              className="w-9 h-9 rounded-full"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-1 z-10 border border-gray-700">
              <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                {user.email}
              </div>
              <button onClick={connectGitHub} className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-primary">Connect GitHub</button>
              <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-primary">Billing</a>
              <button
                onClick={handleSignOut}
                className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-primary"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;