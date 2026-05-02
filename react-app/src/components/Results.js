import React from 'react';

function Results({ submissions, selectedHackathon }) {
    const filtered = selectedHackathon ? submissions.filter(s => s.hackathon_id === selectedHackathon.id) : submissions;
    const sorted = [...filtered].filter(s => s.score != null).sort((a, b) => b.score - a.score);

    return (
        <div>
            <h2>Results & Leaderboard</h2>
            <div className="results-list">
                {sorted.length === 0 ? <p>No evaluated submissions yet.</p> : sorted.map((sub, idx) => (
                    <div key={sub.id} className="result-card">
                        <div className="rank">#{idx + 1}</div>
                        <div style={{ flex: 1 }}>
                            <h3>{sub.title}</h3>
                            <p>By: {sub.submitted_by}</p>
                            <a href={sub.github} target="_blank" rel="noreferrer">View Project</a>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e3a8a' }}>{sub.score}</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Score</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Results;
