
import React from 'react';
import type { GeneratedCode } from '../../types';
import { EyeIcon } from '../ui/Icons';

interface PreviewPanelProps {
  code: GeneratedCode | null;
  isLoading: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, isLoading }) => {
  const srcDoc = code ? `
    <html>
      <head>
        <style>${code.css}</style>
      </head>
      <body>
        ${code.html}
        <script>${code.javascript}</script>
      </body>
    </html>
  ` : '';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-3 bg-primary border-b border-gray-700">
        <EyeIcon className="w-5 h-5 text-gray-400 mr-2" />
        <h3 className="text-md font-semibold text-white">Live Preview</h3>
      </div>
      <div className="flex-grow relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-accent mx-auto mb-4"></div>
              <p>Building your vision...</p>
            </div>
          </div>
        )}
        {code ? (
          <iframe
            srcDoc={srcDoc}
            title="Website Preview"
            sandbox="allow-scripts"
            className="w-full h-full border-0"
          />
        ) : (
          !isLoading && (
            <div className="flex items-center justify-center h-full bg-gray-800">
              <p className="text-gray-400">Your website preview will appear here.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
