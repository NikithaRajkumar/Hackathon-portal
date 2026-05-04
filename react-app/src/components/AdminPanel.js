import React, { useState } from 'react';

function AdminPanel({ hackathons, problems, users, submissions, addHackathon, updateHackathon, deleteHackathon, addProblem, updateProblem, deleteProblem, deleteUser, evaluateSubmission }) {
    const [hackForm, setHackForm] = useState({ title: '', description: '', status: 'Active', start_date: '', end_date: '', rules: { prize: '', eligibility: '', tags: '' } });
    const [editingHack, setEditingHack] = useState(null);
    const [probForm, setProbForm] = useState({ title: '', description: '', difficulty: 'Medium', hackathon_id: '', constraints: { time_limit: '', input_format: '', resources: '' } });
    const [editingProb, setEditingProb] = useState(null);
    const [evalHackId, setEvalHackId] = useState('');
    const [scores, setScores] = useState({});
    const [feedbacks, setFeedbacks] = useState({});

    const handleHackSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...hackForm,
            rules: { prize: hackForm.rules.prize, eligibility: hackForm.rules.eligibility, tags: hackForm.rules.tags.split(',').map(t => t.trim()).filter(Boolean) }
        };
        if (editingHack) { await updateHackathon(editingHack.id, payload); setEditingHack(null); }
        else await addHackathon(payload);
        setHackForm({ title: '', description: '', status: 'Active', start_date: '', end_date: '', rules: { prize: '', eligibility: '', tags: '' } });
    };

    const handleProbSubmit = async (e) => {
        e.preventDefault();
        if (editingProb) { await updateProblem(editingProb.id, probForm); setEditingProb(null); }
        else await addProblem(probForm);
        setProbForm({ title: '', description: '', difficulty: 'Medium', hackathon_id: '', constraints: { time_limit: '', input_format: '', resources: '' } });
    };

    const startEditHack = (h) => {
        setEditingHack(h);
        setHackForm({ title: h.title, description: h.description || '', status: h.status, start_date: h.start_date?.split('T')[0] || '', end_date: h.end_date?.split('T')[0] || '', rules: { prize: h.rules?.prize || '', eligibility: h.rules?.eligibility || '', tags: (h.rules?.tags || []).join(', ') } });
    };

    const startEditProb = (p) => {
        setEditingProb(p);
        setProbForm({ title: p.title, description: p.description, difficulty: p.difficulty, hackathon_id: p.hackathon_id, constraints: { time_limit: p.constraints?.time_limit || '', input_format: p.constraints?.input_format || '', resources: p.constraints?.resources || '' } });
    };

    const filteredSubs = evalHackId ? submissions.filter(s => s.hackathon_id === parseInt(evalHackId)) : [];

    const handleEvaluate = async (sub) => {
        const score = scores[sub.id];
        if (!score) return;
        const submitter = users.find(u => u.name === sub.submitted_by);
        await evaluateSubmission(sub.id, parseInt(score), submitter?.email, sub.title, feedbacks[sub.id] || '');
        alert('Evaluated!');
    };

    const sectionStyle = { background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' };
    const inputStyle = { padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', width: '100%', marginBottom: '0.75rem', fontSize: '1rem' };

    return (
        <div>
            <h2>Admin Panel</h2>

            {/* Hackathons */}
            <div style={sectionStyle}>
                <h3>{editingHack ? 'Edit Hackathon' : 'Add Hackathon'}</h3>
                <form onSubmit={handleHackSubmit}>
                    <input style={inputStyle} placeholder="Title" value={hackForm.title} onChange={(e) => setHackForm({ ...hackForm, title: e.target.value })} required />
                    <textarea style={inputStyle} placeholder="Description" value={hackForm.description} onChange={(e) => setHackForm({ ...hackForm, description: e.target.value })} />
                    <select style={inputStyle} value={hackForm.status} onChange={(e) => setHackForm({ ...hackForm, status: e.target.value })}>
                        <option>Active</option><option>Upcoming</option><option>Closed</option>
                    </select>
                    <input style={inputStyle} type="date" value={hackForm.start_date} onChange={(e) => setHackForm({ ...hackForm, start_date: e.target.value })} />
                    <input style={inputStyle} type="date" value={hackForm.end_date} onChange={(e) => setHackForm({ ...hackForm, end_date: e.target.value })} />
                    <input style={inputStyle} placeholder="Prize (e.g. $5000)" value={hackForm.rules.prize} onChange={(e) => setHackForm({ ...hackForm, rules: { ...hackForm.rules, prize: e.target.value } })} />
                    <input style={inputStyle} placeholder="Eligibility (e.g. Open to all)" value={hackForm.rules.eligibility} onChange={(e) => setHackForm({ ...hackForm, rules: { ...hackForm.rules, eligibility: e.target.value } })} />
                    <input style={inputStyle} placeholder="Tags (comma separated, e.g. AI, ML)" value={hackForm.rules.tags} onChange={(e) => setHackForm({ ...hackForm, rules: { ...hackForm.rules, tags: e.target.value } })} />
                    <button type="submit" className="btn-primary">{editingHack ? 'Update' : 'Add'} Hackathon</button>
                    {editingHack && <button type="button" className="btn-secondary" onClick={() => { setEditingHack(null); setHackForm({ title: '', description: '', status: 'Active', start_date: '', end_date: '', rules: { prize: '', eligibility: '', tags: '' } }); }}>Cancel</button>}
                </form>
                <div style={{ marginTop: '1rem' }}>
                    {hackathons.map(h => (
                        <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid #e2e8f0' }}>
                            <span><strong>{h.title}</strong> — {h.status}{h.rules?.prize && ` | Prize: ${h.rules.prize}`}{h.rules?.tags?.length > 0 && ` | ${h.rules.tags.join(', ')}`}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => startEditHack(h)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => window.confirm('Delete hackathon?') && deleteHackathon(h.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Problems */}
            <div style={sectionStyle}>
                <h3>{editingProb ? 'Edit Problem' : 'Add Problem'}</h3>
                <form onSubmit={handleProbSubmit}>
                    <select style={inputStyle} value={probForm.hackathon_id} onChange={(e) => setProbForm({ ...probForm, hackathon_id: e.target.value })} required>
                        <option value="">Select Hackathon</option>
                        {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                    </select>
                    <input style={inputStyle} placeholder="Problem Title" value={probForm.title} onChange={(e) => setProbForm({ ...probForm, title: e.target.value })} required />
                    <textarea style={inputStyle} placeholder="Description" value={probForm.description} onChange={(e) => setProbForm({ ...probForm, description: e.target.value })} required />
                    <select style={inputStyle} value={probForm.difficulty} onChange={(e) => setProbForm({ ...probForm, difficulty: e.target.value })}>
                        <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                    <input style={inputStyle} placeholder="Time Limit (e.g. 48 hours)" value={probForm.constraints.time_limit} onChange={(e) => setProbForm({ ...probForm, constraints: { ...probForm.constraints, time_limit: e.target.value } })} />
                    <input style={inputStyle} placeholder="Input Format" value={probForm.constraints.input_format} onChange={(e) => setProbForm({ ...probForm, constraints: { ...probForm.constraints, input_format: e.target.value } })} />
                    <input style={inputStyle} placeholder="Resources / References" value={probForm.constraints.resources} onChange={(e) => setProbForm({ ...probForm, constraints: { ...probForm.constraints, resources: e.target.value } })} />
                    <button type="submit" className="btn-primary">{editingProb ? 'Update' : 'Add'} Problem</button>
                    {editingProb && <button type="button" className="btn-secondary" onClick={() => { setEditingProb(null); setProbForm({ title: '', description: '', difficulty: 'Medium', hackathon_id: '', constraints: { time_limit: '', input_format: '', resources: '' } }); }}>Cancel</button>}
                </form>
                <div style={{ marginTop: '1rem' }}>
                    {problems.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid #e2e8f0' }}>
                            <span><strong>{p.title}</strong> — {p.difficulty}{p.constraints?.time_limit && ` | ${p.constraints.time_limit}`}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => startEditProb(p)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => window.confirm('Delete problem?') && deleteProblem(p.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Evaluate */}
            <div style={sectionStyle}>
                <h3>Evaluate Submissions</h3>
                <select style={{ ...inputStyle, marginBottom: '1rem' }} value={evalHackId} onChange={(e) => setEvalHackId(e.target.value)}>
                    <option value="">Select Hackathon</option>
                    {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                </select>
                {filteredSubs.length === 0 ? <p style={{ color: '#64748b' }}>No submissions to evaluate</p> : filteredSubs.map((sub) => (
                    <div key={sub.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                        <h4>{sub.title}</h4>
                        <p style={{ color: '#64748b' }}>By: {sub.submitted_by}</p>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{sub.description}</p>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <a href={sub.links?.github} target="_blank" rel="noreferrer" style={{ color: '#1e3a8a', fontWeight: '600' }}>GitHub</a>
                            {sub.links?.demo && <a href={sub.links.demo} target="_blank" rel="noreferrer" style={{ color: '#1e3a8a', fontWeight: '600' }}>Demo</a>}
                            {sub.file_path && <a href={`http://localhost:8080/uploads/${sub.file_path}`} target="_blank" rel="noreferrer" style={{ color: '#1e3a8a', fontWeight: '600' }}>File</a>}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input type="number" placeholder="Score (0-100)" min="0" max="100" defaultValue={sub.evaluation?.score || ''} onChange={(e) => setScores({ ...scores, [sub.id]: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', width: '150px' }} />
                            <input placeholder="Feedback (optional)" defaultValue={sub.evaluation?.feedback || ''} onChange={(e) => setFeedbacks({ ...feedbacks, [sub.id]: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', flex: 1, minWidth: '200px' }} />
                            <button className="btn-primary" onClick={() => handleEvaluate(sub)}>{sub.evaluation?.score != null ? 'Update Score' : 'Evaluate'}</button>
                            {sub.evaluation?.score != null && <span style={{ color: '#10b981', fontWeight: '600' }}>Score: {sub.evaluation.score}/100</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Users */}
            <div style={sectionStyle}>
                <h3>Manage Users</h3>
                {users.map((user) => (
                    <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <span>{user.name} ({user.email}) — {user.role}</span>
                        {user.role !== 'admin' && (
                            <button onClick={() => window.confirm('Remove user?') && deleteUser(user.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanel;
