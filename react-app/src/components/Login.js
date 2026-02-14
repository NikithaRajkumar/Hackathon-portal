import React, { useState } from 'react';

function Login({ onLogin, onSignup, users }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Virtual Hackathon Platform</h1>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a onClick={onSignup}>Sign up</a></p>
                <p style={{fontSize: '0.8rem', marginTop: '1rem'}}>Demo: admin@hack.com / admin</p>
            </div>
        </div>
    );
}

export default Login;
