import React from 'react';
import { MailIcon } from '../ui/Icons';

interface ContactPanelProps {
    onBackToEditor: () => void;
}

const ContactPanel: React.FC<ContactPanelProps> = ({ onBackToEditor }) => {

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
                <div className="max-w-2xl w-full bg-panel p-8 md:p-10 rounded-xl border border-border shadow-lg text-center">
                    <MailIcon className="w-16 h-16 mx-auto text-accent"/>
                    <h1 className="mt-4 text-2xl font-bold text-text-primary">Get in Touch</h1>
                    <p className="mt-2 text-text-secondary">
                        Have questions, feedback, or need support? Reach out to us directly by email.
                    </p>
                    <div className="mt-8">
                        <a 
                            href="mailto:TeamDoveableai@gmail.com"
                            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-lg font-medium text-white bg-accent hover:bg-accent-hover transition-colors shadow-sm"
                        >
                            <MailIcon className="w-5 h-5"/>
                            <span>TeamDoveableai@gmail.com</span>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContactPanel;