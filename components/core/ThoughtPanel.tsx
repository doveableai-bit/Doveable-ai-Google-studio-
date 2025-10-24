
import React from 'react';
import { LightbulbIcon, CheckCircleIcon, AlertTriangleIcon } from '../ui/Icons';

interface ThoughtPanelProps {
  plan: string | undefined;
  isLoading: boolean;
  error: string | null;
}

const ThoughtPanel: React.FC<ThoughtPanelProps> = ({ plan, isLoading, error }) => {
  const planItems = plan?.split('\n').filter(item => item.trim().startsWith('*') || item.trim().startsWith('-')).map(item => item.trim().substring(1).trim());

  return (
    <div className="flex-grow bg-secondary rounded-lg border border-gray-700 p-4">
      <div className="flex items-center mb-4">
        <LightbulbIcon className="w-6 h-6 text-yellow-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">AI Thought Process</h3>
      </div>
      <div className="space-y-2 text-sm">
        {isLoading && (
          <div className="text-gray-400 animate-pulse">Generating a plan...</div>
        )}
        {error && (
          <div className="flex items-center p-3 bg-red-900/50 text-red-300 rounded-md">
            <AlertTriangleIcon className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}
        {planItems && planItems.map((item, index) => (
          <div key={index} className="flex items-start text-gray-300">
            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
        {!isLoading && !error && !plan && (
          <div className="text-gray-500">The AI's plan will appear here once you send a prompt.</div>
        )}
      </div>
    </div>
  );
};

export default ThoughtPanel;
