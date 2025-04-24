import React from 'react';
import {Link} from 'react-router-dom';
import './RegistrationNavbar.css'; // make sure this is correct

const RegistrationNavbar = () =>{
    return (
        <nav className="registration-navbar">
            <Link to ="/" className="registration-nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/levels" className="nav-link">Levels</Link>
            <Link to="/login" className="nav-link">Login</Link>
        </nav>
    );
};
export default RegistrationNavbar;