import React, { useState } from 'react';
import { api } from '../api';

function Login({ onLogin, onSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await api.login({ email, password });
            onLogin(user);
        } catch (e) { setError(e.message); }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Virtual Hackathon Platform</h1>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p style={{ color: '#ef4444', margin: '0.5rem 0' }}>{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a onClick={onSignup}>Sign up</a></p>
                <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Demo: admin@hack.com / admin</p>
            </div>
        </div>
    );
}

export default Login;
