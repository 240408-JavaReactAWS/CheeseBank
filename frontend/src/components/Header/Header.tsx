import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div>
      <h1>Cheese Bank</h1>
      <span style={{fontSize: 14}}> Banking Without the Holes in Security</span>
    </div>
  );
};

export default Header;