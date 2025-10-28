import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import AdminPage from './pages/AdminPage';
import SharePage from './pages/SharePage';

const AppRoutes: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={!session ? <HomePage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={session ? <DashboardPage /> : <Navigate to="/" />} />
      <Route path="/project/:projectId" element={session ? <ProjectPage /> : <Navigate to="/" />} />
      <Route path="/admin" element={session ? <AdminPage /> : <Navigate to="/" />} />
      <Route path="/share/:projectId" element={<SharePage />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;