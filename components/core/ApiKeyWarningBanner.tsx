
import React from 'react';

const ApiKeyWarningBanner: React.FC = () => {
  return (
    <div className="bg-error-bg border-b-2 border-error-text text-error-text p-3 text-center text-sm font-medium">
      <strong>Action Required:</strong> The Gemini API key is not configured. AI features are disabled. 
      To fix this, add your <code>VITE_API_KEY</code> as an{' '}
      <a 
        href="https://vercel.com/docs/projects/environment-variables" 
        target="_blank" 
        rel="noopener noreferrer"
        className="underline hover:text-red-800"
      >
        environment variable
      </a>
      {' '}in your Vercel project settings and redeploy.
    </div>
  );
};

export default ApiKeyWarningBanner;