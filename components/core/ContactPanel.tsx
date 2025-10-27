import React, { useState } from 'react';
import { MailIcon } from '../ui/Icons';
import { saveContactMessage } from '../../services/projectService';

interface ContactPanelProps {
    onBackToEditor: () => void;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const ContactPanel: React.FC<ContactPanelProps> = ({ onBackToEditor }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !message) {
            setError('Name and message are required.');
            setStatus('error');
            return;
        }
        setStatus('sending');
        setError(null);
        try {
            await saveContactMessage({ name, email, message });
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
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
                    <div className="text-center">
                        <MailIcon className="w-16 h-16 mx-auto text-accent"/>
                        <h1 className="mt-4 text-2xl font-bold text-text-primary">Get in Touch</h1>
                        <p className="mt-2 text-text-secondary">
                            Have questions, feedback, or need support? Fill out the form below and we'll get back to you.
                        </p>
                    </div>
                    {status === 'success' ? (
                        <div className="mt-8 text-center p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
                            <h3 className="font-semibold">Message Sent!</h3>
                            <p>Thanks for reaching out. We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary text-left mb-1">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary text-left mb-1">Email (Optional)</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary text-left mb-1">Message</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent resize-none"
                                />
                            </div>
                            {status === 'error' && error && (
                                <div className="p-3 bg-error-bg text-error-text rounded-md text-sm border border-red-200">
                                    {error}
                                </div>
                            )}
                            <div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-lg font-medium text-white bg-accent hover:bg-accent-hover transition-colors shadow-sm disabled:bg-gray-400"
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ContactPanel;
