import React from 'react';
import { FiUploadCloud, FiCpu, FiList } from 'react-icons/fi';
import '../styles/how-it-works.css';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            icon: <FiUploadCloud />,
            title: "Upload Resumes",
            description: "Drag and drop bulk resumes (PDF, DOCX) and the job description into the system."
        },
        {
            id: 2,
            icon: <FiCpu />,
            title: "AI Analysis",
            description: "Our NLP engine extracts key skills, experience, and qualifications from every document."
        },
        {
            id: 3,
            icon: <FiList />,
            title: "Get Ranked Results",
            description: "Receive a sorted list of candidates with match scores, ready for shortlisting."
        }
    ];

    return (
        <div className="hiw-page">
            <section className="section text-center">
                <div className="container">
                    <h1 className="section-title">How HireEdge Works</h1>
                    <p className="section-subtitle">Simple, fast, and effective. Start hiring smarter in three easy steps.</p>

                    <div className="steps-container">
                        {steps.map((step, index) => (
                            <div key={step.id} className="step-card">
                                <div className="step-number">{step.id}</div>
                                <div className="step-icon-wrapper">
                                    {step.icon}
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                                {index < steps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
