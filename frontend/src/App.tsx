import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MasterPasswordPrompt from './components/MasterPasswordPrompt';
import Dashboard from './components/Dashboard';

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password';

function App() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { isAuthenticated, masterPassword } = useAuthStore();

  // Check for reset token in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setAuthView('reset-password');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleResetSuccess = () => {
    setResetToken(null);
    setAuthView('login');
  };

  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' && (
          <Login 
            onSwitchToRegister={() => setAuthView('register')}
            onForgotPassword={() => setAuthView('forgot-password')}
          />
        )}
        {authView === 'register' && (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
        {authView === 'forgot-password' && (
          <ForgotPassword onBackToLogin={() => setAuthView('login')} />
        )}
        {authView === 'reset-password' && resetToken && (
          <ResetPassword 
            token={resetToken} 
            onSuccess={handleResetSuccess}
          />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  if (!masterPassword) {
    return (
      <>
        <MasterPasswordPrompt />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <Dashboard />
      <Toaster position="top-right" />
    </>
  );
}

export default App;