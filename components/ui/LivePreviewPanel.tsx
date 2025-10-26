import React, { useState } from 'react';
import type { GeneratedCode } from '../../types';
import { EditIcon, GithubIcon, SupabaseIcon } from '../ui/Icons';

interface LivePreviewPanelProps {
  code: GeneratedCode | null;
  isLoading: boolean;
  onEditClick: () => void;
  onSettingsClick: () => void;
}

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ code, isLoading, onEditClick, onSettingsClick }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const srcDoc = code ? `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${code.title}</title>
        ${code.externalCss.map(url => `<link rel="stylesheet" href="${url}">`).join('\n        ')}
        <style>${code.css}</style>
      </head>
      <body>
        ${code.html}
        ${code.externalJs.map(url => `<script src="${url}"></script>`).join('\n        ')}
        <script>${code.javascript}</script>
      </body>
    </html>
  ` : '';

  const viewModes = [
    { id: 'desktop', label: 'Desktop' },
    { id: 'tablet', label: 'Tablet' },
    { id: 'mobile', label: 'Mobile' },
  ];

  const getIframeContainerClass = () => {
    const baseClass = 'shadow-xl transition-all duration-300 ease-in-out bg-white flex-shrink-0';
    switch (previewMode) {
      case 'tablet':
        return `${baseClass} w-[768px] h-full border border-gray-300`;
      case 'mobile':
        return `${baseClass} w-[375px] h-[667px] border-8 border-gray-800 rounded-[40px] overflow-hidden`;
      case 'desktop':
      default:
        return `${baseClass} w-full h-full`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-panel">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setPreviewMode(mode.id as 'desktop' | 'tablet' | 'mobile')}
              className={`
                px-3 py-1 text-sm rounded-md transition-colors font-medium
                ${previewMode === mode.id
                  ? 'bg-white text-accent shadow-sm'
                  : 'bg-transparent text-text-secondary hover:bg-gray-200'
                }
              `}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
            <button
              onClick={onSettingsClick}
              className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-text-primary transition-colors"
              title="Connect to Supabase"
            >
              <SupabaseIcon className="w-5 h-5" />
            </button>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('GitHub integration coming soon!'); }}
              className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-text-primary transition-colors"
              title="Connect to GitHub (Coming Soon)"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
        </div>
      </header>
      <main className="flex-grow p-6 bg-gray-50 relative">
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
            <h3 className="font-semibold text-gray-500">Live preview</h3>
             {code && (
                <button 
                    onClick={onEditClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors shadow-sm disabled:opacity-50"
                    disabled={!code}
                >
                    <EditIcon className="w-4 h-4" />
                    Edit Code
                </button>
             )}
        </div>
        
        <div className="w-full h-full pt-10 flex justify-center items-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-20">
                <div className="text-center text-text-primary">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-accent mx-auto mb-4"></div>
                  <p className="font-semibold">Building your vision...</p>
                </div>
              </div>
            )}
            {code ? (
              <div className={getIframeContainerClass()}>
                <iframe
                  srcDoc={srcDoc}
                  title="Website Preview"
                  sandbox="allow-scripts"
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              !isLoading && (
                 <div className="w-full h-full border-4 border-blue-400 bg-white rounded-xl flex flex-col items-center justify-center text-center p-8 relative shadow-inner overflow-hidden">
                    <p className="text-xl text-text-secondary">Your website preview will appear here.</p>
                    <span className="absolute bottom-1/4 translate-y-1/2 text-7xl lg:text-9xl font-bold text-blue-500/10 -rotate-[20deg] select-none whitespace-nowrap">
                        preview will show here
                    </span>
                </div>
              )
            )}
        </div>
      </main>
    </div>
  );
};

export default LivePreviewPanel;