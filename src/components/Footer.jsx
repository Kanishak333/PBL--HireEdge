import React from 'react';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>HireEdge</h3>
                    <p>Intelligent resume shortlisting for modern HR teams. Powered by advanced NLP.</p>
                </div>

                <div className="footer-section">
                    <h4>Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/features">Features</a></li>
                        <li><a href="/demo">Demo</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="social-icons">
                        <a href="#"><FiGithub /></a>
                        <a href="#"><FiTwitter /></a>
                        <a href="#"><FiLinkedin /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} HireEdge. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
