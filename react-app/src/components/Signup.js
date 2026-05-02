import React, { useState } from 'react';
import { api } from '../api';

function Signup({ onSignup, onLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) return setError('Password must be at least 6 characters');
        try {
            await api.signup({ name, email, password });
            alert('Account created! Please login.');
            onSignup();
        } catch (e) { setError(e.message); }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Join Hackathon</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p style={{ color: '#ef4444', margin: '0.5rem 0' }}>{error}</p>}
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a onClick={onLogin}>Login</a></p>
            </div>
        </div>
    );
}

export default Signup;
