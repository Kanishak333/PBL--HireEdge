import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiUploadCloud, FiFileText, FiCheck, FiLoader, FiDownload } from 'react-icons/fi';
import '../styles/demo.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Demo = () => {
    const [step, setStep] = useState(0); // 0: Upload, 1: Processing, 2: Results
    const [files, setFiles] = useState([]);

    // Mock candidates data
    const candidates = [
        { id: 1, name: 'Alice Smith', role: 'Senior Frontend Dev', score: 92, skills: ['React', 'Node.js', 'CSS'] },
        { id: 2, name: 'John Doe', role: 'Full Stack Engineer', score: 85, skills: ['Python', 'Django', 'React'] },
        { id: 3, name: 'Emma Wilson', role: 'UI/UX Designer', score: 78, skills: ['Figma', 'Adobe XD', 'HTML'] },
        { id: 4, name: 'Michael Brown', role: 'Backend Developer', score: 65, skills: ['Java', 'Spring', 'SQL'] },
        { id: 5, name: 'Sarah Davis', role: 'Frontend Junior', score: 45, skills: ['HTML', 'CSS', 'JS'] },
    ];

    const handleFileUpload = (e) => {
        e.preventDefault();
        // Simulate file selection
        setFiles(['resume_alice.pdf', 'resume_john.docx', 'resume_emma.pdf']);
        // Start processing after a short delay
        setTimeout(() => setStep(1), 800);
        // Finish processing
        setTimeout(() => setStep(2), 3500);
    };

    const chartData = {
        labels: candidates.map(c => c.name),
        datasets: [
            {
                label: 'Job Fit Score (%)',
                data: candidates.map(c => c.score),
                backgroundColor: candidates.map(c =>
                    c.score >= 80 ? 'rgba(34, 197, 94, 0.7)' :
                        c.score >= 60 ? 'rgba(59, 130, 246, 0.7)' :
                            'rgba(239, 68, 68, 0.7)'
                ),
                borderColor: candidates.map(c =>
                    c.score >= 80 ? '#16a34a' :
                        c.score >= 60 ? '#2563eb' :
                            '#dc2626'
                ),
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Candidate Relevance Analysis',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            }
        }
    };

    return (
        <div className="demo-page">
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="demo-header">
                    <h1>Live Demo</h1>
                    <p>Experience the power of HireEdge. Upload sample resumes to see ranking in action.</p>
                </div>

                {step === 0 && (
                    <div className="upload-zone" onClick={(e) => handleFileUpload(e)}>
                        <div className="upload-content">
                            <FiUploadCloud className="upload-icon" />
                            <h3>Drop resumes here or click to upload</h3>
                            <p>Supports PDF, DOCX, TXT (Max 10 files)</p>
                            <button className="btn btn-primary mt-4">Select Files</button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="processing-zone">
                        <div className="spinner-container">
                            <FiLoader className="spinner-icon" />
                        </div>
                        <h3>Analyzing Documents...</h3>
                        <p>Extracting skills, experience, and matching with job description.</p>
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="results-zone">
                        <div className="results-actions">
                            <button className="btn btn-outline" onClick={() => { setStep(0); setFiles([]); }}>
                                <FiUploadCloud /> New Upload
                            </button>
                            <button className="btn btn-primary">
                                <FiDownload /> Export Report
                            </button>
                        </div>

                        <div className="dashboard-grid">
                            <div className="chart-card">
                                <Bar options={chartOptions} data={chartData} />
                            </div>

                            <div className="candidates-list">
                                <h3>Ranked Candidates</h3>
                                <div className="candidates-table-container">
                                    <table className="candidates-table">
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Match</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map((c, index) => (
                                                <tr key={c.id}>
                                                    <td>#{index + 1}</td>
                                                    <td className="font-bold">{c.name}</td>
                                                    <td>{c.role}</td>
                                                    <td>
                                                        <span className={`score-badge ${c.score >= 80 ? 'score-high' :
                                                                c.score >= 60 ? 'score-mid' : 'score-low'
                                                            }`}>
                                                            {c.score}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Demo;
