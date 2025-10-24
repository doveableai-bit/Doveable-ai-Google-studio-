
import React, { useState } from 'react';
import type { ChatMessage } from '../../types';
import { SendIcon, UserIcon, AiIcon } from '../ui/Icons';

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! What kind of website would you like to create today?" }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col bg-secondary rounded-lg border border-gray-700 h-[50vh]">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><AiIcon className="w-5 h-5" /></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-accent text-white' : 'bg-primary'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5" /></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><AiIcon className="w-5 h-5" /></div>
             <div className="max-w-md p-3 rounded-lg bg-primary">
                <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></div>
                </div>
             </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., A portfolio for a photographer with a dark theme..."
            className="w-full pl-4 pr-12 py-3 bg-primary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={isLoading}
          />
          <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 disabled:opacity-50" disabled={isLoading}>
            <SendIcon className="w-6 h-6 text-gray-400 hover:text-accent" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
