const BASE = 'http://localhost:5000/api';

const req = async (method, url, body, isForm = false) => {
    const opts = { method, headers: isForm ? {} : { 'Content-Type': 'application/json' } };
    if (body) opts.body = isForm ? body : JSON.stringify(body);
    const res = await fetch(BASE + url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
};

export const api = {
    login: (body) => req('POST', '/login', body),
    signup: (body) => req('POST', '/signup', body),
    getUsers: () => req('GET', '/users'),
    deleteUser: (id) => req('DELETE', `/users/${id}`),

    getHackathons: () => req('GET', '/hackathons'),
    addHackathon: (body) => req('POST', '/hackathons', body),
    updateHackathon: (id, body) => req('PUT', `/hackathons/${id}`, body),
    deleteHackathon: (id) => req('DELETE', `/hackathons/${id}`),

    getTeams: () => req('GET', '/teams'),
    addTeam: (body) => req('POST', '/teams', body),
    renameTeam: (id, name) => req('PUT', `/teams/${id}`, { name }),
    deleteTeam: (id) => req('DELETE', `/teams/${id}`),
    addMember: (id, user_name) => req('POST', `/teams/${id}/members`, { user_name }),
    removeMember: (id, name) => req('DELETE', `/teams/${id}/members/${name}`),

    getProblems: () => req('GET', '/problems'),
    addProblem: (body) => req('POST', '/problems', body),
    updateProblem: (id, body) => req('PUT', `/problems/${id}`, body),
    deleteProblem: (id) => req('DELETE', `/problems/${id}`),

    getSubmissions: () => req('GET', '/submissions'),
    addSubmission: (formData) => req('POST', '/submissions', formData, true),
    evaluateSubmission: (id, body) => req('PUT', `/submissions/${id}/evaluate`, body),
};
