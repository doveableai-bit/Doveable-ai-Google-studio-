// FIX: Implemented the ChatHistoryPanel component to display messages.
import React from 'react';
import type { ChatMessage } from '../../types';
import { UserIcon, DoveIcon } from '../ui/Icons';

interface ChatHistoryPanelProps {
  messages: ChatMessage[];
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({ messages }) => {
  return (
    <div className="flex-grow p-6 overflow-y-auto space-y-6">
      {messages.map((msg, index) => (
        <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
          {msg.role === 'assistant' && (
            <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center rounded-lg text-white">
              <DoveIcon className="w-5 h-5" />
            </div>
          )}
          <div className={`
            max-w-xl p-4 rounded-lg
            ${msg.role === 'user'
              ? 'bg-accent text-white rounded-br-none'
              : 'bg-white border border-gray-200 text-text-primary rounded-bl-none'
            }
          `}>
            <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
          </div>
          {msg.role === 'user' && (
             <div className="w-9 h-9 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
               <UserIcon className="w-5 h-5" />
             </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatHistoryPanel;
