import React, { useState } from 'react';
import { UserIcon, SendIcon, SettingsIcon, CheckIcon, XIcon } from '../ui/Icons';
import { saveContactMessage } from '../../services/projectService';

interface ContactPanelProps {
    onBackToEditor: () => void;
    isUserStorageConfigured: boolean;
    onSettingsClick: () => void;
}

const ContactPanel: React.FC<ContactPanelProps> = ({ onBackToEditor, isUserStorageConfigured, onSettingsClick }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const canSend = name.trim() !== '' && message.trim() !== '' && status !== 'sending';

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSend) return;

        if (!isUserStorageConfigured) {
            setErrorMessage("A backend connection is required to send messages.");
            setStatus('error');
            return;
        }

        setStatus('sending');
        setErrorMessage('');
        try {
            await saveContactMessage({ name, email, message });
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setName('');
                setEmail('');
                setMessage('');
            }, 4000);
        } catch (error: any) {
            console.error("Failed to send message:", error);
            setErrorMessage(error.message || "An unknown error occurred. Please try again.");
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-panel">
                <h2 className="font-semibold text-lg text-text-primary">Contact Us</h2>
                <button
                    onClick={onBackToEditor}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors"
                >
                    Back to Editor
                </button>
            </header>
            <main className="flex-grow p-8 overflow-y-auto flex items-center justify-center">
                <div className="max-w-2xl w-full bg-panel p-8 md:p-10 rounded-xl border border-border shadow-lg">
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-8 h-8 text-accent"/>
                        <h1 className="text-2xl font-bold text-text-primary">Welcome, Guest!</h1>
                    </div>
                    <p className="mt-2 text-text-secondary">We'd love to hear from you. Your message will be sent to the Doveable AI team.</p>
                    
                    {!isUserStorageConfigured && (
                         <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 rounded-lg text-sm text-yellow-800 flex items-start gap-3">
                            <SettingsIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Backend Not Connected</h3>
                                <p className="mt-1">
                                    To send a message, you first need to connect to a backend. This ensures your messages can be stored and reviewed.
                                </p>
                                <button onClick={onSettingsClick} className="mt-2 font-semibold text-yellow-900 hover:underline">
                                    Go to Settings
                                </button>
                            </div>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSendMessage}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Your Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-200"
                                required
                                disabled={!isUserStorageConfigured || status === 'sending'}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Your Email (Optional)</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="For if we need to reply"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-200"
                                disabled={!isUserStorageConfigured || status === 'sending'}
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message</label>
                            <textarea
                                id="message"
                                placeholder="How can we help you?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none disabled:bg-gray-200"
                                required
                                disabled={!isUserStorageConfigured || status === 'sending'}
                            ></textarea>
                        </div>
                        
                        <div className="space-y-3">
                            <button 
                               type="submit"
                               disabled={!canSend || !isUserStorageConfigured}
                               className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white transition-colors
                                   ${status === 'success' ? 'bg-green-600' : 'bg-accent hover:bg-accent-hover'}
                                   ${(!canSend || !isUserStorageConfigured) ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}`}
                            >
                               {status === 'sending' && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-r-2 border-white"></div>}
                               {status === 'success' && <CheckIcon className="w-5 h-5"/>}
                               {status !== 'sending' && status !== 'success' && <SendIcon className="w-5 h-5"/>}
                               <span>
                                   {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                               </span>
                            </button>
                            {status === 'error' && (
                                <div className="p-3 bg-error-bg text-error-text text-sm rounded-lg flex items-center gap-2">
                                    <XIcon className="w-5 h-5 flex-shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ContactPanel;
