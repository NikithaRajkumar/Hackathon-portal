import React from 'react';

function Dashboard({ hackathons, teams, problems, submissions, selectedHackathon }) {
    const filteredTeams = selectedHackathon ? teams.filter(t => t.hackathonId === selectedHackathon.id) : teams;
    const filteredProblems = selectedHackathon ? problems.filter(p => p.hackathonId === selectedHackathon.id) : problems;
    const filteredSubmissions = selectedHackathon ? submissions.filter(s => s.hackathonId === selectedHackathon.id) : submissions;

    return (
        <div>
            <h2>{selectedHackathon ? selectedHackathon.title : 'Dashboard'}</h2>
            {selectedHackathon && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '0.5rem' }}>Status: <span className="status available">{selectedHackathon.status}</span></p>
                    <p style={{ fontSize: '1rem', color: '#64748b' }}>Total Participants: {selectedHackathon.participants}</p>
                </div>
            )}
            <div className="stats">
                <div className="stat-card">
                    <h3>{selectedHackathon ? 'Teams in this Hackathon' : 'Active Teams'}</h3>
                    <div className="count">{filteredTeams.length}</div>
                </div>
                <div className="stat-card">
                    <h3>{selectedHackathon ? 'Problems in this Hackathon' : 'Problems'}</h3>
                    <div className="count">{filteredProblems.length}</div>
                </div>
                <div className="stat-card">
                    <h3>{selectedHackathon ? 'Submissions in this Hackathon' : 'Submissions'}</h3>
                    <div className="count">{filteredSubmissions.length}</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
