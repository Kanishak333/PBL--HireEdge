import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiCpu } from 'react-icons/fi';
import '../styles/navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <FiCpu className="logo-icon" />
                    <span>HireEdge</span>
                </Link>

                <div className="navbar-toggle" onClick={toggleMenu}>
                    {isOpen ? <FiX /> : <FiMenu />}
                </div>

                <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.name} className="navbar-item">
                            <Link
                                to={link.path}
                                className={`navbar-link ${location.pathname === link.path ? 'active-link' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li className="navbar-item">
                        <Link to="/demo" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                            Demo
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
