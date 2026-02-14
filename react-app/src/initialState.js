export const initialState = {
    hackathons: [
        { id: 1, title: 'AI Innovation Challenge 2024', status: 'Active', participants: 0 },
        { id: 2, title: 'Web3 Hackathon', status: 'Active', participants: 0 }
    ],
    teams: [],
    problems: [],
    submissions: [],
    users: [{ email: 'admin@hack.com', password: 'admin', role: 'admin', name: 'Admin' }],
    currentUser: null,
    selectedHackathon: null
};
