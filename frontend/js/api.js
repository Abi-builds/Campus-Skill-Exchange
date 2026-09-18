const API_BASE = '/api';

async function apiRequest(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {
        const res = await fetch(`${API_BASE}${path}`, options);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.detail || 'Request failed');
        }
        return data;
    } catch (err) {
        throw err;
    }
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function clearToken() {
    localStorage.removeItem('token');
}
