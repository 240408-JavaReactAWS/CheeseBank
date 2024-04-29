import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { set } from 'date-fns';

function ResetPassword() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const[password, setPassword] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    const[passwordDoesnotmatch, setPasswordDoesnotmatch] = useState(false);
    const[passwordlengthError, setPasswordLengthVError] = useState(false);
    const[confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();


 const handlePasswordInput = (event) => {
    setPassword(event.target.value);
 }

 const handleConfirmPasswordInput = (event) => {
    setConfirmPassword(event.target.value);
 }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };




 const handleResetPassword = () => {
    if(password !== confirmPassword){
        setPasswordDoesnotmatch(true);
        setPasswordLengthVError(false);
        setPassword("");
        setConfirmPassword("");
        return;
    }
    if(password.length < 8){
        setPasswordLengthVError(true);
        setPasswordDoesnotmatch(false);
        setPassword("");
        setConfirmPassword("");
        return;
    }

        axios.post(`http://localhost:8080/api/v1/user/reset-password`,{
            token: token,
            password: password
        })
                .then((response) => {
                    if(password === confirmPassword && response.status === 200){
                        alert("Password reset successful");
                        navigate('/');
                    }
              
                    })
                .catch((error) => {
                    alert("error occured. Please try again.");
                console.log(error);
                    });
   
 } 
  
  return (
    <div className='reset-password-body'>
      <div className='password-input-container'>
        <div className="input-with-icon">
            <input value={password} type={showPassword ? 'text' : 'password'} onChange={handlePasswordInput} placeholder="New Password" />
                <span className="password-toggle" onClick={togglePasswordVisibility}>
                {   showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
        </div>
    </div>

      <input value={confirmPassword} type="password" onChange={handleConfirmPasswordInput} placeholder="Confirm Password" />
      {
            passwordDoesnotmatch && <p className='passwordNotMatchError'>Passwords do not match</p>
      }{
            passwordlengthError && <p className='passwordLengthError'>Password must be at least 8 characters</p>
      }
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
