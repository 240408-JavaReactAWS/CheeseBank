import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { Button } from 'react-bootstrap';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/session`, {
      withCredentials: true
    })
    .then((response) => {
      if (response) {
        setIsLoggedIn(true);
      }
    })
    .catch((error) => {
      console.log('Error getting session: ', error);
    });
  }, []);

  const handleLogout = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, {
      withCredentials: true
    })
    .then((response) => {
      console.log(response.data);
      setIsLoggedIn(false);
      document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/');
    })
    .catch((error) => {
      console.log('Error logging out: ', error);
    });
  }

  return (
    <nav className="navbar navbar-expand navbar-body">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to={isLoggedIn ? "/Dashboard" : "/"}>Home</Link>
          <Link className="nav-item nav-link" to="/AboutUs">About Us</Link>
          <Link className="nav-item nav-link" to="/Locations">Find Locations and ATMs</Link>
        </div>
      </div>
      {isLoggedIn && location.pathname !== '/' && <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>}
    </nav>
  );
}

export default Navbar;