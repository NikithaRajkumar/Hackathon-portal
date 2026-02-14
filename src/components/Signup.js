function Signup({ onSignup, onLogin }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSignup();
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Join Hackathon</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <input type="password" placeholder="Confirm Password" required />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a onClick={onLogin}>Login</a></p>
            </div>
        </div>
    );
}