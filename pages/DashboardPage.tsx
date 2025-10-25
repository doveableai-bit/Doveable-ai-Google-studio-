import React, { useState, useEffect, useCallback } from 'react';
import ChatHistoryPanel from '../components/core/ChatHistoryPanel';
import LivePreviewPanel from '../components/core/LivePreviewPanel';
import CodeEditorPanel from '../components/core/CodeEditorPanel';
import TopBar from '../components/layout/TopBar';
import Footer, { SaveStatus } from '../components/layout/Footer';
import SettingsModal from '../components/core/SettingsModal';
import ConnectBackendModal from '../components/core/ConnectBackendModal';
import ApiKeyWarningBanner from '../components/core/ApiKeyWarningBanner';
import { generateWebsiteCode, isApiKeyConfigured } from '../services/geminiService';
import { getProjects, getProject, saveProject, isStorageConfigured, isUserStorageConfigured, initializeStorage } from '../services/projectService';
import type { GeneratedCode, Message, Project } from '../types';
import { useDebounce } from '../hooks/useDebounce';

const initialMessage: Message = {
  id: 'initial-ai-response',
  type: 'ai-response',
  plan: ["Hello! I'm Doveable AI.", "Describe the website you want to build, or ask me to edit the current one."],
  files: [],
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const DashboardPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [userStorageConnected, setUserStorageConnected] = useState(isUserStorageConfigured());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('local');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const debouncedCode = useDebounce(generatedCode, 2000);
  const debouncedMessages = useDebounce(messages, 2000);

  useEffect(() => {
    if (!isApiKeyConfigured()) {
      setApiKeyMissing(true);
    }
  }, []);

  const loadUserProjects = useCallback(async () => {
    if (!isStorageConfigured()) {
      setProjects([]);
      return;
    };
    try {
      const userProjects = await getProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error("Could not load projects:", error);
    }
  }, []);
  
  useEffect(() => {
    loadUserProjects();
  }, [loadUserProjects, userStorageConnected]);
  
  const handleStorageUpdate = () => {
      initializeStorage(); // Re-init service to pick up new/removed config
      setUserStorageConnected(isUserStorageConfigured());
      // After updating storage, reset project state and reload projects
      handleNew(); 
      loadUserProjects();
  };

  const handleAutoSave = useCallback(async () => {
    if (!isStorageConfigured() || !debouncedCode || saveStatus !== 'unsaved') {
      return;
    }

    setSaveStatus('saving');
    try {
      let projectToSave = currentProject;
      if (!projectToSave) {
        const name = prompt("Enter a name for your new project to enable auto-saving:");
        if (!name) {
            setSaveStatus('unsaved');
            return;
        };
        projectToSave = { name } as Project;
      }
      
      const savedProject = await saveProject({
        ...projectToSave,
        code: debouncedCode,
        messages: debouncedMessages,
      });

      setCurrentProject(savedProject);
      if (!projects.find(p => p.id === savedProject.id)) {
        setProjects(prev => [...prev, savedProject]);
      }
      setSaveStatus('saved');
    } catch (error: any) {
      console.error("Failed to auto-save project:", error);
      alert(`Error: Could not save the project. ${error.message}`);
      setSaveStatus('unsaved');
    }
  }, [debouncedCode, debouncedMessages, currentProject, projects, saveStatus]);
  
  useEffect(() => {
    handleAutoSave();
  }, [debouncedCode, debouncedMessages, handleAutoSave]);

  useEffect(() => {
      if (generatedCode || messages.length > 1) {
          setSaveStatus('unsaved');
      }
  }, [generatedCode, messages]);


  const handleGenerate = async (prompt: string, attachment: { name: string; dataUrl: string; type: string; } | null) => {
    setIsLoading(true);
    setViewMode('preview');
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: prompt,
      attachment: attachment || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const thoughtMessage: Message = {
      id: `ai-thought-${Date.now()}`,
      type: 'ai-thought',
      status: 'thinking',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage, thoughtMessage]);
    const isFirstGeneration = !generatedCode;

    try {
      const code = await generateWebsiteCode(prompt, attachment, generatedCode);
      setGeneratedCode(code);

      const planItems = code.plan.split('\n').filter(item => item.trim().startsWith('*') || item.trim().startsWith('-')).map(item => item.trim().substring(1).trim());
      
      const filesGenerated = [];
      if (code.html) filesGenerated.push('index.html');
      if (code.css) filesGenerated.push('style.css');
      if (code.javascript) filesGenerated.push('script.js');

      const responseMessage: Message = {
        id: `ai-response-${Date.now()}`,
        type: 'ai-response',
        plan: planItems,
        files: filesGenerated,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev.filter(m => m.id !== thoughtMessage.id), responseMessage]);

      if (isFirstGeneration && !isUserStorageConfigured()) {
        setIsConnectModalOpen(true);
      }

    } catch (err: any) {
      const errorText = err.message || 'An unknown error occurred.';
      const updatedThoughtMessage: Message = {
        ...thoughtMessage,
        status: 'error',
        error: errorText,
      };
      setMessages(prev => prev.map(m => m.id === thoughtMessage.id ? updatedThoughtMessage : m));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (projectId: string) => {
    try {
      const projectData = await getProject(projectId);
      if (projectData) {
        setCurrentProject({
            id: projectData.id,
            name: projectData.name,
            user_id: projectData.user_id,
            created_at: projectData.created_at,
        });
        setGeneratedCode(projectData.code);
        setMessages(projectData.messages);
        setViewMode('preview');
        setSaveStatus('saved');
      }
    } catch (error) {
        console.error("Failed to load project:", error);
        alert("Error: Could not load the project.");
    }
  };
  
  const handleNew = () => {
    setCurrentProject(null);
    setGeneratedCode(null);
    setMessages([initialMessage]);
    setViewMode('preview');
    setSaveStatus('local');
  }

  const handleConnectBackend = () => {
    setIsConnectModalOpen(false);
    setIsSettingsOpen(true);
  };

  const handleContinueWithTemp = () => {
    setIsConnectModalOpen(false);
    // No action needed, as the project is already saving to the default temp backend.
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      {apiKeyMissing && <ApiKeyWarningBanner />}
      <TopBar 
        onLoad={handleLoad}
        onNew={handleNew}
        onSettingsClick={() => setIsSettingsOpen(true)}
        projects={projects}
        currentProject={currentProject}
        isUserStorageConfigured={userStorageConnected}
      />
      <main className="flex-grow flex overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[40%] bg-panel border-r border-border flex flex-col overflow-hidden">
            <ChatHistoryPanel messages={messages} onSendMessage={handleGenerate} isLoading={isLoading} />
          </div>
          <div className="flex-1 bg-panel overflow-hidden">
            {viewMode === 'preview' ? (
              <LivePreviewPanel 
                code={generatedCode} 
                isLoading={isLoading} 
                onEditClick={() => setViewMode('edit')}
              />
            ) : (
              <CodeEditorPanel
                initialCode={generatedCode}
                onCodeChange={setGeneratedCode}
                onPreviewClick={() => setViewMode('preview')}
              />
            )}
          </div>
        </div>
      </main>
      <Footer 
        currentProject={currentProject} 
        isUserStorageConfigured={userStorageConnected}
        saveStatus={saveStatus}
      />
      {isSettingsOpen && (
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          onStorageUpdate={handleStorageUpdate}
        />
      )}
      <ConnectBackendModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={handleConnectBackend}
        onSaveTemp={handleContinueWithTemp}
      />
    </div>
  );
};

export default DashboardPage;