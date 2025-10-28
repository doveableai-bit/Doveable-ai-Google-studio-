import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
                data-testid="back-to-dashboard"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Welcome, Admin!</h2>
            <p className="text-gray-600">
                This is the central hub for managing your Doveable AI application.
                Future features will include:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
                <li>User Management: View, edit, and manage all registered users.</li>
                <li>AI Settings: Configure API keys and adjust model parameters.</li>
                <li>System Statistics: Monitor application usage and performance.</li>
                <li>Payment & Coins System: Manage subscriptions and user credits.</li>
            </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
