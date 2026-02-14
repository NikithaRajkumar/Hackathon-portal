import React from 'react';

function HackathonsList({ hackathons, onSelectHackathon }) {
    return (
        <div>
            <h2>Available Hackathons</h2>
            <div className="hackathons-grid">
                {hackathons.map(hack => (
                    <div key={hack.id} className="hackathon-card" onClick={() => onSelectHackathon(hack)}>
                        <h3>{hack.title}</h3>
                        <p>Status: <span className="status available">{hack.status}</span></p>
                        <p>Participants: {hack.participants}</p>
                        <button className="btn-primary">Join Hackathon</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HackathonsList;
