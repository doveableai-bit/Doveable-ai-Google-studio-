import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { GoogleIcon, GithubIcon, DoveIcon, CloseIcon } from '../ui/Icons';

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'social' | 'email'>('social');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsSubmitting(true);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    setIsSubmitting(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setIsSubmitting(false);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else {
      // For simplicity, we can close the modal and let Supabase handle the confirmation email.
      // Or show a "check your email" message.
      onClose(); 
    }
    setIsSubmitting(false);
  };

  const renderSocialView = () => (
    <>
      <div className="space-y-3">
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200 border border-gray-600 disabled:opacity-50"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          Continue with Google
        </button>
        <button
          onClick={() => handleSocialLogin('github')}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200 border border-gray-600 disabled:opacity-50"
        >
          <GithubIcon className="w-5 h-5 mr-3" />
          Continue with GitHub
        </button>
      </div>
      <div className="flex items-center my-6">
        <hr className="w-full border-gray-700" />
        <span className="px-2 text-xs text-gray-500">OR</span>
        <hr className="w-full border-gray-700" />
      </div>
      <button onClick={() => setView('email')} className="w-full px-4 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200">
        Continue with email
      </button>
    </>
  );

  const renderEmailView = () => (
    <form onSubmit={handleEmailLogin}>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      {error && <p className="mt-3 text-xs text-red-400 text-center">{error}</p>}
      <div className="mt-6 space-y-3">
        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50">
          Sign In
        </button>
        <button type="button" onClick={handleEmailSignUp} disabled={isSubmitting} className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50">
          Sign Up
        </button>
      </div>
      <button onClick={() => setView('social')} className="text-sm text-gray-400 hover:text-white mt-4 text-center w-full">
        &larr; Back to other login options
      </button>
    </form>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-700 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="text-center mb-6">
          <div className="inline-block bg-primary p-3 rounded-xl mb-4">
            <DoveIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Start Building.</h2>
          <p className="text-gray-400">{view === 'social' ? 'Create a free account.' : 'Sign in or create an account.'}</p>
        </div>
        
        {view === 'social' ? renderSocialView() : renderEmailView()}
        
        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to the <a href="#" className="underline hover:text-gray-300">Terms of Service</a> and <a href="#" className="underline hover:text-gray-300">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
