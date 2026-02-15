import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <section className="text-center mb-12">
                <h1 className="section-title">About HireEdge</h1>
                <p className="section-subtitle">Revolutionizing the recruitment process with Artificial Intelligence.</p>
            </section>

            <section className="about-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#475569' }}>
                    HireEdge was founded with a simple mission: to help companies find the best talent faster,
                    without the bias and inefficiency of manual resume screening.
                </p>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#475569' }}>
                    Our team of engineers and data scientists has built a state-of-the-art NLP engine that
                    understands the nuances of skills, experience, and job requirements, bridging the gap
                    between job descriptions and candidate profiles.
                </p>
            </section>
        </div>
    );
};

export default About;
