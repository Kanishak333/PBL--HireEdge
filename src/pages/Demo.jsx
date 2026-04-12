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
import { FiUploadCloud, FiFileText, FiCheck, FiLoader, FiDownload, FiAlertCircle, FiX, FiUser, FiAward, FiBriefcase, FiBookOpen, FiFilter } from 'react-icons/fi';
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
    const [selectedCandidate, setSelectedCandidate] = useState(null); // For resume modal
    const [selectedSkills, setSelectedSkills] = useState([]); // Skill filters
    const [skillInput, setSkillInput] = useState(''); // Custom skill input

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

            const text = await response.text();

            if (!response.ok) {
                let errorMsg = 'Analysis failed';
                try {
                    const errData = JSON.parse(text);
                    errorMsg = errData.error || errorMsg;
                } catch {
                    errorMsg = `Server error (${response.status}). Make sure the backend is running with: npm run server`;
                }
                throw new Error(errorMsg);
            }

            const data = JSON.parse(text);
            setAnalysisResult(data.analysis);
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Something went wrong. Make sure the backend server is running (npm run server).');
            setStep(0);
        }
    };

    // Sort candidates by score (highest first)
    const sortedCandidates = analysisResult ? [...analysisResult].sort((a, b) => b.score - a.score) : [];

    // Extract all unique skills from all candidates
    const allSkills = analysisResult
        ? [...new Set(analysisResult.flatMap(c => c.skills || []))].sort()
        : [];

    // Toggle a skill filter
    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    // Add a custom skill filter
    const addCustomSkill = (input) => {
        const skill = input.trim();
        if (skill && !selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
            setSelectedSkills(prev => [...prev, skill]);
        }
        setSkillInput('');
    };

    // Filter candidates by selected skills (case-insensitive)
    const filteredCandidates = selectedSkills.length > 0
        ? sortedCandidates.filter(c => c.skills && selectedSkills.every(s =>
            c.skills.some(cs => cs.toLowerCase().includes(s.toLowerCase()))
        ))
        : sortedCandidates;

    // Chart data: Top N Candidates (user-configurable)
    const topCandidates = filteredCandidates.slice(0, topN);
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
                            <button className="btn btn-outline" onClick={() => { setStep(0); setAnalysisResult(null); setSelectedSkills([]); setSkillInput(''); }}>
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
                        </div>

                        {/* Skill Filter */}
                        <div style={{
                            background: '#f8fafc', borderRadius: '12px', padding: '1rem 1.25rem',
                            marginBottom: '1.5rem', border: '1px solid #e2e8f0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <FiFilter style={{ color: '#3b82f6' }} />
                                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>Filter by Skills</span>
                                {selectedSkills.length > 0 && (
                                    <button
                                        onClick={() => setSelectedSkills([])}
                                        style={{
                                            marginLeft: 'auto', fontSize: '0.75rem', color: '#ef4444',
                                            background: '#fef2f2', border: '1px solid #fecaca',
                                            borderRadius: '6px', padding: '0.2rem 0.6rem',
                                            cursor: 'pointer', fontWeight: '500'
                                        }}
                                    >Clear All</button>
                                )}
                            </div>

                            {/* Custom skill input */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addCustomSkill(skillInput);
                                        }
                                    }}
                                    placeholder="Type a skill (e.g. Marketing, Finance, Analyst)..."
                                    style={{
                                        flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem',
                                        border: '1px solid #cbd5e1', borderRadius: '8px',
                                        outline: 'none', background: '#fff'
                                    }}
                                />
                                <button
                                    onClick={() => addCustomSkill(skillInput)}
                                    disabled={!skillInput.trim()}
                                    style={{
                                        padding: '0.5rem 1rem', fontSize: '0.85rem',
                                        background: skillInput.trim() ? '#3b82f6' : '#94a3b8',
                                        color: '#fff', border: 'none', borderRadius: '8px',
                                        cursor: skillInput.trim() ? 'pointer' : 'not-allowed',
                                        fontWeight: '500', transition: 'background 0.2s'
                                    }}
                                >Add</button>
                            </div>

                            {/* Active filter tags */}
                            {selectedSkills.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                    {selectedSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            style={{
                                                fontSize: '0.8rem', padding: '0.3rem 0.6rem',
                                                borderRadius: '9999px', fontWeight: '500',
                                                background: '#3b82f6', color: '#fff',
                                                display: 'flex', alignItems: 'center', gap: '0.3rem'
                                            }}
                                        >
                                            {skill}
                                            <FiX
                                                style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                                                onClick={() => setSelectedSkills(prev => prev.filter(s => s !== skill))}
                                            />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Quick pick from extracted skills */}
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Quick pick from resumes:</div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {allSkills.map((skill) => {
                                    const isActive = selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                                    return (
                                        <button
                                            key={skill}
                                            onClick={() => toggleSkill(skill)}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.6rem',
                                                borderRadius: '9999px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                border: isActive ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                                background: isActive ? '#dbeafe' : '#fff',
                                                color: isActive ? '#2563eb' : '#64748b',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >{skill}</button>
                                    );
                                })}
                            </div>

                            {selectedSkills.length > 0 && (
                                <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#64748b' }}>
                                    Showing {filteredCandidates.length} of {sortedCandidates.length} candidates matching: {selectedSkills.join(', ')}
                                </div>
                            )}
                        </div>

                        <div className="dashboard-grid">
                            <div className="chart-card">
                                <Bar options={chartOptions} data={chartData} />
                            </div>

                            <div className="candidates-list">
                                <h3>Candidate Leaderboard ({topCandidates.length} of {filteredCandidates.length})</h3>
                                <div className="table-responsive">
                                    <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                                <th style={{ padding: '1rem' }}>Rank</th>
                                                <th style={{ padding: '1rem' }}>Name</th>
                                                <th style={{ padding: '1rem' }}>Score</th>
                                                <th style={{ padding: '1rem' }}>Experience</th>
                                                <th style={{ padding: '1rem' }}>Education</th>
                                                <th style={{ padding: '1rem' }}>Resume</th>
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
                                                    <td style={{ padding: '1rem' }}>
                                                        <button 
                                                            className="btn btn-outline" 
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedCandidate(candidate);
                                                            }}
                                                        >
                                                            <FiFileText /> View
                                                        </button>
                                                    </td>
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

            {/* Resume Modal */}
            {selectedCandidate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '1rem', backdropFilter: 'blur(4px)'
                }} onClick={() => setSelectedCandidate(null)}>
                    <div style={{
                        background: '#fff', borderRadius: '16px', maxWidth: '600px',
                        width: '100%', maxHeight: '85vh', overflowY: 'auto',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.3)', padding: '2rem',
                        position: 'relative', animation: 'fadeInUp 0.3s ease'
                    }} onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <button onClick={() => setSelectedCandidate(null)} style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: '#f1f5f9', border: 'none', borderRadius: '50%',
                            width: '36px', height: '36px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '1.1rem', color: '#64748b'
                        }}><FiX /></button>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '1.5rem'
                            }}><FiUser /></div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b' }}>{selectedCandidate.name}</h2>
                                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{selectedCandidate.role || 'Candidate'}</p>
                            </div>
                        </div>

                        {/* Score badge */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '1rem', background: '#f0fdf4', borderRadius: '12px',
                            marginBottom: '1.5rem', border: '1px solid #bbf7d0'
                        }}>
                            <FiAward style={{ fontSize: '1.5rem', color: '#16a34a' }} />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>Job Fit Score</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>{selectedCandidate.score}%</div>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                                    <FiBriefcase /> Experience
                                </div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>
                                    {selectedCandidate.experience ? `${selectedCandidate.experience} years` : 'N/A'}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                                    <FiBookOpen /> Education
                                </div>
                                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                                    {selectedCandidate.education || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 0.75rem', color: '#1e293b', fontSize: '0.95rem' }}>Skills</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {selectedCandidate.skills && selectedCandidate.skills.map((skill, i) => (
                                    <span key={i} style={{
                                        fontSize: '0.8rem', background: '#eff6ff',
                                        color: '#2563eb', padding: '0.3rem 0.75rem',
                                        borderRadius: '9999px', fontWeight: '500',
                                        border: '1px solid #bfdbfe'
                                    }}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        {selectedCandidate.summary && (
                            <div>
                                <h4 style={{ margin: '0 0 0.75rem', color: '#1e293b', fontSize: '0.95rem' }}>Summary</h4>
                                <p style={{
                                    margin: 0, color: '#475569', fontSize: '0.9rem',
                                    lineHeight: '1.6', background: '#f8fafc',
                                    padding: '1rem', borderRadius: '10px'
                                }}>{selectedCandidate.summary}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Demo;
