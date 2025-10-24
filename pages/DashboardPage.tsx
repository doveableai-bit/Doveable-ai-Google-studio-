import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import ChatPanel from '../components/core/ChatPanel';
import ThoughtPanel from '../components/core/ThoughtPanel';
import PreviewPanel from '../components/core/PreviewPanel';
import UpgradeModal from '../components/core/UpgradeModal';
import { generateWebsiteCode } from '../services/geminiService';
import { getProfile, spendCoin } from '../services/userService';
import type { GeneratedCode, UserProfile } from '../types';

interface DashboardPageProps {
  session: Session;
}

const GENERATION_COST = 1;

const DashboardPage: React.FC<DashboardPageProps> = ({ session }) => {
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsProfileLoading(true);
      try {
        const userProfile = await getProfile(session.user);
        setProfile(userProfile);
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err);
        setError("Could not load your user profile. Please try refreshing the page.");
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchProfile();
  }, [session.user]);

  const handleGenerate = async (prompt: string) => {
    if (!profile || isProfileLoading) {
      setError("User profile not loaded yet. Please wait a moment and try again.");
      return;
    }

    const totalCoins = profile.free_coins + profile.purchased_coins;
    if (totalCoins < GENERATION_COST) {
      setError(`You don't have enough coins to generate a website. Cost: ${GENERATION_COST} coin.`);
      setUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      // First, spend the coin
      const updatedProfile = await spendCoin(session.user.id, profile.free_coins, profile.purchased_coins);
      setProfile(prev => ({...prev, ...updatedProfile} as UserProfile));

      // Then, generate the code
      const code = await generateWebsiteCode(prompt);
      setGeneratedCode(code);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      // If code generation fails, we might want to refund the coin. This is complex
      // and for simplicity, we assume the charge is final once initiated.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Left Side: Chat and Thought Panels */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <ChatPanel onSendMessage={handleGenerate} isLoading={isLoading || isProfileLoading} />
          <ThoughtPanel plan={generatedCode?.plan} isLoading={isLoading} error={error} />
        </div>

        {/* Right Side: Preview Panel */}
        <div className="bg-secondary rounded-lg overflow-hidden border border-gray-700">
          <PreviewPanel code={generatedCode} isLoading={isLoading} />
        </div>
      </main>
      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setUpgradeModalOpen(false)} 
      />
    </>
  );
};

export default DashboardPage;