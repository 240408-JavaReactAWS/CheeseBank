import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { FaGithub, FaSignOutAlt } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useSession();

  const handleLogout = () => {
    logout();
    document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');
  }

  return (
    <div className="footer">
      <p className="slogan">For all of your delicious banking needs</p>
      <div className="logout-section">
        <a href="https://github.com/240408-JavaReactAWS/CheeseBank/" target="_blank" rel="noopener noreferrer">
          <FaGithub size={32} />
        </a>
        <FaSignOutAlt className="signout-icon" size={32} onClick={handleLogout} />
      </div>
    </div>
  );
}

export default Footer;