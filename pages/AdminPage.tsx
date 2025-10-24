import React, { useState, useEffect } from 'react';
import { getAllProfiles, updatePurchasedCoins, updateSubscriptionStatus } from '../services/userService';
import type { UserProfile } from '../types';

const AdminPage: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCoins, setEditingCoins] = useState<Record<string, number | string>>({});

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const allProfiles = await getAllProfiles();
      setProfiles(allProfiles);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCoinChange = (userId: string, value: string) => {
    if (value === '') {
      setEditingCoins(prev => ({ ...prev, [userId]: '' }));
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        setEditingCoins(prev => ({ ...prev, [userId]: numericValue }));
      }
    }
  };

  const handleUpdateCoins = async (userId: string) => {
    const newAmount = editingCoins[userId];
    if (typeof newAmount !== 'number' || newAmount < 0) {
      alert("Please enter a valid, non-negative number for purchased coins.");
      return;
    }

    try {
        const updatedProfile = await updatePurchasedCoins(userId, newAmount);
        setProfiles(prevProfiles => 
            prevProfiles.map(p => p.id === userId ? updatedProfile : p)
        );
        setEditingCoins(prev => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
        });
    } catch (err: any) {
        alert("Failed to update coins: " + err.message);
    }
  };

  const handleSubscriptionToggle = async (userId: string, currentStatus: boolean) => {
    try {
        const updatedProfile = await updateSubscriptionStatus(userId, !currentStatus);
        setProfiles(prevProfiles => 
            prevProfiles.map(p => p.id === userId ? updatedProfile : p)
        );
    } catch (err: any) {
        alert("Failed to update subscription status: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow p-6 text-center text-gray-400">
        Loading users...
      </div>
    );
  }

  if (error) {
    return <div className="flex-grow p-6 text-center text-red-400">{error}</div>;
  }

  return (
    <main className="flex-grow p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold text-white mb-6">User Management</h1>
      <div className="bg-secondary rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Subscribed</th>
                <th scope="col" className="px-6 py-3">Free Coins</th>
                <th scope="col" className="px-6 py-3">Purchased Coins</th>
                <th scope="col" className="px-6 py-3">Last Grant</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id} className="border-b border-gray-700 hover:bg-primary/50">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{profile.email}</td>
                  <td className="px-6 py-4">
                    <input 
                        type="checkbox"
                        checked={profile.is_subscribed}
                        onChange={() => handleSubscriptionToggle(profile.id, profile.is_subscribed)}
                        className="w-4 h-4 text-accent bg-gray-700 border-gray-600 rounded focus:ring-accent"
                    />
                  </td>
                  <td className="px-6 py-4">{profile.free_coins}</td>
                  <td className="px-6 py-4">
                     <input 
                        type="number"
                        value={editingCoins[profile.id] ?? profile.purchased_coins}
                        onChange={(e) => handleCoinChange(profile.id, e.target.value)}
                        className="bg-primary border border-gray-600 rounded-md px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-accent"
                     />
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {profile.last_free_coin_grant ? new Date(profile.last_free_coin_grant).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                        onClick={() => handleUpdateCoins(profile.id)}
                        disabled={editingCoins[profile.id] === undefined}
                        className="font-medium text-accent-hover hover:underline disabled:text-gray-500 disabled:no-underline"
                    >
                        Save Coins
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminPage;