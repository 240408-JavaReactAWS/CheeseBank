import axios from 'axios';
import { set } from 'date-fns';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {

    const[email, setEmail] = useState("");
    const[success, setSuccess] = useState(false);
    const navigate = useNavigate();


    const navigateToHomePage = () => {
        navigate('/');
    }

  

    const handleForgotPassword = () => {
        axios.post(`http://localhost:8080/api/v1/user/forgot-password?email=${email}`)
                .then(() => {
                alert("If the email exists, a reset link will be sent to it.");
                setEmail("");
                setSuccess(true);
                    })
                .catch((error) => {
                    setSuccess(true);
                    setEmail("");
                    alert("If the email exists, a reset link will be sent to it.");
                    });
    }


  return (
    <div className='forgot-password'>
      
      {
          !success && 
          <>
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <button onClick={handleForgotPassword}>Send Reset Link</button>
          </>
      }
      { success && 
        <>
        <p>Reset link sent to email</p>
        <button onClick={navigateToHomePage}>Go to Home</button>
        </>
     
      }
  
    </div>
  )
}

export default ForgotPassword
