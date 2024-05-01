import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import axios from 'axios';
import './NavigationBar.css';
import { Navbar, Nav } from 'react-bootstrap';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { MdLocalAtm, MdGroups } from 'react-icons/md';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const { sessionUser, logout } = useSession();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/session`, {
      withCredentials: true
    })
    .then((response) => {
      console.log('Logged in as user: ', response.data.username);
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
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link className="nav-link" to={sessionUser ? "/Dashboard" : "/"}>
            <p className="nav-icon"><FaHome /></p>
            <span>Home</span>
          </Link>
          <Link className="nav-link" to="/AboutUs">
            <p className="nav-icon"><MdGroups /></p>
            <span>About Us</span>
          </Link>
          <Link className="nav-link" to="/Locations">
            <p className="nav-icon"><MdLocalAtm /></p>
            <span>Find Locations/ATMs</span>
          </Link>
        </Nav>
      </Navbar.Collapse>
      {sessionUser &&
        <Link className="nav-link" to="/" onClick={handleLogout}>
          <p className="nav-icon"><FaSignOutAlt /></p>
          <span>Logout</span>
        </Link>
      }
    </Navbar>
  );
}

export default NavigationBar;