import React from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import '../styles/contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="container">
                <h1 className="section-title">Get in Touch</h1>
                <p className="section-subtitle text-center">Have questions? We'd love to hear from you.</p>

                <div className="contact-grid">
                    <div className="contact-info">
                        <div className="info-item">
                            <FiMail className="info-icon" />
                            <div>
                                <h3>Email Us</h3>
                                <p>kanishakg1001@gmail.com</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FiPhone className="info-icon" />
                            <div>
                                <h3>Call Us</h3>
                                <p>9560303166</p>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form" action="https://formsubmit.co/kanishakg1001@gmail.com" method="POST">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Your Name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="your@email.com" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" rows="5" placeholder="How can we help?" required></textarea>
                        </div>
                        <input type="hidden" name="_captcha" value="false" />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
