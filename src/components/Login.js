function Login({ onLogin, onSignup }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Virtual Hackathon Platform</h1>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a onClick={onSignup}>Sign up</a></p>
            </div>
        </div>
    );
}