function Platform() {
    const { useState } = React;
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <>
            <header>
                <h1>Virtual Hackathon Platform</h1>
                <nav>
                    <a onClick={() => setActiveTab('dashboard')}>Dashboard</a>
                    <a onClick={() => setActiveTab('teams')}>Teams</a>
                    <a onClick={() => setActiveTab('problems')}>Problems</a>
                    <a onClick={() => setActiveTab('submissions')}>Submissions</a>
                </nav>
            </header>
            <main>
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'teams' && <Teams />}
                {activeTab === 'problems' && <Problems />}
                {activeTab === 'submissions' && <Submissions />}
            </main>
        </>
    );
}