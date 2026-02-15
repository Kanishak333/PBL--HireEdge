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
    const [topN, setTopN] = useState(5); // Filter for top N candidates

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

    // Sort candidates by score (highest first)
    const sortedCandidates = analysisResult ? [...analysisResult].sort((a, b) => b.score - a.score) : [];

    // Chart data: Top N Candidates (user-configurable)
    const topCandidates = sortedCandidates.slice(0, topN);
    const chartData = analysisResult ? {
        labels: topCandidates.map(c => c.name),
        datasets: [
            {
                label: 'Job Fit Score (%)',
                data: topCandidates.map(c => c.score),
                backgroundColor: 'rgba(34, 197, 94, 0.7)', // Green
                borderColor: '#16a34a', // Dark green
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 40,
            },
        ],
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Top Candidates Ranking',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <div className="demo-page">
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="demo-header">
                    <h1>Get Started with AI Analysis</h1>
                    <p>Experience the power of HireEdge. Upload a resume (or ONE combined PDF with multiple resumes) to see the AI Leaderboard.</p>
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
                            <h3>Click to Upload Document</h3>
                            <p>Supports Single or Combined PDFs (Max 5MB)</p>
                            <span className="btn btn-primary mt-4">Select PDF</span>
                        </label>
                    </div>
                )}

                {step === 1 && (
                    <div className="processing-zone">
                        <div className="spinner-container">
                            <FiLoader className="spinner-icon" />
                        </div>
                        <h3>Analyzing Candidates...</h3>
                        <p>Identifying candidates, extracting skills, and calculating job fit scores.</p>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label htmlFor="topN" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Show Top:</label>
                                <input
                                    id="topN"
                                    type="number"
                                    min="1"
                                    max={sortedCandidates.length}
                                    value={topN}
                                    onChange={(e) => setTopN(Math.min(Math.max(1, parseInt(e.target.value) || 1), sortedCandidates.length))}
                                    style={{
                                        width: '70px',
                                        padding: '0.5rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>of {sortedCandidates.length}</span>
                            </div>
                            <button className="btn btn-primary">
                                <FiDownload /> Export CSV
                            </button>
                        </div>

                        <div className="dashboard-grid">
                            <div className="chart-card">
                                <Bar options={chartOptions} data={chartData} />
                            </div>

                            <div className="candidates-list">
                                <h3>Candidate Leaderboard ({topCandidates.length} of {sortedCandidates.length})</h3>
                                <div className="table-responsive">
                                    <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                                <th style={{ padding: '1rem' }}>Rank</th>
                                                <th style={{ padding: '1rem' }}>Name</th>
                                                <th style={{ padding: '1rem' }}>Score</th>
                                                <th style={{ padding: '1rem' }}>Experience</th>
                                                <th style={{ padding: '1rem' }}>Education</th>
                                                <th style={{ padding: '1rem' }}>Role</th>
                                                <th style={{ padding: '1rem' }}>Top Skills</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topCandidates.map((candidate, index) => (
                                                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: index < 3 ? '#2563eb' : '#64748b' }}>
                                                        #{index + 1}
                                                    </td>
                                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{candidate.name}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 'bold',
                                                            backgroundColor: '#dcfce7',
                                                            color: '#166534',
                                                        }}>
                                                            {candidate.score}%
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                                        {candidate.experience ? `${candidate.experience} years` : 'N/A'}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                                                        {candidate.education || 'N/A'}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#64748b' }}>{candidate.role}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                            {candidate.skills && candidate.skills.slice(0, 3).map((skill, i) => (
                                                                <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
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
