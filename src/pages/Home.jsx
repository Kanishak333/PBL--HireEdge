import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiCpu, FiTrendingUp, FiUsers } from 'react-icons/fi';
import '../styles/home.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Intelligent Resume Shortlisting <br />
                            <span className="text-highlight">Powered by AI</span>
                        </h1>
                        <p className="hero-subtitle">
                            HireEdge uses advanced NLP to match candidates to your job descriptions instantly.
                            Save time, reduce bias, and hire the best talent faster.
                        </p>
                        <div className="hero-actions">
                            <Link to="/demo" className="btn btn-primary">Try Live Demo</Link>
                            <Link to="/how-it-works" className="btn btn-outline">How It Works</Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-visual-placeholder">
                            <FiCpu className="hero-icon" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <section className="section features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose HireEdge?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><FiUsers /></div>
                            <h3>Automated Screening</h3>
                            <p>Process thousands of resumes in seconds. No more manual sifting through endless PDFs.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><FiTrendingUp /></div>
                            <h3>Smart Ranking</h3>
                            <p>Candidates are scored and ranked based on semantic relevance to the job description.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><FiCheckCircle /></div>
                            <h3>Reduced Bias</h3>
                            <p>Focus on skills and experience. Our AI parses data objectively to ensure fair hiring.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container cta-container">
                    <h2>Ready to streamline your hiring?</h2>
                    <p>Join forward-thinking HR teams using HireEdge to find top talent.</p>
                    <Link to="/contact" className="btn btn-primary btn-large">Get Started Now</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
