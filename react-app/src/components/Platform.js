import React, { useState } from 'react';
import HackathonsList from './HackathonsList';
import Teams from './Teams';
import Problems from './Problems';
import Submissions from './Submissions';
import Results from './Results';
import AdminPanel from './AdminPanel';
import { api } from '../api';

function Platform({ currentUser, onLogout, state, setState, reload }) {
    const [activeTab, setActiveTab] = useState('hackathons');

    const refresh = async () => { await reload(); };

    const selectHackathon = (hack) => {
        setState(s => ({ ...s, selectedHackathon: hack }));
        setActiveTab('teams');
    };

    // Teams
    const addTeam = async (name) => {
        await api.addTeam({ name, hackathon_id: state.selectedHackathon.id, created_by: currentUser.name });
        await refresh();
    };
    const renameTeam = async (id, name) => { await api.renameTeam(id, name); await refresh(); };
    const deleteTeam = async (id) => { await api.deleteTeam(id); await refresh(); };
    const addMember = async (teamId, email) => {
        const user = state.users.find(u => u.email === email);
        if (!user) throw new Error('User not found');
        await api.addMember(teamId, user.name);
        await refresh();
    };
    const removeMember = async (teamId, name) => { await api.removeMember(teamId, name); await refresh(); };

    // Submissions
    const addSubmission = async (formData) => { await api.addSubmission(formData); await refresh(); };

    // Admin
    const addHackathon = async (body) => { await api.addHackathon(body); await refresh(); };
    const updateHackathon = async (id, body) => { await api.updateHackathon(id, body); await refresh(); };
    const deleteHackathon = async (id) => { await api.deleteHackathon(id); await refresh(); };
    const addProblem = async (body) => { await api.addProblem(body); await refresh(); };
    const updateProblem = async (id, body) => { await api.updateProblem(id, body); await refresh(); };
    const deleteProblem = async (id) => { await api.deleteProblem(id); await refresh(); };
    const deleteUser = async (id) => { await api.deleteUser(id); await refresh(); };
    const evaluateSubmission = async (id, score, user_email, title, feedback) => {
        await api.evaluateSubmission(id, { score, feedback, user_email, title });
        await refresh();
    };

    return (
        <>
            <header>
                <h1>Virtual Hackathon Platform</h1>
                <nav>
                    <a onClick={() => setActiveTab('hackathons')}>Hackathons</a>
                    {state.selectedHackathon && <a onClick={() => setActiveTab('teams')}>Teams</a>}
                    {state.selectedHackathon && <a onClick={() => setActiveTab('problems')}>Problems</a>}
                    {state.selectedHackathon && <a onClick={() => setActiveTab('submissions')}>Submissions</a>}
                    {state.selectedHackathon && <a onClick={() => setActiveTab('results')}>Results</a>}
                    {currentUser.role === 'admin' && <a onClick={() => setActiveTab('admin')}>Admin</a>}
                    <a onClick={onLogout} style={{ marginLeft: 'auto' }}>Logout</a>
                </nav>
            </header>
            <main>
                {activeTab === 'hackathons' && <HackathonsList hackathons={state.hackathons} onSelectHackathon={selectHackathon} />}
                {activeTab === 'teams' && <Teams teams={state.teams} addTeam={addTeam} renameTeam={renameTeam} deleteTeam={deleteTeam} addMember={addMember} removeMember={removeMember} currentUser={currentUser} selectedHackathon={state.selectedHackathon} />}
                {activeTab === 'problems' && <Problems problems={state.problems} selectedHackathon={state.selectedHackathon} />}
                {activeTab === 'submissions' && <Submissions submissions={state.submissions} addSubmission={addSubmission} selectedHackathon={state.selectedHackathon} currentUser={currentUser} />}
                {activeTab === 'results' && <Results submissions={state.submissions} selectedHackathon={state.selectedHackathon} />}
                {activeTab === 'admin' && currentUser.role === 'admin' && (
                    <AdminPanel
                        hackathons={state.hackathons} problems={state.problems} users={state.users} submissions={state.submissions}
                        addHackathon={addHackathon} updateHackathon={updateHackathon} deleteHackathon={deleteHackathon}
                        addProblem={addProblem} updateProblem={updateProblem} deleteProblem={deleteProblem}
                        deleteUser={deleteUser} evaluateSubmission={evaluateSubmission}
                    />
                )}
            </main>
        </>
    );
}

export default Platform;
