import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav>
            {
            /* Navbar content goes here */
                <ul>
                    <li>Home</li>
                    <li>Start a Transaction</li>
                    <li>Transaction History</li>
                    <li>Account information</li>
                    {/* ADJUST NAVBAR AS NEEDED */}
                </ul>
            
            }
        </nav>
    );
};

export default Navbar;