import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import ChatPanel from '../components/core/ChatPanel';
import ThoughtPanel from '../components/core/ThoughtPanel';
import PreviewPanel from '../components/core/PreviewPanel';
import { generateWebsiteCode } from '../services/geminiService';
import { getProfile, updateCoins } from '../services/userService';
import type { GeneratedCode, UserProfile } from '../types';

interface DashboardPageProps {
  session: Session;
}

const GENERATION_COST = 10;

const DashboardPage: React.FC<DashboardPageProps> = ({ session }) => {
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile(session.user);
        setProfile(userProfile);
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err);
        setError("Could not load your user profile. Please try refreshing the page.");
      }
    };
    fetchProfile();
  }, [session.user]);

  const handleGenerate = async (prompt: string) => {
    if (!profile) {
      setError("User profile not loaded yet. Please wait a moment and try again.");
      return;
    }

    if (profile.coins < GENERATION_COST) {
      setError(`You don't have enough coins to generate a website. Cost: ${GENERATION_COST} coins.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const code = await generateWebsiteCode(prompt);
      setGeneratedCode(code);
      
      const newCoinTotal = profile.coins - GENERATION_COST;
      await updateCoins(session.user.id, newCoinTotal);
      setProfile({ ...profile, coins: newCoinTotal });

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
      {/* Left Side: Chat and Thought Panels */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        <ChatPanel onSendMessage={handleGenerate} isLoading={isLoading} />
        <ThoughtPanel plan={generatedCode?.plan} isLoading={isLoading} error={error} />
      </div>

      {/* Right Side: Preview Panel */}
      <div className="bg-secondary rounded-lg overflow-hidden border border-gray-700">
        <PreviewPanel code={generatedCode} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default DashboardPage;