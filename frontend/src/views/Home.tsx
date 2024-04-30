import React, { useState, useCallback } from 'react';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import { Button } from 'react-bootstrap';

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
      {(view === 'login' || view === 'forgot') && <Button aria-label="Register" onClick={() => handleViewChange('register')}>Sign up now</Button>}
      {(view === 'login' || view === 'register') && <Button aria-label="Forgot Password" onClick={() => handleViewChange('forgot')}>Forgot password?</Button>}
      {view !== 'login' && <Button aria-label="Back to Login" onClick={() => handleViewChange('login')}>Back to Login</Button>}
    </div>
  );
};

export default Home;