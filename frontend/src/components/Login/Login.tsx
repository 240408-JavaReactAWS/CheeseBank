import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import './Login.css';
import { useSession } from '../../context/SessionContext'; // Update the path according to your project structure

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useSession();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        username,
        password
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        login(response.data);
        if (response.data.userType === 'ADMIN') {
          navigate('/AdminDashboard');
        }
        if (response.data.userType === 'USER') {
          navigate('/dashboard');
        }
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  const handleUsernameInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  return (
    <Form className="login-form">
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder=""
          value={username}
          onChange={handleUsernameInput}
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          value={password}
          onChange={handlePasswordInput}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleLogin} className="btn">
        Login
      </Button>
    </Form>
  );
}

export default Login;