import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const[invalidLogin, setInvalidLogin] = useState(false);
  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/users/login`, {
        username,
        password
      }, {
        withCredentials: true
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('username', username);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard');
        console.log('Login successful');
      }
    } catch (error) {
      setInvalidLogin(true);
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
    <div className="login-container mt-5">
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
        {invalidLogin && <p className="text-danger">Invalid username or password</p>}

        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>


    <a href="/forgot-password">  <p>forgot password</p></a>
    <a href="/register">  <p>Register</p></a>
    
    </div>
  );
};

export default Login;
