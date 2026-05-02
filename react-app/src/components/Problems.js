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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Problems;
