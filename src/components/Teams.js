function Teams() {
    return (
        <div>
            <h2>Team Formation</h2>
            <div style={{ marginBottom: '2rem' }}>
                <button className="btn-primary">Create Team</button>
                <button className="btn-secondary">Join Team</button>
            </div>
            <div className="teams-grid">
                <p>No teams created yet.</p>
            </div>
        </div>
    );
}