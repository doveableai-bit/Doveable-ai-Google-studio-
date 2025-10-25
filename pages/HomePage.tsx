
import React from 'react';
import DashboardPage from './DashboardPage';

// FIX: Removed API key checking logic and UI to align with guidelines.
// The app now directly renders the dashboard, assuming the API key is configured externally.
const HomePage: React.FC = () => {
  return <DashboardPage />;
};

export default HomePage;