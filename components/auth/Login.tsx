
import React from 'react';
import { supabase } from '../../services/supabase';
import { GoogleIcon, GithubIcon } from '../ui/Icons';

const Login: React.FC = () => {
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-center text-white mb-6">Get Started</h2>
      <div className="space-y-4">
        <button
          onClick={() => handleSocialLogin('google')}
          className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <GoogleIcon className="w-6 h-6 mr-3" />
          Continue with Google
        </button>
        <button
          onClick={() => handleSocialLogin('github')}
          className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <GithubIcon className="w-6 h-6 mr-3" />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
