import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default Header;