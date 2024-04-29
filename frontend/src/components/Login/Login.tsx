import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <div>
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameInput}
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"  // Changed input type to "password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordInput}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
