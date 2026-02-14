import React, { useState } from 'react';

function AdminPanel({ hackathons, problems, users, submissions, addHackathon, addProblem, deleteUser, evaluateSubmission }) {
    const [hackTitle, setHackTitle] = useState('');
    const [probTitle, setProbTitle] = useState('');
    const [probDesc, setProbDesc] = useState('');
    const [probDiff, setProbDiff] = useState('Medium');
    const [hackId, setHackId] = useState('');
    const [evalHackId, setEvalHackId] = useState('');

    const handleAddHackathon = (e) => {
        e.preventDefault();
        addHackathon({ title: hackTitle, status: 'Active', participants: 0 });
        setHackTitle('');
    };

    const handleAddProblem = (e) => {
        e.preventDefault();
        addProblem({ title: probTitle, description: probDesc, difficulty: probDiff, hackathonId: parseInt(hackId) });
        setProbTitle('');
        setProbDesc('');
    };

    const handleEvaluate = (subIdx, score) => {
        evaluateSubmission(subIdx, parseInt(score));
    };

    const filteredSubmissions = evalHackId ? submissions.filter(s => s.hackathonId === parseInt(evalHackId)) : [];

    return (
        <div>
            <h2>Admin Panel</h2>
            
            <div className="admin-section">
                <h3>Add Hackathon</h3>
                <form onSubmit={handleAddHackathon}>
                    <input type="text" placeholder="Hackathon Title" value={hackTitle} onChange={(e) => setHackTitle(e.target.value)} required />
                    <button type="submit" className="btn-primary">Add Hackathon</button>
                </form>
            </div>

            <div className="admin-section">
                <h3>Add Problem</h3>
                <form onSubmit={handleAddProblem}>
                    <select value={hackId} onChange={(e) => setHackId(e.target.value)} required>
                        <option value="">Select Hackathon</option>
                        {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                    </select>
                    <input type="text" placeholder="Problem Title" value={probTitle} onChange={(e) => setProbTitle(e.target.value)} required />
                    <textarea placeholder="Problem Description" value={probDesc} onChange={(e) => setProbDesc(e.target.value)} required></textarea>
                    <select value={probDiff} onChange={(e) => setProbDiff(e.target.value)}>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                    <button type="submit" className="btn-primary">Add Problem</button>
                </form>
            </div>

            <div className="admin-section">
                <h3>Evaluate Submissions</h3>
                <select value={evalHackId} onChange={(e) => setEvalHackId(e.target.value)} style={{ marginBottom: '1rem' }}>
                    <option value="">Select Hackathon</option>
                    {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                </select>
                
                {filteredSubmissions.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No submissions to evaluate</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredSubmissions.map((sub, idx) => {
                            const actualIdx = submissions.indexOf(sub);
                            return (
                                <div key={idx} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ marginBottom: '0.5rem', color: '#0f172a' }}>{sub.title}</h4>
                                    <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>By: {sub.submittedBy}</p>
                                    <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>{sub.description}</p>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                        <a href={sub.github} target="_blank" rel="noreferrer" style={{ color: '#1e3a8a', fontWeight: '600' }}>GitHub</a>
                                        {sub.demo && <a href={sub.demo} target="_blank" rel="noreferrer" style={{ color: '#1e3a8a', fontWeight: '600' }}>Demo</a>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input 
                                            type="number" 
                                            placeholder="Score (0-100)" 
                                            min="0" 
                                            max="100"
                                            defaultValue={sub.score || ''}
                                            id={`score-${actualIdx}`}
                                            style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', width: '150px' }}
                                        />
                                        <button 
                                            className="btn-primary" 
                                            onClick={() => {
                                                const score = document.getElementById(`score-${actualIdx}`).value;
                                                if (score) handleEvaluate(actualIdx, score);
                                            }}
                                        >
                                            {sub.score ? 'Update Score' : 'Evaluate'}
                                        </button>
                                        {sub.score && <span style={{ color: '#10b981', fontWeight: '600' }}>Current Score: {sub.score}/100</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="admin-section">
                <h3>Manage Users</h3>
                <div className="users-list">
                    {users.map((user, idx) => (
                        <div key={idx} className="user-item">
                            <span>{user.name} ({user.email}) - {user.role}</span>
                            {user.role !== 'admin' && (
                                <button className="btn-secondary" onClick={() => deleteUser(idx)}>Remove</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
