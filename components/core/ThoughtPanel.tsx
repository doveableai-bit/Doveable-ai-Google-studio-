import React from 'react';
import { BrainCircuitIcon } from '../ui/Icons';

interface ThoughtPanelProps {
  thought: string;
}

const ThoughtPanel: React.FC<ThoughtPanelProps> = ({ thought }) => {
  return (
    <div className="flex-shrink-0 h-48 bg-gray-50 border-t border-border p-4 overflow-y-auto">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-2">
            <BrainCircuitIcon className="w-5 h-5" />
            <span>AI Thoughts</span>
        </div>
      <div className="text-sm text-text-secondary whitespace-pre-wrap font-mono">
        {thought ? (
          <>
            {thought}
            <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1 align-bottom"></span>
          </>
        ) : (
          <p className="text-gray-400">The AI's thought process will appear here...</p>
        )}
      </div>
    </div>
  );
};

export default ThoughtPanel;
