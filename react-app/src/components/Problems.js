import React from 'react';

function Problems({ problems, selectedHackathon }) {
    const filteredProblems = selectedHackathon ? problems.filter(p => p.hackathonId === selectedHackathon.id) : problems;

    return (
        <div>
            <h2>Problem Statements</h2>
            <div className="problems-list">
                {filteredProblems.length === 0 ? (
                    <p>No problems available yet.</p>
                ) : (
                    filteredProblems.map((problem, idx) => (
                        <div key={idx} className="problem-card">
                            <h3>{problem.title}</h3>
                            <p className="difficulty">Difficulty: {problem.difficulty}</p>
                            <p>{problem.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Problems;
