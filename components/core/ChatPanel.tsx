import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';
import ChatHistoryPanel from './ChatHistoryPanel';
import { ArrowUpIcon } from '../ui/Icons';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatHistory, onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-border">
      <div className="flex-grow overflow-hidden">
          <ChatHistoryPanel messages={chatHistory} />
      </div>
      <div className="flex-shrink-0 p-4 border-t border-border bg-white">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage(e);
              }
            }}
            placeholder="Describe the website you want to build..."
            className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent max-h-40"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="absolute right-2.5 bottom-2.5 w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <ArrowUpIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
