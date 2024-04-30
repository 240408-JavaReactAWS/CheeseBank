import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleForgotPassword = () => {
    const formData = new FormData();
    formData.append('email', email);

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/forgot-password`, formData)
      .then(() => {
        setIsModalOpen(true);
        setEmail('');
        setSubmitted(true);
      })
      .catch((error) => {
        setIsModalOpen(true);
        setSubmitted(true);
      });
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className='forgot-password'>
      {!submitted &&
        <>
          <input value={email} onChange={handleEmailChange} placeholder="Email" />
          <button onClick={handleForgotPassword}>Reset Password</button>
        </>
      }
      {submitted &&
        <>
          <Modal isOpen={isModalOpen} onClose={closeModal}>Check your email for further instructions.</Modal>
          <p>Email has been sent with reset instructions</p>
        </>
      }
    </div>
  )
}

export default ForgotPassword;