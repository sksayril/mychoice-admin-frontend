import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthContainer from './components/AuthContainer';
import Layout from './components/Layout';
// import DemoModeToggle from './components/DemoModeToggle';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  // const { isAuthenticated, loading, isDemoMode, toggleDemoMode } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <DemoModeToggle isDemoMode={isDemoMode} onToggle={toggleDemoMode} /> */}
      {!isAuthenticated ? <AuthContainer /> : <Layout />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;