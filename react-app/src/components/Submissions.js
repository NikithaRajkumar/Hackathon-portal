import React, { useState } from 'react';

function Submissions({ submissions, addSubmission, selectedHackathon, currentUser }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [github, setGithub] = useState('');
    const [demo, setDemo] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('github', github);
        formData.append('demo', demo);
        formData.append('hackathon_id', selectedHackathon?.id);
        formData.append('submitted_by', currentUser.name);
        formData.append('user_email', currentUser.email);
        if (file) formData.append('file', file);
        try {
            await addSubmission(formData);
            setTitle(''); setDescription(''); setGithub(''); setDemo(''); setFile(null);
            alert('Submission received!');
        } catch (e) { setError(e.message); }
    };

    const filteredSubmissions = selectedHackathon ? submissions.filter(s => s.hackathon_id === selectedHackathon.id) : submissions;

    return (
        <div>
            <h2>Submissions</h2>
            <div className="submission-form">
                <h3>Submit Your Solution</h3>
                {error && <p style={{ color: '#ef4444' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Project Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <input type="url" placeholder="GitHub Repository URL" value={github} onChange={(e) => setGithub(e.target.value)} required />
                    <input type="url" placeholder="Live Demo URL (optional)" value={demo} onChange={(e) => setDemo(e.target.value)} />
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Upload Project File (optional, max 10MB)</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ padding: '0.5rem', border: '2px solid #e2e8f0', borderRadius: '8px', width: '100%' }} />
                    </div>
                    <button type="submit" className="btn-primary">Submit Project</button>
                </form>
            </div>
            <div className="submissions-list">
                {filteredSubmissions.length === 0 ? <p>No submissions yet.</p> : filteredSubmissions.map((sub) => (
                    <div key={sub.id} className="submission-card">
                        <h4>{sub.title}</h4>
                        <p>{sub.description}</p>
                        <p>{sub.submitted_by} • {new Date(sub.submitted_at).toLocaleString()}</p>
                        <p>
                            <a href={sub.github} target="_blank" rel="noreferrer">GitHub</a>
                            {sub.demo && <> · <a href={sub.demo} target="_blank" rel="noreferrer">Demo</a></>}
                            {sub.file_path && <> · <a href={`http://localhost:5000/uploads/${sub.file_path}`} target="_blank" rel="noreferrer">Download File</a></>}
                        </p>
                        <span className="status submitted">Submitted</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Submissions;
