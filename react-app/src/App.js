import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Platform from './components/Platform';
import { api } from './api';

function App() {
    const [view, setView] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [state, setState] = useState({ hackathons: [], teams: [], problems: [], submissions: [], users: [], selectedHackathon: null });
    const [loading, setLoading] = useState(false);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [hackathons, teams, problems, submissions, users] = await Promise.all([
                api.getHackathons(), api.getTeams(), api.getProblems(), api.getSubmissions(), api.getUsers()
            ]);
            setState(s => ({ ...s, hackathons, teams, problems, submissions, users }));
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleLogin = async (user) => {
        setCurrentUser(user);
        await loadAll();
        setView('platform');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setState(s => ({ ...s, selectedHackathon: null }));
        setView('login');
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#1e3a8a' }}>Loading...</div>;

    return (
        <>
            {view === 'login' && <Login onLogin={handleLogin} onSignup={() => setView('signup')} />}
            {view === 'signup' && <Signup onSignup={() => setView('login')} onLogin={() => setView('login')} />}
            {view === 'platform' && <Platform currentUser={currentUser} onLogout={handleLogout} state={state} setState={setState} reload={loadAll} />}
        </>
    );
}

export default App;
