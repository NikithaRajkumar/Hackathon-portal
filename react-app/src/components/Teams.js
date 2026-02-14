import React, { useState } from 'react';

function Teams({ teams, addTeam, joinTeam, addMemberToTeam, removeMemberFromTeam, deleteTeam, currentUser, selectedHackathon, users }) {
    const [teamName, setTeamName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [showAddMember, setShowAddMember] = useState(null);
    const [memberEmail, setMemberEmail] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        addTeam({ name: teamName, members: [currentUser.name], hackathonId: selectedHackathon?.id, maxMembers: 4, createdBy: currentUser.name });
        setTeamName('');
        setShowForm(false);
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (selectedTeam !== '') {
            const filteredTeams = selectedHackathon ? teams.filter(t => t.hackathonId === selectedHackathon.id) : teams;
            const teamIndex = teams.indexOf(filteredTeams[parseInt(selectedTeam)]);
            joinTeam(teamIndex, currentUser.name);
            setSelectedTeam('');
            setShowJoinForm(false);
        }
    };

    const handleAddMember = (e, teamIdx) => {
        e.preventDefault();
        const user = users.find(u => u.email === memberEmail);
        if (user) {
            if (teams[teamIdx].members.includes(user.name)) {
                alert('User is already in the team');
            } else {
                addMemberToTeam(teamIdx, user.name);
                setMemberEmail('');
                setShowAddMember(null);
                alert('Member added successfully!');
            }
        } else {
            alert('User not found. Please check the email address.');
        }
    };

    const handleRemoveMember = (teamIdx, memberName) => {
        if (window.confirm(`Remove ${memberName} from the team?`)) {
            removeMemberFromTeam(teamIdx, memberName);
        }
    };

    const handleDeleteTeam = (teamIdx, team) => {
        if (window.confirm(`Delete team "${team.name}"? This action cannot be undone.`)) {
            deleteTeam(teamIdx);
        }
    };

    const filteredTeams = selectedHackathon ? teams.filter(t => t.hackathonId === selectedHackathon.id) : teams;
    const availableTeams = filteredTeams.filter(team => 
        team.members.length < team.maxMembers && 
        !team.members.includes(currentUser.name)
    );

    return (
        <div>
            <h2>Team Formation</h2>
            <div style={{ marginBottom: '2rem' }}>
                <button className="btn-primary" onClick={() => { setShowForm(!showForm); setShowJoinForm(false); }}>Create Team</button>
                <button className="btn-secondary" onClick={() => { setShowJoinForm(!showJoinForm); setShowForm(false); }}>Join Existing Team</button>
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

            {showJoinForm && (
                <div className="submission-form" style={{ marginBottom: '2rem' }}>
                    <h3>Join Existing Team</h3>
                    {availableTeams.length === 0 ? (
                        <p style={{ color: '#64748b' }}>
                            {filteredTeams.length === 0 
                                ? 'No teams created yet. Create a new team to get started.' 
                                : filteredTeams.every(t => t.members.includes(currentUser.name))
                                ? 'You are already a member of all available teams.'
                                : 'All teams are currently full. Create a new team or wait for a spot to open.'}
                        </p>
                    ) : (
                        <form onSubmit={handleJoin}>
                            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} required>
                                <option value="">Select a team</option>
                                {availableTeams.map((team, idx) => {
                                    const actualIdx = filteredTeams.indexOf(team);
                                    return (
                                        <option key={idx} value={actualIdx}>{team.name} ({team.members.length}/{team.maxMembers} members)</option>
                                    );
                                })}
                            </select>
                            <button type="submit" className="btn-primary">Join Team</button>
                        </form>
                    )}
                </div>
            )}

            <div className="teams-grid">
                {filteredTeams.length === 0 ? (
                    <p>No teams created yet.</p>
                ) : (
                    filteredTeams.map((team, idx) => {
                        const actualIdx = teams.indexOf(team);
                        const isCreator = team.createdBy === currentUser.name;
                        const isMember = team.members.includes(currentUser.name);
                        
                        return (
                            <div key={idx} className="team-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>{team.name}</h3>
                                    {isCreator && (
                                        <button 
                                            onClick={() => handleDeleteTeam(actualIdx, team)} 
                                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                                        >
                                            Delete Team
                                        </button>
                                    )}
                                </div>
                                <p><strong>Members: {team.members.length}/{team.maxMembers}</strong></p>
                                <div style={{ marginBottom: '1rem' }}>
                                    {team.members.map((member, i) => (
                                        <div key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', background: '#e0e7ff', borderRadius: '20px', margin: '0.25rem', fontSize: '0.9rem' }}>
                                            <span>{member}</span>
                                            {isCreator && member !== currentUser.name && (
                                                <button 
                                                    onClick={() => handleRemoveMember(actualIdx, member)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                                                    title="Remove member"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <span className={`status ${team.members.length < team.maxMembers ? 'available' : 'full'}`}>
                                    {team.members.length < team.maxMembers ? 'Open' : 'Full'}
                                </span>
                                
                                {isMember && team.members.length < team.maxMembers && (
                                    <>
                                        <button className="btn-secondary" onClick={() => setShowAddMember(showAddMember === actualIdx ? null : actualIdx)}>Add Member</button>
                                        {showAddMember === actualIdx && (
                                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                                                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Enter the email of a registered user</p>
                                                <form onSubmit={(e) => handleAddMember(e, actualIdx)}>
                                                    <input 
                                                        type="email" 
                                                        placeholder="Member Email" 
                                                        value={memberEmail} 
                                                        onChange={(e) => setMemberEmail(e.target.value)} 
                                                        required 
                                                        style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', width: '100%', marginBottom: '0.5rem' }}
                                                    />
                                                    <button type="submit" className="btn-primary">Add Member</button>
                                                </form>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {team.members.length < team.maxMembers && !isMember && (
                                    <button className="btn-secondary" onClick={() => joinTeam(actualIdx, currentUser.name)}>Join Team</button>
                                )}
                                
                                {isMember && !isCreator && (
                                    <button 
                                        onClick={() => handleRemoveMember(actualIdx, currentUser.name)} 
                                        style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '0.5rem' }}
                                    >
                                        Leave Team
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Teams;
