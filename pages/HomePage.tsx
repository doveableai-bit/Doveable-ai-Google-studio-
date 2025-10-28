import React, { useState } from 'react';
import AuthModal from '../components/core/AuthModal';

// This component now serves as the main landing page for Doveable AI,
// and it now manages the presentation of the authentication modal.
const HomePage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="relative isolate px-6 pt-6 lg:px-8">
        {/* Decorative background gradients */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#c4b5fd] to-[#6366f1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        {/* Header */}
        <header className="max-w-7xl mx-auto w-full">
          <nav className="flex items-center justify-between py-4" aria-label="Global">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center rounded-lg text-white font-bold text-xl">D</div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Doveable</span>
                <span className="text-gray-900"> AI</span>
              </span>
            </a>
            <div className="flex items-center gap-x-6">
              <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-semibold leading-6 text-gray-900">
                Log in
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="mx-auto max-w-3xl pt-20 pb-24 sm:pt-24 sm:pb-32">
              <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                        Introducing Doveable x Shopify
                    </div>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                  Build something <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Doveable</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Create apps and websites by chatting with AI
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-2 ring-1 ring-gray-200">
                    <div className="flex items-center">
                        <button onClick={() => setIsAuthModalOpen(true)} className="flex-shrink-0 w-12 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center transition-colors">
                           <i className="fa-solid fa-arrow-up text-lg"></i>
                        </button>
                        <input 
                            type="text" 
                            placeholder="Ask Doveable to create a landing page for my..."
                            className="w-full border-0 bg-transparent px-4 text-gray-600 placeholder:text-gray-400 focus:ring-0 text-base"
                            onFocus={() => setIsAuthModalOpen(true)}
                            readOnly
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* From the Community Section */}
      <section className="bg-gray-50/70 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">From the Community</h2>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                    View all <span aria-hidden="true">&rarr;</span>
                </a>
            </div>
            <div className="mt-6 border-b border-gray-200">
                <div className="-mb-px flex space-x-8" aria-label="Tabs">
                    <a href="#" className="border-gray-900 text-gray-900 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                        Featured
                    </a>
                    <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                        Discover
                    </a>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {/* Card 1: E-commerce Store */}
                <a href="#" className="group relative block">
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-80 transition-opacity shadow-inner">
                        <div className="w-full h-full bg-gradient-to-br from-green-300 to-emerald-500 flex items-center justify-center">
                            <i className="fa-solid fa-store text-5xl text-white opacity-50"></i>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-x-3">
                        <div className="w-9 h-9 bg-pink-200 rounded-full flex items-center justify-center font-bold text-pink-700 flex-shrink-0">A</div>
                        <div>
                            <h3 className="text-md font-semibold text-gray-900 group-hover:text-accent transition-colors">GreenLeaf Planters</h3>
                            <p className="text-sm text-gray-500">by Anna Wong</p>
                        </div>
                    </div>
                </a>

                {/* Card 2: Portfolio Site */}
                <a href="#" className="group relative hidden sm:block">
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-80 transition-opacity shadow-inner">
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                            <i className="fa-solid fa-camera-retro text-5xl text-white opacity-50"></i>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-x-3">
                        <div className="w-9 h-9 bg-sky-200 rounded-full flex items-center justify-center font-bold text-sky-700 flex-shrink-0">M</div>
                        <div>
                            <h3 className="text-md font-semibold text-gray-900 group-hover:text-accent transition-colors">Lens & Light</h3>
                            <p className="text-sm text-gray-500">by Mark Chen</p>
                        </div>
                    </div>
                </a>

                {/* Card 3: SaaS Landing Page */}
                <a href="#" className="group relative hidden lg:block">
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-80 transition-opacity shadow-inner">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                            <i className="fa-solid fa-rocket text-5xl text-white opacity-50"></i>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-x-3">
                        <div className="w-9 h-9 bg-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700 flex-shrink-0">S</div>
                        <div>
                            <h3 className="text-md font-semibold text-gray-900 group-hover:text-accent transition-colors">TaskFlow</h3>
                            <p className="text-sm text-gray-500">by Sarah Jones</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
