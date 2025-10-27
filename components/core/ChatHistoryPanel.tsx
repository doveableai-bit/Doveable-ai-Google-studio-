import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../../types';
import { XIcon, CheckIcon, ArrowUpIcon } from '../ui/Icons';

interface ChatHistoryPanelProps {
  messages: Message[];
  onSendMessage: (message: string, attachment: { name: string; dataUrl: string; type: string; } | null) => void;
  isLoading: boolean;
  learningInsights?: string[];
  coins: number;
  isApiKeyConfigured: boolean;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({ messages, onSendMessage, isLoading, learningInsights, coins, isApiKeyConfigured }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; dataUrl: string; type: string; } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

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
    if ((!input.trim() && !attachment) || isLoading || coins <= 0 || !isApiKeyConfigured) return;
    onSendMessage(input, attachment);
    setInput('');
    setAttachment(null);
  };

  const renderMessage = (msg: Message) => {
    switch (msg.type) {
      case 'user':
        return (
          <div className="flex flex-col gap-3">
            <strong className="font-semibold text-text-primary">You</strong>
            {msg.text && <p className="text-gray-800 text-lg leading-relaxed">{msg.text}</p>}
            {msg.attachment && msg.attachment.type.startsWith('image/') && (
              <img src={msg.attachment.dataUrl} alt={msg.attachment.name} className="mt-1 rounded-lg max-w-xs max-h-48 object-cover border border-gray-200" />
            )}
             {msg.attachment && !msg.attachment.type.startsWith('image/') && (
                <div className="mt-1 p-2.5 bg-gray-100 rounded-md text-sm text-gray-700 border border-gray-200">
                    Attached file: {msg.attachment.name}
                </div>
            )}
          </div>
        );
      case 'ai-thought':
        return (
          <div className="flex flex-col gap-3">
            <strong className="font-semibold text-text-primary">Doveable AI</strong>
            {msg.status === 'thinking' ? (
                <div className="flex items-center gap-2 text-text-secondary">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <span>Thinking...</span>
                </div>
            ) : (
                <p className="text-error-text font-medium text-lg leading-relaxed">{msg.error}</p>
            )}
          </div>
        );
      case 'ai-response':
        return (
            <div className="flex flex-col gap-3">
                <strong className="font-semibold text-text-primary">Doveable AI</strong>
                {msg.files && msg.files.length > 0 && (
                     <div className="space-y-2">
                        {msg.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 border border-gray-200 rounded-md">
                                <span className="text-text-secondary font-mono">{file}</span>
                                <CheckIcon className="w-5 h-5 text-green-500" />
                            </div>
                        ))}
                    </div>
                )}
                <ul className="space-y-1.5 list-disc list-inside text-gray-800 text-lg leading-relaxed">
                    {msg.plan.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4 border-b border-gray-200/50">
        <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Chat</h2>
      </div>
      <div className="flex-grow p-5 overflow-y-auto space-y-8">
        {messages.map((msg) => (
          <div key={msg.id}>
            {renderMessage(msg)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200/50">
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-3 flex flex-col">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={!isApiKeyConfigured ? "API key not configured on server." : coins <= 0 ? "You have run out of credits." : "Ask Doveable to create a..."}
              className="w-full border-0 bg-transparent text-gray-800 placeholder:text-gray-500 focus:ring-0 text-lg resize-none overflow-y-hidden px-2 pt-2"
              disabled={isLoading || coins <= 0 || !isApiKeyConfigured}
              rows={4}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,.doc,.docx,.txt" />
                <button type="button" onClick={handleFileSelect} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50" disabled={isLoading || coins <= 0 || !isApiKeyConfigured} aria-label="Attach file">
                  <i className="fa-solid fa-plus"></i>
                </button>
                <button type="button" onClick={handleFileSelect} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50" disabled={isLoading || coins <= 0 || !isApiKeyConfigured} aria-label="Attach document">
                  <i className="fa-solid fa-paperclip"></i>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="w-12 h-12 flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-gray-400"
                  disabled={isLoading || (!input.trim() && !attachment) || coins <= 0 || !isApiKeyConfigured}
                  aria-label="Send message"
                >
                  <ArrowUpIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatHistoryPanel;