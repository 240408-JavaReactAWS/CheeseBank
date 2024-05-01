import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    dob: '',
    email: '',
    phone: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    if (input.length > 3) {
      input = input.slice(0, 3) + '-' + input.slice(3);
    }
    if (input.length > 7) {
      input = input.slice(0, 7) + '-' + input.slice(7);
    }
    setPhone(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError('Passwords must match!');
      return;
    }
    if (formData.password.length < 8) {
      setError('Passwords must be at least 8 characters!');
      return;
    }

    const dataToSend = {
      ...formData,
      phone
    };

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, dataToSend)
      .then(() => {
        console.log('User created successfully');
        setFormData({
          firstName: '',
          lastName: '',
          username: '',
          password: '',
          dob: '',
          email: '',
          phone: ''
        });
        setConfirmPassword('');
        setPhone('');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((err) => {
        setError(err.response.data);
      });
    };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" name="firstName" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" name="lastName" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" name="username" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" onChange={handleConfirmPasswordChange} />
      </Form.Group>

      <Form.Group controlId="dob">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control type="date" name="dob" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder='user@example.com'
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="phone">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          name="phone"
          placeholder='###-###-####'
          value={phone}
          onChange={handlePhoneChange} />
      </Form.Group>
      {error && <p className="text-danger">{error}</p>}
      <Button variant="primary" type="submit">
        Create account
      </Button>
    </Form>
  );
};

export default Register;