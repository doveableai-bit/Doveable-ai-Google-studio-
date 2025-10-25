import React from 'react';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  // Session prop is removed as the explicit auth UI is disabled.
  // The app now operates in a "guest" mode where projects are scoped
  // to an anonymous session.
  return <DashboardPage />;
};

export default App;
