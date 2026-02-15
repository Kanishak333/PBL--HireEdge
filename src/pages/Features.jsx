import React from 'react';
import { FiSearch, FiAward, FiBarChart2, FiShield, FiClock, FiZap } from 'react-icons/fi';
import '../styles/features.css';

const Features = () => {
    const featuresList = [
        {
            icon: <FiSearch />,
            title: "Semantic Search",
            description: "Go beyond keywords. Our NLP engine understands context, synonyms, and related skills to find the perfect match."
        },
        {
            icon: <FiAward />,
            title: "Smart Scoring",
            description: "Every candidate gets a relevance score (0-100%) based on how well their profile matches your job description."
        },
        {
            icon: <FiBarChart2 />,
            title: "Ranking Analytics",
            description: "Visualize candidate distribution and compare top applicants side-by-side with intuitive charts."
        },
        {
            icon: <FiShield />,
            title: "Bias Elimination",
            description: "Anonymized processing ensures decisions are based on merit, skills, and experience, not demographics."
        },
        {
            icon: <FiClock />,
            title: "Time Efficiency",
            description: "Shortlist from hundreds of resumes in minutes rather than days. Accelerate your time-to-hire."
        },
        {
            icon: <FiZap />,
            title: "Instant Processing",
            description: "Drag and drop resumes and get immediate results. No lengthy waiting periods or complex setups."
        }
    ];

    return (
        <div className="features-page">
            <section className="section features-hero">
                <div className="container">
                    <h1 className="section-title">Powerful Features for Modern Hiring</h1>
                    <p className="section-subtitle">Everything you need to streamline your recruitment process.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="features-grid-large">
                        {featuresList.map((feature, index) => (
                            <div key={index} className="feature-card-large">
                                <div className="feature-icon-wrapper">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
