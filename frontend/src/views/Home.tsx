import React from 'react';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import ResetPassword from '../components/ResetPassword/ResetPassword';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home</h1>
      <Login />
      <Register />
      <ForgotPassword />
      <ResetPassword />
    </div>
  );
};

export default Home;