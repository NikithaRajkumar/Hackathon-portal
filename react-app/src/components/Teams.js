import React, { useState } from 'react';

function Teams({ teams, addTeam, renameTeam, deleteTeam, addMember, removeMember, currentUser, selectedHackathon }) {
    const [teamName, setTeamName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [showAddMember, setShowAddMember] = useState(null);
    const [renamingId, setRenamingId] = useState(null);
    const [renameVal, setRenameVal] = useState('');
    const [error, setError] = useState('');

    const filteredTeams = selectedHackathon ? teams.filter(t => t.hackathon_id === selectedHackathon.id) : teams;

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try { await addTeam(teamName); setTeamName(''); setShowForm(false); }
        catch (e) { setError(e.message); }
    };

    const handleAddMember = async (e, teamId) => {
        e.preventDefault();
        setError('');
        try { await addMember(teamId, memberEmail); setMemberEmail(''); setShowAddMember(null); }
        catch (e) { setError(e.message); }
    };

    const handleRemove = async (teamId, name) => {
        if (window.confirm(`Remove ${name} from the team?`)) {
            await removeMember(teamId, name);
        }
    };

    const handleDelete = async (team) => {
        if (window.confirm(`Delete team "${team.name}"?`)) await deleteTeam(team.id);
    };

    const handleRename = async (e, id) => {
        e.preventDefault();
        await renameTeam(id, renameVal);
        setRenamingId(null);
    };

    return (
        <div>
            <h2>Team Formation</h2>
            {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
            <div style={{ marginBottom: '2rem' }}>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>Create Team</button>
            </div>

            {showForm && (
                <div className="submission-form" style={{ marginBottom: '2rem' }}>
                    <h3>Create New Team</h3>
                    <form onSubmit={handleCreate}>
                        <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                        <button type="submit" className="btn-primary">Create Team</button>
                    </form>
                </div>
            )}

            <div className="teams-grid">
                {filteredTeams.length === 0 ? <p>No teams yet.</p> : filteredTeams.map((team) => {
                    const isCreator = team.created_by === currentUser.name;
                    const isMember = team.members.includes(currentUser.name);

                    return (
                        <div key={team.id} className="team-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                {renamingId === team.id ? (
                                    <form onSubmit={(e) => handleRename(e, team.id)} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                        <input value={renameVal} onChange={(e) => setRenameVal(e.target.value)} required style={{ padding: '0.5rem', borderRadius: '8px', border: '2px solid #e2e8f0', flex: 1 }} />
                                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Save</button>
                                        <button type="button" onClick={() => setRenamingId(null)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                                    </form>
                                ) : (
                                    <h3 style={{ margin: 0 }}>{team.name}</h3>
                                )}
                                {isCreator && renamingId !== team.id && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => { setRenamingId(team.id); setRenameVal(team.name); }} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Rename</button>
                                        <button onClick={() => handleDelete(team)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                    </div>
                                )}
                            </div>

                            <p><strong>Members: {team.members.length}/{team.max_members}</strong></p>
                            <div style={{ marginBottom: '1rem' }}>
                                {team.members.map((member, i) => (
                                    <div key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', background: '#e0e7ff', borderRadius: '20px', margin: '0.25rem', fontSize: '0.9rem' }}>
                                        <span>{member}</span>
                                        {isCreator && member !== currentUser.name && (
                                            <button onClick={() => handleRemove(team.id, member)} style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>×</button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <span className={`status ${team.members.length < team.max_members ? 'available' : 'full'}`}>
                                {team.members.length < team.max_members ? 'Open' : 'Full'}
                            </span>

                            {isMember && team.members.length < team.max_members && (
                                <>
                                    <button className="btn-secondary" onClick={() => setShowAddMember(showAddMember === team.id ? null : team.id)}>Add Member</button>
                                    {showAddMember === team.id && (
                                        <form onSubmit={(e) => handleAddMember(e, team.id)} style={{ marginTop: '1rem' }}>
                                            <input type="email" placeholder="Member Email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', width: '100%', marginBottom: '0.5rem' }} />
                                            <button type="submit" className="btn-primary">Add</button>
                                        </form>
                                    )}
                                </>
                            )}

                            {!isMember && team.members.length < team.max_members && (
                                <button className="btn-secondary" onClick={() => addMember(team.id, currentUser.email).then(() => {}).catch(e => setError(e.message))}>Join Team</button>
                            )}

                            {isMember && !isCreator && (
                                <button onClick={() => handleRemove(team.id, currentUser.name)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '0.5rem' }}>Leave Team</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Teams;
