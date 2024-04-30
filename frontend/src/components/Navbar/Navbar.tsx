import React from 'react';
import './Navbar.css';
import axios from 'axios';

const Navbar: React.FC = () => {
    const logoutHandler = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, {}, {
            withCredentials: true
        }).then(() => {
            window.location.href = '/';
        });
    }

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
            <button onClick={logoutHandler}>Log out</button>
        </nav>
    );
};

export default Navbar;