import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords must match!');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters!');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/reset-password`, {
      token: token,
      password: password
    })
      .then((response) => {
        if (response.status === 200) {
          setModalMessage("Password reset successful!");
          setShowModal(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      })
      .catch((error) => {
        setModalMessage("Password reset failed!");
        setShowModal(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      });
  }

  return (
    <div className='reset-password-body'>
      <div className='password-input-container'>
        <div className="input-with-icon">
          <input value={password} type={showPassword ? 'text' : 'password'} onChange={handlePasswordInput} placeholder="New Password" />
          <span className="password-toggle" onClick={toggleShowPassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <input value={confirmPassword} type={showPassword ? 'text' : 'password'} onChange={handleConfirmPasswordInput} placeholder="Confirm Password" />
        {passwordError && <p className='passwordError'>{passwordError}</p>}
        <Button onClick={handleSubmit}>Reset Password</Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ResetPassword;