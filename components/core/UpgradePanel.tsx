import React from 'react';
import { CheckIcon, StarIcon, InfinityIcon, DatabaseIcon, LifeBuoyIcon, LayoutTemplateIcon, BrainCircuitIcon, GithubIcon } from '../ui/Icons';

interface UpgradePanelProps {
    onBackToProjects: () => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ onBackToProjects }) => {
    
    const features = [
        { icon: InfinityIcon, text: "Unlimited Generation Credits" },
        { icon: DatabaseIcon, text: "Permanent Project Storage" },
        { icon: LayoutTemplateIcon, text: "Access to Premium Templates" },
        { icon: GithubIcon, text: "GitHub Integration" },
        { icon: BrainCircuitIcon, text: "Advanced AI Learning" },
        { icon: LifeBuoyIcon, text: "Priority Support" },
    ];
    
    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto">
             <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-panel">
                <h2 className="font-semibold text-lg text-text-primary">Doveable AI Pro</h2>
                <button
                    onClick={onBackToProjects}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-text-primary transition-colors"
                >
                    Back to Editor
                </button>
            </header>
            <main className="flex-grow p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <StarIcon className="w-16 h-16 mx-auto text-amber-400" />
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">Unlock Your Full Potential</h1>
                    <p className="mt-6 text-lg text-text-secondary">Choose the plan that's right for you and take your web development to the next level with Doveable AI Pro.</p>
                </div>

                <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Free Plan */}
                    <div className="border border-border rounded-xl p-8 flex flex-col">
                        <h3 className="text-2xl font-semibold text-text-primary">Free</h3>
                        <p className="mt-4 text-text-secondary">For trying out the basics.</p>
                        <div className="mt-6">
                            <span className="text-4xl font-bold text-text-primary">$0</span>
                            <span className="text-lg font-medium text-text-secondary">/ month</span>
                        </div>
                        <button disabled className="mt-8 w-full py-3 px-4 rounded-md text-sm font-medium text-text-secondary bg-gray-200 cursor-not-allowed">
                            Current Plan
                        </button>
                        <ul className="mt-8 space-y-4 text-sm text-text-primary flex-grow">
                             <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>100 starting credits</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Temporary project storage (48 hours)</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Standard AI model</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pro Plans */}
                    <div className="relative border-2 border-accent rounded-xl p-8 flex flex-col col-span-1 lg:col-span-2">
                         <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="bg-accent text-white px-4 py-1 text-sm font-semibold rounded-full shadow-md">
                                Most Popular
                            </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-text-primary">Pro</h3>
                        <p className="mt-4 text-text-secondary">For professionals and serious hobbyists.</p>
                        
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                                <h4 className="font-semibold">Monthly</h4>
                                 <div className="mt-2">
                                    <span className="text-4xl font-bold text-text-primary">$29</span>
                                    <span className="text-lg font-medium text-text-secondary">/mo</span>
                                </div>
                                <button onClick={() => alert('Redirecting to payment...')} className="mt-6 w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-colors">
                                    Get Started
                                </button>
                            </div>
                             <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                                <h4 className="font-semibold">Yearly</h4>
                                 <div className="mt-2">
                                    <span className="text-4xl font-bold text-text-primary">$290</span>
                                    <span className="text-lg font-medium text-text-secondary">/yr</span>
                                </div>
                                <p className="text-xs text-green-600 font-semibold mt-1">2 months free!</p>
                                <button onClick={() => alert('Redirecting to payment...')} className="mt-4 w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-colors">
                                    Get Started
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-8 border-t border-border pt-8">
                             <p className="font-semibold text-text-primary">Everything in Free, plus:</p>
                             <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-text-primary">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <feature.icon className="w-5 h-5 text-accent flex-shrink-0" />
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UpgradePanel;