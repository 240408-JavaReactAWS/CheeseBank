import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';


const Navbar: React.FC = () => {
    
    return (
        <nav className="navbar navbar-expand navbar-body"> 
            {/* <a className="navbar-brand" href="#">Navbar</a> */}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav mr-auto">
                    <Link className="nav-item nav-link" to="/dashboard">Home</Link> {/* TODO DIRECT TO DASHBOARD */}
                    <Link className="nav-item nav-link" to="/aboutUs">About Us</Link>
                    <Link className="nav-item nav-link" to="/Locations">Find Locations and ATMs</Link>
                </div>
                <div className="ml-auto"> {/* Use ml-auto for left margin auto, pushing elements to the right */}
                    <Link className="nav-item nav-link" to="/profile">Profile</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
