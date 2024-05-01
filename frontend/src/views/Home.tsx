import React, { useState, useCallback } from 'react';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import { Button } from 'react-bootstrap';
import './Home.css'; // import the CSS file

const Home: React.FC = () => {
  const [view, setView] = useState<'login'| 'register' | 'forgot'>('login');

  const handleViewChange = useCallback((view: 'login'| 'register' | 'forgot') => {
    setView(view);
  }, []);

  return (
    <div className="home-form">
      {view === 'login' && <Login />}
      <div className="form-group">
        {(view === 'login') && <Button className="btn" aria-label="Register" onClick={() => handleViewChange('register')}>Sign up now</Button>}
        {(view === 'login') && <Button className="btn" aria-label="Forgot Password" onClick={() => handleViewChange('forgot')}>Forgot password?</Button>}
      </div>
      {view === 'register' && <Register />}
      {view === 'forgot' && <ForgotPassword />}
      {view !== 'login' && <Button className="btn" aria-label="Back to Login" onClick={() => handleViewChange('login')}>Back to Login</Button>}
    </div>
  );
};

export default Home;