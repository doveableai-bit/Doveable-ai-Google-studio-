import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../../types';
import { SendIcon, PlusIcon, XIcon, CheckIcon } from '../ui/Icons';

interface ChatHistoryPanelProps {
  messages: Message[];
  onSendMessage: (message: string, attachment: { name: string; dataUrl: string; type: string; } | null) => void;
  isLoading: boolean;
  learningInsights?: string[];
  coins: number;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({ messages, onSendMessage, isLoading, learningInsights, coins }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; dataUrl: string; type: string; } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setAttachment({
          name: file.name,
          dataUrl: loadEvent.target?.result as string,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isLoading || coins <= 0) return;
    onSendMessage(input, attachment);
    setInput('');
    setAttachment(null);
  };

  const renderMessage = (msg: Message) => {
    switch (msg.type) {
      case 'user':
        return (
          <div className="p-4 rounded-lg bg-user-message-bg border-l-4 border-user-message-border">
            <div className="flex justify-between items-center text-sm text-text-secondary mb-2">
              <strong>You</strong>
              <span>{msg.timestamp}</span>
            </div>
            {msg.text && <p className="text-text-primary">{msg.text}</p>}
            {msg.attachment && msg.attachment.type.startsWith('image/') && (
              <img src={msg.attachment.dataUrl} alt={msg.attachment.name} className="mt-2 rounded-lg max-w-xs max-h-48 object-cover border border-gray-200" />
            )}
             {msg.attachment && !msg.attachment.type.startsWith('image/') && (
                <div className="mt-2 p-2.5 bg-blue-100 rounded-md text-sm text-blue-800 border border-blue-200">
                    Attached file: {msg.attachment.name}
                </div>
            )}
          </div>
        );
      case 'ai-thought':
        return (
          <div className={`p-4 rounded-lg ${msg.status === 'error' ? 'bg-error-bg border-l-4 border-error-text' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center text-sm text-text-secondary mb-2">
              <strong>Doveable AI</strong>
              <span>{msg.timestamp}</span>
            </div>
            {msg.status === 'thinking' ? (
                <div className="flex items-center gap-2 text-text-secondary">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <span>Thinking...</span>
                </div>
            ) : (
                <p className="text-error-text font-medium">{msg.error}</p>
            )}
          </div>
        );
      case 'ai-response':
        return (
            <div className="p-4 rounded-lg bg-ai-message-bg border-l-4 border-ai-message-border">
                <div className="flex justify-between items-center text-sm text-text-secondary mb-2">
                    <strong>Doveable AI</strong>
                    <span>{msg.timestamp}</span>
                </div>
                {msg.files && msg.files.length > 0 && (
                    <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="space-y-2">
                            {msg.files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary font-mono">{file}</span>
                                    <CheckIcon className="w-5 h-5 text-green-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <ul className="space-y-1.5 list-disc list-inside text-text-primary">
                    {msg.plan.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg text-text-primary">Chat</h2>
      </div>
      <div className="flex-grow p-5 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div key={msg.id}>
            {renderMessage(msg)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-border">
        {learningInsights && learningInsights.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-text-primary mb-2">AI Learning Insights</h3>
            <div className="space-y-1.5">
              {learningInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-xs p-2 bg-gray-50 rounded text-text-secondary border border-gray-200">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1 flex-shrink-0"></div>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {attachment && (
            <div className="mb-2 p-2 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                    {attachment.type.startsWith('image/') ? (
                        <img src={attachment.dataUrl} alt="preview" className="w-10 h-10 rounded object-cover" />
                    ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-file text-gray-500"></i>
                        </div>
                    )}
                    <span className="text-text-secondary truncate">{attachment.name}</span>
                </div>
                <button onClick={removeAttachment} className="p-1 rounded-full hover:bg-gray-200 flex-shrink-0 ml-2">
                    <XIcon className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,.doc,.docx,.txt" />
            <button 
              type="button" 
              onClick={handleFileSelect} 
              className="absolute inset-y-0 left-0 flex items-center pl-3.5 disabled:opacity-50" 
              disabled={isLoading || coins <= 0}
              aria-label="Attach file"
            >
              <PlusIcon className="w-5 h-5 text-gray-400 hover:text-accent" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={coins <= 0 ? "You have run out of credits." : "Ask Doveable... (optional with an attachment)"}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm disabled:bg-gray-200"
              disabled={isLoading || coins <= 0}
            />
            <button 
              type="submit" 
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 disabled:opacity-50" 
              disabled={isLoading || (!input.trim() && !attachment) || coins <= 0}
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5 text-gray-400 hover:text-accent" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatHistoryPanel;