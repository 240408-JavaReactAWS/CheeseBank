import React, { useState, useCallback } from 'react';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';

const Home: React.FC = () => {
  const [view, setView] = useState<'login'| 'register' | 'forgot'>('login');

  const handleViewChange = useCallback((view: 'login'| 'register' | 'forgot') => {
    setView(view);
  }, []);

  return (
    <div>
      {view === 'login' && <Login />}
      {view === 'register' && <Register />}
      {view === 'forgot' && <ForgotPassword />}
      {(view === 'login' || view === 'forgot') && <button aria-label="Register" onClick={() => handleViewChange('register')}>Sign up now</button>}
      {(view === 'login' || view === 'register') && <button aria-label="Forgot Password" onClick={() => handleViewChange('forgot')}>Forgot password?</button>}
      {view !== 'login' && <button aria-label="Back to Login" onClick={() => handleViewChange('login')}>Back to Login</button>}
    </div>
  );
};

export default Home;