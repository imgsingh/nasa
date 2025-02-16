import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import './Navbar.css';
import BounceImage from '../../assets/bounce.png'

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for menu visibility

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" > {/* Wrap the image in an <a> tag */}
                    <img
                        src="https://api.nasa.gov/assets/img/favicons/favicon-192.png"
                        alt="NASA Logo"
                        height={50}
                        style={{ cursor: 'pointer' }} // Add inline style for cursor
                    />
                </a>
                <div className="navbar-toggle" onClick={toggleMobileMenu}>
                    <div className="navbar-toggle-line"></div>
                    <div className="navbar-toggle-line"></div>
                    <div className="navbar-toggle-line"></div>
                </div>
                <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}> {/* Add active class */}
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link" onClick={toggleMobileMenu}>Home</Link> {/* Close menu on click */}
                    </li>
                    <li className="navbar-item">
                        <Link to="/mars-photos" className="navbar-link" onClick={toggleMobileMenu}>Mars Photos</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/epic" className="navbar-link" onClick={toggleMobileMenu}>EPIC</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/asteroids" className="navbar-link" onClick={toggleMobileMenu}>Asteroids</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/images" className="navbar-link" onClick={toggleMobileMenu}>NASA Images</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;