import React from 'react';

function Problems({ problems, selectedHackathon }) {
    const filtered = selectedHackathon ? problems.filter(p => p.hackathon_id === selectedHackathon.id) : problems;

    return (
        <div>
            <h2>Problem Statements</h2>
            <div className="problems-list">
                {filtered.length === 0 ? <p>No problems available yet.</p> : filtered.map((p) => (
                    <div key={p.id} className="problem-card">
                        <h3>{p.title}</h3>
                        <p className="difficulty">Difficulty: {p.difficulty}</p>
                        <p>{p.description}</p>
                        {(p.constraints?.time_limit || p.constraints?.input_format || p.constraints?.resources) && (
                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.9rem' }}>
                                {p.constraints.time_limit && <p style={{ margin: '0.25rem 0' }}><strong>Time Limit:</strong> {p.constraints.time_limit}</p>}
                                {p.constraints.input_format && <p style={{ margin: '0.25rem 0' }}><strong>Input Format:</strong> {p.constraints.input_format}</p>}
                                {p.constraints.resources && <p style={{ margin: '0.25rem 0' }}><strong>Resources:</strong> {p.constraints.resources}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Problems;
