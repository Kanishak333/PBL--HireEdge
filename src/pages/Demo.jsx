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
import { FiUploadCloud, FiFileText, FiCheck, FiLoader, FiDownload, FiAlertCircle } from 'react-icons/fi';
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
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            handleFileUpload(selectedFile);
        }
    };

    const handleFileUpload = async (uploadedFile) => {
        setStep(1);
        setError('');

        const formData = new FormData();
        formData.append('resume', uploadedFile);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            setAnalysisResult(data.analysis);
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please check if the server is running.');
            setStep(0);
        }
    };

    // Chart data based on single result (comparing against ideal 100%)
    const chartData = analysisResult ? {
        labels: ['Job Fit Score'],
        datasets: [
            {
                label: 'Score (%)',
                data: [analysisResult.score],
                backgroundColor: analysisResult.score >= 80 ? 'rgba(34, 197, 94, 0.7)' :
                    analysisResult.score >= 60 ? 'rgba(59, 130, 246, 0.7)' :
                        'rgba(239, 68, 68, 0.7)',
                borderColor: analysisResult.score >= 80 ? '#16a34a' :
                    analysisResult.score >= 60 ? '#2563eb' :
                        '#dc2626',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 50,
            },
        ],
    } : null;

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Candidate Relevance Score' },
        },
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    };

    return (
        <div className="demo-page">
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="demo-header">
                    <h1>Live Demo</h1>
                    <p>Experience the power of HireEdge. Upload a resume (PDF) to see AI analysis in action.</p>
                </div>

                {error && (
                    <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                        <FiAlertCircle style={{ marginRight: '0.5rem' }} />
                        {error}
                    </div>
                )}

                {step === 0 && (
                    <div className="upload-zone">
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="resume-upload" className="upload-content" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <FiUploadCloud className="upload-icon" />
                            <h3>Click to Upload Resume</h3>
                            <p>Supports PDF (Max 5MB)</p>
                            <span className="btn btn-primary mt-4">Select PDF</span>
                        </label>
                    </div>
                )}

                {step === 1 && (
                    <div className="processing-zone">
                        <div className="spinner-container">
                            <FiLoader className="spinner-icon" />
                        </div>
                        <h3>Analyzing Document...</h3>
                        <p>Extracting skills, experience, and calculating job fit score.</p>
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                )}

                {step === 2 && analysisResult && (
                    <div className="results-zone">
                        <div className="results-actions">
                            <button className="btn btn-outline" onClick={() => { setStep(0); setAnalysisResult(null); }}>
                                <FiUploadCloud /> New Upload
                            </button>
                        </div>

                        <div className="dashboard-grid">
                            <div className="chart-card">
                                <Bar options={chartOptions} data={chartData} />
                            </div>

                            <div className="candidates-list">
                                <h3>Analysis Report</h3>
                                <div className="analysis-details" style={{ marginTop: '1rem' }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <strong>Name:</strong> {analysisResult.name}
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <strong>Suggested Role:</strong> {analysisResult.role}
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <strong>Summary:</strong>
                                        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>{analysisResult.summary}</p>
                                    </div>
                                    <div>
                                        <strong>Skills Detected:</strong>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {analysisResult.skills.map((skill, i) => (
                                                <span key={i} style={{
                                                    background: '#EFF6FF',
                                                    color: '#2563EB',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '15px',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
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
