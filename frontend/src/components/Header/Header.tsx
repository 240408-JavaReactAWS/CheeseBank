import React from 'react';
import './Header.css';

// interface HeaderProps {
//   title: string;
// }

// const Header: React.FC<HeaderProps> = ({ title }) => {
const Header: React.FC = () => {
  return (
    <div className="header">
      <h1 className="title">Cheese Bank</h1>
      <span style={{fontSize: 14}}> Banking Without the Holes in Security</span>
    </div>
  );
};

export default Header;