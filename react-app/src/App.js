import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Platform from './components/Platform';
import { initialState } from './initialState';

function App() {
    const [view, setView] = useState('login');
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('hackathonState');
        return saved ? JSON.parse(saved) : initialState;
    });

    useEffect(() => {
        localStorage.setItem('hackathonState', JSON.stringify(state));
    }, [state]);

    const handleLogin = (user) => {
        setState({ ...state, currentUser: user });
        setView('platform');
    };

    const addUser = (user) => {
        setState({ ...state, users: [...state.users, user] });
    };

    const handleLogout = () => {
        setState({ ...state, currentUser: null, selectedHackathon: null });
        setView('login');
    };

    return (
        <>
            {view === 'login' && <Login onLogin={handleLogin} onSignup={() => setView('signup')} users={state.users} />}
            {view === 'signup' && <Signup onSignup={() => setView('login')} onLogin={() => setView('login')} addUser={addUser} />}
            {view === 'platform' && <Platform currentUser={state.currentUser} onLogout={handleLogout} state={state} setState={setState} />}
        </>
    );
}

export default App;
