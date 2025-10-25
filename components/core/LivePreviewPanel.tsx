import React, { useState } from 'react';
import type { GeneratedCode } from '../../types';
import { EditIcon } from '../ui/Icons';

interface LivePreviewPanelProps {
  code: GeneratedCode | null;
  isLoading: boolean;
  onEditClick: () => void;
}

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ code, isLoading, onEditClick }) => {
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-lg text-text-primary">Live Website Preview</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPreviewMode(mode.id as 'desktop' | 'tablet' | 'mobile')}
                className={`
                  px-3 py-1 text-sm rounded-md transition-colors font-medium
                  ${previewMode === mode.id
                    ? 'bg-white text-accent shadow-sm'
                    : 'bg-transparent text-text-secondary hover:bg-gray-300/50'
                  }
                `}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <button 
            onClick={onEditClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm text-text-primary transition-colors disabled:opacity-50"
            disabled={!code}
          >
            <EditIcon className="w-4 h-4" />
            Edit Code
          </button>
        </div>
      </div>
      <div className="flex-grow relative bg-background p-6 flex justify-center items-start overflow-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
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
            <div className="flex items-center justify-center h-full">
              <p className="text-text-secondary">Your website preview will appear here.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LivePreviewPanel;