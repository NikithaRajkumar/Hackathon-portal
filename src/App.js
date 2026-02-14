function App() {
    const { useState } = React;
    const [view, setView] = useState('login');

    return (
        <>
            {view === 'login' && <Login onLogin={() => setView('platform')} onSignup={() => setView('signup')} />}
            {view === 'signup' && <Signup onSignup={() => setView('platform')} onLogin={() => setView('login')} />}
            {view === 'platform' && <Platform />}
        </>
    );
}