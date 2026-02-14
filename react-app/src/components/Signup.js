import React, { useState } from 'react';

function Signup({ onSignup, onLogin, addUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addUser({ email, password, name, role: 'user' });
        onSignup();
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Join Hackathon</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a onClick={onLogin}>Login</a></p>
            </div>
        </div>
    );
}

export default Signup;
