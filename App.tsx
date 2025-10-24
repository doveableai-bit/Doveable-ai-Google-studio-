import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabase';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import Header from './components/layout/Header';

const MainAppLayout: React.FC<{ session: Session }> = ({ session }) => {
  const [isAdminView, setIsAdminView] = useState(false);
  const isAdmin = session.user.email === 'Doveableai@gmail.com';

  return (
    <div className="flex flex-col h-screen bg-primary font-sans">
      <Header
        user={session.user}
        isAdmin={isAdmin}
        onToggleAdminView={() => setIsAdminView(!isAdminView)}
        currentView={isAdminView ? 'admin' : 'dashboard'}
      />
      {isAdmin && isAdminView ? (
        <AdminPage />
      ) : (
        <DashboardPage session={session} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange is the recommended way to handle auth state changes,
    // including the initial session loading after an OAuth redirect.
    // It fires once upon subscription with the initial session state, and then
    // again whenever the auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false); // Set loading to false only after we've confirmed the session status.
    });

    // The subscription is cleaned up when the component unmounts.
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-primary">
      {!session ? <HomePage /> : <MainAppLayout session={session} />}
    </div>
  );
};

export default App;
