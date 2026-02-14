import React, { useState } from 'react';

function Submissions({ submissions, addSubmission, selectedHackathon, currentUser }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [github, setGithub] = useState('');
    const [demo, setDemo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addSubmission({ 
            title, 
            description, 
            github, 
            demo, 
            hackathonId: selectedHackathon?.id,
            submittedBy: currentUser.name,
            submittedAt: new Date().toLocaleString()
        });
        setTitle('');
        setDescription('');
        setGithub('');
        setDemo('');
        alert('Submission received!');
    };

    const filteredSubmissions = selectedHackathon ? submissions.filter(s => s.hackathonId === selectedHackathon.id) : submissions;

    return (
        <div>
            <h2>Submissions</h2>
            <div className="submission-form">
                <h3>Submit Your Solution</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Project Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <input type="url" placeholder="GitHub Repository URL" value={github} onChange={(e) => setGithub(e.target.value)} required />
                    <input type="url" placeholder="Live Demo URL" value={demo} onChange={(e) => setDemo(e.target.value)} />
                    <button type="submit" className="btn-primary">Submit Project</button>
                </form>
            </div>
            <div className="submissions-list">
                {filteredSubmissions.length === 0 ? (
                    <p>No submissions yet.</p>
                ) : (
                    filteredSubmissions.map((sub, idx) => (
                        <div key={idx} className="submission-card">
                            <h4>{sub.title}</h4>
                            <p>{sub.description}</p>
                            <p>{sub.submittedBy} • {sub.submittedAt}</p>
                            <p>
                                <a href={sub.github} target="_blank" rel="noreferrer">GitHub</a> 
                                {sub.demo && <a href={sub.demo} target="_blank" rel="noreferrer">Demo</a>}
                            </p>
                            <span className="status submitted">Submitted</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Submissions;
