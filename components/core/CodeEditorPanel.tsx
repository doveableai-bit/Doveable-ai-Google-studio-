

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { GeneratedCode } from '../../types';
import { XIcon } from '../ui/Icons';

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

  const handleEditorContentChange = (language: 'html' | 'css' | 'javascript', value: string) => {
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

    const languageMap: Record<EditorTab, string> = {
      html: 'html',
      css: 'css',
      js: 'javascript',
    };
    
    const valueMap: Record<EditorTab, string> = {
      html: code.html,
      css: code.css,
      js: code.javascript,
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value === undefined) return;
        const langKey = activeTab === 'js' ? 'javascript' : activeTab;
        handleEditorContentChange(langKey, value);
    };

    return (
      <Editor
        height="100%"
        language={languageMap[activeTab]}
        value={valueMap[activeTab]}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-lg text-text-primary">Code Editor</h2>
        <button 
          onClick={onPreviewClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Close Editor"
        >
          <XIcon className="w-5 h-5 text-text-secondary" />
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