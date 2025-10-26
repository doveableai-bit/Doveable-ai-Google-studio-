import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  // The app now conditionally renders the main pages based on a simple
  // authentication state. This allows for a clear separation between the
  // public landing page and the private dashboard area.
  if (!isAuthenticated) {
    // Pass a callback to the HomePage to update the auth state upon successful login/guest selection.
    return <HomePage onAuthSuccess={handleAuthSuccess} />;
  }

  // Once authenticated, the user is shown the main dashboard and given a way to log out.
  return <DashboardPage onLogout={handleLogout} />;
};

export default App;