import React, { useState } from 'react';
import HackathonsList from './HackathonsList';
import Dashboard from './Dashboard';
import Teams from './Teams';
import Problems from './Problems';
import Submissions from './Submissions';
import Results from './Results';
import AdminPanel from './AdminPanel';

function Platform({ currentUser, onLogout, state, setState }) {
    const [activeTab, setActiveTab] = useState('hackathons');

    const addTeam = (team) => setState({ ...state, teams: [...state.teams, { ...team, id: Date.now() }] });
    const joinTeam = (idx, member) => {
        const newTeams = [...state.teams];
        if (newTeams[idx].members.length < newTeams[idx].maxMembers) {
            newTeams[idx].members.push(member);
            setState({ ...state, teams: newTeams });
        }
    };
    const addMemberToTeam = (idx, member) => {
        const newTeams = [...state.teams];
        if (newTeams[idx].members.length < newTeams[idx].maxMembers && !newTeams[idx].members.includes(member)) {
            newTeams[idx].members.push(member);
            setState({ ...state, teams: newTeams });
        }
    };
    const removeMemberFromTeam = (idx, member) => {
        const newTeams = [...state.teams];
        newTeams[idx].members = newTeams[idx].members.filter(m => m !== member);
        if (newTeams[idx].members.length === 0) {
            newTeams.splice(idx, 1);
        }
        setState({ ...state, teams: newTeams });
    };
    const deleteTeam = (idx) => {
        const newTeams = state.teams.filter((_, i) => i !== idx);
        setState({ ...state, teams: newTeams });
    };
    const evaluateSubmission = (idx, score) => {
        const newSubmissions = [...state.submissions];
        newSubmissions[idx].score = score;
        setState({ ...state, submissions: newSubmissions });
        alert('Submission evaluated successfully!');
    };
    const addSubmission = (sub) => setState({ ...state, submissions: [...state.submissions, { ...sub, id: Date.now() }] });
    const addHackathon = (hack) => setState({ ...state, hackathons: [...state.hackathons, { ...hack, id: Date.now() }] });
    const addProblem = (prob) => setState({ ...state, problems: [...state.problems, { ...prob, id: Date.now() }] });
    const deleteUser = (idx) => {
        const newUsers = state.users.filter((_, i) => i !== idx);
        setState({ ...state, users: newUsers });
    };

    const selectHackathon = (hack) => {
        setState({ ...state, selectedHackathon: hack });
        setActiveTab('dashboard');
    };

    return (
        <>
            <header>
                <h1>Virtual Hackathon Platform</h1>
                <nav>
                    <a onClick={() => setActiveTab('hackathons')}>Hackathons</a>
                    {state.selectedHackathon && <a onClick={() => setActiveTab('dashboard')}>Dashboard</a>}
                    {state.selectedHackathon && <a onClick={() => setActiveTab('teams')}>Teams</a>}
                    {state.selectedHackathon && <a onClick={() => setActiveTab('problems')}>Problems</a>}
                    {state.selectedHackathon && <a onClick={() => setActiveTab('submissions')}>Submissions</a>}
                    {state.selectedHackathon && <a onClick={() => setActiveTab('results')}>Results</a>}
                    {currentUser.role === 'admin' && <a onClick={() => setActiveTab('admin')}>Admin</a>}
                    <a onClick={onLogout} style={{marginLeft: 'auto'}}>Logout</a>
                </nav>
            </header>
            <main>
                {activeTab === 'hackathons' && <HackathonsList hackathons={state.hackathons} onSelectHackathon={selectHackathon} />}
                {activeTab === 'dashboard' && <Dashboard hackathons={state.hackathons} teams={state.teams} problems={state.problems} submissions={state.submissions} selectedHackathon={state.selectedHackathon} />}
                {activeTab === 'teams' && <Teams teams={state.teams} addTeam={addTeam} joinTeam={joinTeam} addMemberToTeam={addMemberToTeam} removeMemberFromTeam={removeMemberFromTeam} deleteTeam={deleteTeam} currentUser={currentUser} selectedHackathon={state.selectedHackathon} users={state.users} />}
                {activeTab === 'problems' && <Problems problems={state.problems} selectedHackathon={state.selectedHackathon} />}
                {activeTab === 'submissions' && <Submissions submissions={state.submissions} addSubmission={addSubmission} selectedHackathon={state.selectedHackathon} currentUser={currentUser} />}
                {activeTab === 'results' && <Results submissions={state.submissions} selectedHackathon={state.selectedHackathon} />}
                {activeTab === 'admin' && currentUser.role === 'admin' && <AdminPanel hackathons={state.hackathons} problems={state.problems} users={state.users} submissions={state.submissions} addHackathon={addHackathon} addProblem={addProblem} deleteUser={deleteUser} evaluateSubmission={evaluateSubmission} />}
            </main>
        </>
    );
}

export default Platform;
