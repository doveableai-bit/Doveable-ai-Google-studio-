import React, { useState, useEffect } from 'react';
import DashboardPage from './DashboardPage';
import { isApiKeyConfigured } from '../services/geminiService';
import { DoveIcon } from '../components/ui/Icons';

const HomePage: React.FC = () => {
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the API key. In a real-world scenario with server-side checks,
    // this might be an async call. For this client-side check, it's synchronous.
    setApiKeyReady(isApiKeyConfigured());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-accent mx-auto mb-4"></div>
          <p className="font-semibold text-text-primary">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!apiKeyReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <div className="max-w-2xl w-full bg-panel p-8 rounded-lg shadow-lg border border-border text-center">
          <DoveIcon className="w-16 h-16 mx-auto text-accent mb-4" />
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome to Doveable AI</h1>
          <p className="text-text-secondary mb-8">Your AI-powered website builder is almost ready.</p>

          <div className="bg-error-bg border-l-4 border-error-text text-error-text p-6 text-left rounded-md">
            <h2 className="text-xl font-bold mb-3">Action Required: Configure Gemini API Key</h2>
            <p className="mb-4">
              To enable AI website generation, you need to provide your Google Gemini API key.
              This is done by setting an environment variable in your hosting provider's settings (e.g., Vercel).
            </p>
            <ol className="list-decimal list-inside space-y-2 font-medium">
              <li>Go to your project's dashboard on your hosting platform (e.g., Vercel).</li>
              <li>Navigate to the <strong>Settings</strong> tab and find the <strong>Environment Variables</strong> section.</li>
              <li>Create a new variable with the name <code>API_KEY</code>.</li>
              <li>Paste your Gemini API key as the value.</li>
              <li><strong>Redeploy</strong> your project to apply the new environment variable.</li>
            </ol>
            <p className="mt-4 text-sm">
              For detailed instructions, see the{' '}
              <a 
                href="https://vercel.com/docs/projects/environment-variables" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-red-800 font-semibold"
              >
                Vercel documentation
              </a>.
            </p>
          </div>

          <div className="mt-6 bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-md text-sm text-left">
            <p>
              <strong className="font-bold">Important Security Note:</strong> Never hard-code your API key or commit it to your repository. Always use environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardPage />;
};

export default HomePage;
