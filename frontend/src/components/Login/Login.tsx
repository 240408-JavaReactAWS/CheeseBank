import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import './Login.css';

const Login: React.FC = () => {
  const { sessionUser } = useSession();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (sessionUser) {
      navigate('/dashboard');
    }
  }, [sessionUser, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username,
        password
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        localStorage.setItem('username', username);
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
    <Form>
      <Form.Group controlId="username">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameInput}
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordInput}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleLogin}>
        Login
      </Button>
    </Form>
  );
};

export default Login;