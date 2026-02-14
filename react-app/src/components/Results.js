import React from 'react';

function Results({ submissions, selectedHackathon }) {
    const filteredSubmissions = selectedHackathon ? submissions.filter(s => s.hackathonId === selectedHackathon.id) : submissions;
    const evaluatedSubmissions = filteredSubmissions.filter(s => s.score !== undefined);
    const sortedSubmissions = [...evaluatedSubmissions].sort((a, b) => b.score - a.score);

    return (
        <div>
            <h2>Results & Leaderboard</h2>
            <div className="results-list">
                {sortedSubmissions.length === 0 ? (
                    <p>No evaluated submissions yet. Admin needs to evaluate submissions first.</p>
                ) : (
                    sortedSubmissions.map((sub, idx) => (
                        <div key={idx} className="result-card">
                            <div className="rank">#{idx + 1}</div>
                            <div style={{ flex: 1 }}>
                                <h3>{sub.title}</h3>
                                <p>By: {sub.submittedBy}</p>
                                <p><a href={sub.github} target="_blank" rel="noreferrer">View Project</a></p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e3a8a' }}>{sub.score}</div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Score</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Results;
