import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleForgotPassword = () => {
    const formData = new FormData();
    formData.append('email', email);

    axios.post(`http://localhost:8080/api/users/forgot-password`, formData)
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
          <Button onClick={handleForgotPassword}>Reset Password</Button>
        </>
      }
      {submitted &&
        <>
          <Modal show={isModalOpen} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Password Reset</Modal.Title>
            </Modal.Header>
            <Modal.Body>If the email is valid, a reset link will be sent.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <p>Check your email for further instructions.</p>
        </>
      }
    </div>
  )
}

export default ForgotPassword;