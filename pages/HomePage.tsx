import React, { useState } from 'react';
import LoginModal from '../components/auth/LoginModal';
import { DoveIcon, UpArrowIcon } from '../components/ui/Icons';

const LandingHeader = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <header className="absolute top-0 left-0 right-0 p-4 z-10">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-white/10 p-2 rounded-lg">
          <DoveIcon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white">Doveable</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onLoginClick} className="text-white font-medium hover:text-gray-300 transition">Log in</button>
        <button onClick={onLoginClick} className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">Get started</button>
      </div>
    </div>
  </header>
);

const CommunityCardSkeleton = () => (
    <div className="bg-secondary/50 rounded-lg p-4 border border-gray-700/50">
        <div className="w-full h-40 bg-primary/80 rounded-md mb-4 animate-pulse"></div>
        <div className="h-4 bg-primary/80 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-primary/80 rounded w-1/2 animate-pulse"></div>
    </div>
);

const HomePage: React.FC = () => {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const handlePromptSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginModalOpen(true);
    };

    return (
        <>
        <div className="relative min-h-screen bg-primary text-white overflow-x-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/50 rounded-full filter blur-3xl opacity-50 animate-pulse-fast"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/50 rounded-full filter blur-3xl opacity-40 animate-pulse-fast [animation-delay:-2s]"></div>
            </div>

            <LandingHeader onLoginClick={() => setLoginModalOpen(true)} />
            
            <main className="relative z-0 container mx-auto px-4 pt-32 pb-16 text-center">
                {/* Hero Section */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
                        Introducing Doveable x Shopify
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
                    Build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Doveable</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Create apps and websites by chatting with AI
                </p>

                <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm p-2 rounded-full border border-white/10 shadow-lg">
                    <form onSubmit={handlePromptSubmit} className="relative flex items-center">
                        <input 
                            type="text"
                            placeholder="Ask Doveable to create a landing page for my..."
                            className="w-full bg-transparent text-white placeholder-gray-400 pl-4 pr-16 py-3 border-none focus:outline-none focus:ring-0"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                            <UpArrowIcon className="w-5 h-5 text-white" />
                        </button>
                    </form>
                </div>
                
                {/* Community Section */}
                <div className="mt-24 text-left">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-white">From the Community</h2>
                        <a href="#" className="text-gray-300 hover:text-white font-medium flex items-center gap-2">
                            View all <span>&rarr;</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <button className="bg-white/10 px-4 py-2 rounded-lg text-white font-semibold">Featured</button>
                        <button className="text-gray-400 hover:text-white font-semibold">Discover</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CommunityCardSkeleton />
                        <CommunityCardSkeleton />
                        <CommunityCardSkeleton />
                        <CommunityCardSkeleton />
                        <CommunityCardSkeleton />
                        <CommunityCardSkeleton />
                    </div>
                </div>
            </main>
        </div>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
};

export default HomePage;
