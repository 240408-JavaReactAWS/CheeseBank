import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetForm from './ResetForm';

const Login: React.FC = () => {
  return (
    <>
      <LoginForm />
      <RegisterForm />
      <ResetForm />
    </>
  );
}

export default Login;