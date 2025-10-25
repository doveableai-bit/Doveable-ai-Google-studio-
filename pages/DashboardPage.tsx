import React, { useState, useEffect, useCallback } from 'react';
import ChatHistoryPanel from '../components/core/ChatHistoryPanel';
import LivePreviewPanel from '../components/core/LivePreviewPanel';
import CodeEditorPanel from '../components/core/CodeEditorPanel';
import TopBar from '../components/layout/TopBar';
import Footer, { SaveStatus } from '../components/layout/Footer';
import SettingsModal from '../components/core/SettingsModal';
import ConnectBackendModal from '../components/core/ConnectBackendModal';
// FIX: Removed ApiKeyWarningBanner import as it is no longer used.
import { generateWebsiteCode } from '../services/geminiService'; // FIX: Removed isApiKeyConfigured from import.
import { getProjects, getProject, saveProject, isStorageConfigured, isUserStorageConfigured, initializeStorage } from '../services/projectService';
import learningService from '../services/learningService';
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
  // FIX: Removed apiKeyMissing state as per guidelines.
  const [learningInsights, setLearningInsights] = useState<string[]>([]);


  const debouncedCode = useDebounce(generatedCode, 2000);
  const debouncedMessages = useDebounce(messages, 2000);

  const refreshLearningInsights = useCallback(() => {
    const data = learningService.getLearningData();
    const newInsights: string[] = [];

    if (data.userPreferences?.preferredTechStack?.length) {
        newInsights.push(`Prefers: ${data.userPreferences.preferredTechStack.join(', ')}`);
    }
    const commonReq = data.commonRequests.sort((a,b) => b.frequency - a.frequency)[0];
    if (commonReq) {
        newInsights.push(`Often asks for: "${commonReq.request.substring(0, 40)}${commonReq.request.length > 40 ? '...' : ''}"`);
    }
    if (data.projectPatterns.length > 0) {
        const uniquePatterns = [...new Set(data.projectPatterns.map(p => p.name))];
        if(uniquePatterns.length > 0)
            newInsights.push(`Has experience building: ${uniquePatterns.join(', ')}`);
    }
    
    if (newInsights.length > 0) {
        setLearningInsights(newInsights);
    }
  }, []);

  useEffect(() => {
    // FIX: Removed API key check as per guidelines.
    refreshLearningInsights();
  }, [refreshLearningInsights]);

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
      
      learningService.updateFromGeneration(prompt, code);
      learningService.recordUserBehavior('generate-code', `prompt: "${prompt}"`, true);
      refreshLearningInsights();

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
      learningService.recordUserBehavior('generate-code', `prompt: "${prompt}"`, false);
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
      <TopBar 
        onLoad={handleLoad}
        onNew={handleNew}
        projects={projects}
        currentProject={currentProject}
        isUserStorageConfigured={userStorageConnected}
      />
      <main className="flex-grow flex overflow-hidden">
        <div className="w-[35%] flex-shrink-0 bg-panel border-r border-border flex flex-col overflow-hidden">
          <ChatHistoryPanel messages={messages} onSendMessage={handleGenerate} isLoading={isLoading} learningInsights={learningInsights} />
        </div>
        <div className="flex-1 bg-panel overflow-hidden">
          {viewMode === 'preview' ? (
            <LivePreviewPanel 
              code={generatedCode} 
              isLoading={isLoading} 
              onEditClick={() => setViewMode('edit')}
              onSettingsClick={() => setIsSettingsOpen(true)}
            />
          ) : (
            <CodeEditorPanel
              initialCode={generatedCode}
              onCodeChange={setGeneratedCode}
              onPreviewClick={() => setViewMode('preview')}
            />
          )}
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
