
import React, { useState, useEffect } from 'react';
import type { GeneratedCode } from '../../types';
import { EyeIcon } from '../ui/Icons';

interface CodeEditorPanelProps {
  initialCode: GeneratedCode | null;
  onCodeChange: (newCode: GeneratedCode) => void;
  onPreviewClick: () => void;
}

type EditorTab = 'html' | 'css' | 'js';

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({ initialCode, onCodeChange, onPreviewClick }) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [code, setCode] = useState<GeneratedCode | null>(initialCode);

  useEffect(() => {
    // This effect syncs the editor's state if a new website is generated
    // while the editor is open.
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (language: 'html' | 'css' | 'javascript', value: string) => {
    if (!code) return;
    const newCode = { ...code, [language]: value };
    setCode(newCode);
    onCodeChange(newCode);
  };
  
  const tabs: { id: EditorTab; label: string }[] = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JavaScript' },
  ];

  const renderActiveEditor = () => {
    if (!code) return null;

    const commonTextAreaProps = {
      className: "w-full h-full p-4 font-mono text-sm bg-gray-800 text-gray-200 border-0 rounded-b-lg resize-none focus:outline-none",
      // FIX: Changed spellCheck from string "false" to boolean false to match React's Booleanish type.
      spellCheck: false,
    };

    switch (activeTab) {
      case 'html':
        return <textarea {...commonTextAreaProps} value={code.html} onChange={(e) => handleCodeChange('html', e.target.value)} />;
      case 'css':
        return <textarea {...commonTextAreaProps} value={code.css} onChange={(e) => handleCodeChange('css', e.target.value)} />;
      case 'js':
        return <textarea {...commonTextAreaProps} value={code.javascript} onChange={(e) => handleCodeChange('javascript', e.target.value)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-lg text-text-primary">Code Editor</h2>
        <button 
          onClick={onPreviewClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover border border-accent rounded-lg text-sm text-white transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          Live Preview
        </button>
      </div>

      <div className="flex-grow p-6 bg-background flex flex-col">
        {code ? (
          <div className="flex flex-col flex-grow shadow-lg">
            <div className="flex bg-gray-200 rounded-t-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2.5 text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'bg-gray-800 text-white rounded-t-lg'
                      : 'bg-transparent text-text-secondary hover:bg-gray-300/50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-grow relative">
              {renderActiveEditor()}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary">Generate a website to start editing the code.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditorPanel;
