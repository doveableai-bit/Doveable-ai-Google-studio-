import React from 'react';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  // Session prop is removed as the explicit auth UI is disabled.
  // The app now operates in a "guest" mode where projects are scoped
  // to an anonymous session.
  // The HomePage component will handle checking for the API key and rendering the Dashboard.
  return <HomePage />;
};

export default App;
