import React from 'react';

function HackathonsList({ hackathons, onSelectHackathon }) {
    return (
        <div>
            <h2>Available Hackathons</h2>
            <div className="hackathons-grid">
                {hackathons.map(hack => (
                    <div key={hack.id} className="hackathon-card" onClick={() => onSelectHackathon(hack)}>
                        <h3>{hack.title}</h3>
                        {hack.description && <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{hack.description}</p>}
                        <p>Status: <span className="status available">{hack.status}</span></p>
                        {hack.rules?.prize && <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>🏆 Prize: {hack.rules.prize}</p>}
                        {hack.rules?.eligibility && <p style={{ fontSize: '0.85rem', color: '#64748b' }}>👥 {hack.rules.eligibility}</p>}
                        {hack.rules?.tags?.length > 0 && (
                            <div style={{ marginBottom: '0.5rem' }}>
                                {hack.rules.tags.map((tag, i) => (
                                    <span key={i} style={{ display: 'inline-block', background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', marginRight: '0.3rem' }}>{tag}</span>
                                ))}
                            </div>
                        )}
                        {hack.start_date && <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Start: {new Date(hack.start_date).toLocaleDateString()}</p>}
                        {hack.end_date && <p style={{ fontSize: '0.85rem', color: '#64748b' }}>End: {new Date(hack.end_date).toLocaleDateString()}</p>}
                        <button className="btn-primary">Enter Hackathon</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HackathonsList;
