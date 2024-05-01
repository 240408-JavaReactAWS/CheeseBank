import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { Button } from 'react-bootstrap';
import { useSession } from '../../context/SessionContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { sessionUser, logout } = useSession();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/session`, {
      withCredentials: true
    })
    .then((response) => {
      console.log(response.data.username);
    })
    .catch((error) => {
      console.log('Error getting session: ', error);
    });
  }, [sessionUser, navigate]);

  const handleLogout = () => {
    logout();
    document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand navbar-body">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to={sessionUser ? "/Dashboard" : "/"}>Home</Link>
          <Link className="nav-item nav-link" to="/AboutUs">About Us</Link>
          <Link className="nav-item nav-link" to="/Locations">Find Locations and ATMs</Link>
        </div>
      </div>
      {sessionUser && <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>}
    </nav>
  );
}

export default Navbar;