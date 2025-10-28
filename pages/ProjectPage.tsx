import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import projectService from '../services/projectService';
import aiService from '../services/aiService';
import type { ChatMessage, GeneratedCode, Project } from '../types';
import { useDebounce } from '../hooks/useDebounce';

import TopBar from '../components/layout/TopBar';
import Footer, { SaveStatus } from '../components/layout/Footer';
import ChatPanel from '../components/core/ChatPanel';
import ThoughtPanel from '../components/core/ThoughtPanel';
import LivePreviewPanel from '../components/ui/LivePreviewPanel';
import CodeEditorPanel from '../components/core/CodeEditorPanel';
import SettingsModal from '../components/core/SettingsModal';
import UpgradePanel from '../components/core/UpgradePanel';
import ContactPanel from '../components/core/ContactPanel';
import ShareModal from '../components/core/ShareModal';

type ViewMode = 'workspace' | 'upgrade' | 'contact';

const ProjectPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [thought, setThought] = useState('');
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('local');
  const [coins, setCoins] = useState(100);
  
  const [viewMode, setViewMode] = useState<ViewMode>('workspace');
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  useEffect(() => {
    if (projectId) {
      projectService.getProject(projectId).then(project => {
        if (project) {
          setCurrentProject(project);
          setGeneratedCode(project.code);
          setChatHistory([{ role: 'assistant', content: `Project "${project.name}" loaded. How can I help you modify it?` }]);
          setSaveStatus('saved');
        } else {
          // Project not found or access denied, redirect to dashboard
          navigate('/dashboard');
        }
      });
    }
    // Fetch user coins
    projectService.getUserInfo().then(userInfo => setCoins(userInfo.coins));
  }, [projectId, navigate]);

  const debouncedCode = useDebounce(generatedCode, 1500);

  useEffect(() => {
    if (debouncedCode && currentProject && saveStatus === 'unsaved') {
      setSaveStatus('saving');
      projectService.updateProjectCode(currentProject.id, debouncedCode)
        .then(updatedProject => {
          setCurrentProject(updatedProject);
          setSaveStatus('saved');
        })
        .catch(() => {
          setSaveStatus('unsaved');
          // TODO: Add user notification of save failure
        });
    }
  }, [debouncedCode, currentProject, saveStatus]);

  const handleSendMessage = async (message: string) => {
    if (!currentProject) return; // Should not happen

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsLoading(true);
    setThought('');
    
    try {
        const stream = aiService.generateCodeStream({
            chatHistory: newHistory,
            onThoughtChange: (newThought) => {
                setThought(prev => prev + newThought);
            }
        });

        let finalCode: GeneratedCode | null = null;
        for await (const chunk of stream) {
            if (chunk.code) {
                finalCode = chunk.code;
                setGeneratedCode(chunk.code);
            }
        }
        
        if (finalCode) {
           const assistantMessage = "I've updated the website based on your request. Check out the live preview. What would you like to do next?";
           setChatHistory(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
           setSaveStatus('unsaved');
        } else {
             const errorMessage = "I'm sorry, I wasn't able to generate the code for that request. Could you please try rephrasing it?";
             setChatHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        }
    } catch (error: any) {
        console.error('Error generating code:', error);
        const errorMessage = `An error occurred: ${error.message}. Please try again.`;
        setChatHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleCodeChange = (newCode: GeneratedCode) => {
    setGeneratedCode(newCode);
    if (currentProject) {
        setCurrentProject({...currentProject, code: newCode});
    }
    setSaveStatus('unsaved');
  };
  
  const renderPageContent = () => {
    switch (viewMode) {
      case 'upgrade':
        return <UpgradePanel onBackToProjects={() => setViewMode('workspace')} />;
      case 'contact':
        return <ContactPanel onBackToEditor={() => setViewMode('workspace')} />;
      case 'workspace':
      default:
        return (
          <div className="flex flex-1 h-full overflow-hidden">
            <div className={`transition-all duration-300 ease-in-out h-full ${isEditorVisible ? "w-1/2" : "w-full"}`}>
              <LivePreviewPanel
                code={generatedCode}
                isLoading={isLoading}
                onEditClick={() => setIsEditorVisible(!isEditorVisible)}
                isEditorVisible={isEditorVisible}
                onSettingsClick={() => setIsSettingsModalOpen(true)}
                onShareClick={() => setIsShareModalOpen(true)}
              />
            </div>
            {isEditorVisible && (
              <div className="w-1/2 h-full border-l border-border">
                <CodeEditorPanel
                  initialCode={generatedCode}
                  onCodeChange={handleCodeChange}
                  onPreviewClick={() => setIsEditorVisible(false)}
                />
              </div>
            )}
          </div>
        );
    }
  };

  if (!user || !currentProject) {
    return <div className="flex items-center justify-center h-screen">Loading Project...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background font-sans">
      <TopBar 
        user={user}
        onNew={() => navigate('/dashboard')}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        onMyProjectsClick={() => navigate('/dashboard')}
        onUpgradeClick={() => setViewMode('upgrade')}
        onContactClick={() => setViewMode('contact')}
        onLogout={handleLogout}
        coins={coins}
      />
      <div className="flex flex-grow overflow-hidden">
        <aside className="w-[450px] flex-shrink-0 flex flex-col border-r border-border">
          <ChatPanel chatHistory={chatHistory} onSendMessage={handleSendMessage} isLoading={isLoading} />
          <ThoughtPanel thought={thought} />
        </aside>
        <main className="flex-grow flex flex-col bg-gray-50/50">
          {renderPageContent()}
        </main>
      </div>
       <Footer 
          currentProject={currentProject} 
          isUserStorageConfigured={true}
          saveStatus={saveStatus}
      />
       <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onStorageUpdate={() => {}}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={currentProject}
      />
    </div>
  );
};

export default ProjectPage;