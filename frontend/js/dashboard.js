async function initDashboard() {
    if (!isLoggedIn()) {
        window.location.href = '/';
        return;
    }
    try {
        const user = await apiRequest('GET', '/auth/me');
        document.getElementById('welcome-text').textContent = `Welcome back, ${user.name}`;
        document.getElementById('welcome-sub').textContent = 'Find someone who can teach you what you want to learn.';
        loadKPIs(user.id);
        loadRecommendedMatches();
        loadUpcomingSessions();
        loadRecentActivity();
        loadNotifications();
    } catch (err) {
        clearToken();
        window.location.href = '/';
    }
}

async function loadKPIs(userId) {
    try {
        const [mySkills, matches, requests, sessions] = await Promise.all([
            apiRequest('GET', '/skills/me'),
            apiRequest('GET', '/matches'),
            apiRequest('GET', '/exchange-requests'),
            apiRequest('GET', '/sessions'),
        ]);
        const teachCount = mySkills.filter(s => s.skill_type === 'TEACH').length;
        const learnCount = mySkills.filter(s => s.skill_type === 'LEARN').length;
        const pendingCount = requests.filter(r => r.status === 'PENDING').length;
        const upcomingCount = sessions.filter(s => s.status === 'SCHEDULED').length;
        const completedCount = sessions.filter(s => s.status === 'COMPLETED').length;
        const grid = document.getElementById('kpi-grid');
        grid.innerHTML = `
            <div class="kpi-card">
                <div class="kpi-icon blue"><i data-lucide="book-open"></i></div>
                <div class="kpi-label">Skills I Teach</div>
                <div class="kpi-value">${teachCount}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon green"><i data-lucide="target"></i></div>
                <div class="kpi-label">Skills I Want to Learn</div>
                <div class="kpi-value">${learnCount}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon purple"><i data-lucide="users"></i></div>
                <div class="kpi-label">Potential Matches</div>
                <div class="kpi-value">${matches.length}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon orange"><i data-lucide="send"></i></div>
                <div class="kpi-label">Pending Requests</div>
                <div class="kpi-value">${pendingCount}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon blue"><i data-lucide="calendar"></i></div>
                <div class="kpi-label">Upcoming Sessions</div>
                <div class="kpi-value">${upcomingCount}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon green"><i data-lucide="check-circle"></i></div>
                <div class="kpi-label">Completed Exchanges</div>
                <div class="kpi-value">${completedCount}</div>
            </div>
        `;
        lucide.createIcons();
    } catch (err) {
        console.error('Failed to load KPIs:', err);
    }
}

async function loadRecommendedMatches() {
    try {
        const matches = await apiRequest('GET', '/matches');
        const container = document.getElementById('recommended-matches');
        if (matches.length === 0) {
            container.innerHTML = '<div class="loading">No matches found. Add skills to your profile first.</div>';
            return;
        }
        container.innerHTML = matches.slice(0, 5).map(m => `
            <div class="match-card">
                <div class="match-avatar">${m.user.name.charAt(0)}</div>
                <div class="match-info">
                    <h4>${m.user.name}</h4>
                    <p>${m.user.department} - Year ${m.user.year} | ${m.reasons[0] || 'Good match'}</p>
                </div>
                <div class="match-score">${m.score}%</div>
                <div class="match-action">
                    <button class="btn btn-primary" onclick="sendRequest(${m.user.id})" ${m.has_pending_request ? 'disabled' : ''}>
                        ${m.has_pending_request ? 'Pending' : 'Connect'}
                    </button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (err) {
        document.getElementById('recommended-matches').innerHTML = '<div class="loading">Failed to load matches</div>';
    }
}

async function loadUpcomingSessions() {
    try {
        const sessions = await apiRequest('GET', '/sessions');
        const container = document.getElementById('upcoming-sessions');
        const upcoming = sessions.filter(s => s.status === 'SCHEDULED').slice(0, 3);
        if (upcoming.length === 0) {
            container.innerHTML = '<div class="loading">No upcoming sessions</div>';
            return;
        }
        container.innerHTML = upcoming.map(s => `
            <div class="session-card">
                <div class="session-icon"><i data-lucide="calendar"></i></div>
                <div class="session-info">
                    <h4>Session #${s.id}</h4>
                    <p>${new Date(s.scheduled_at).toLocaleDateString()} | ${s.duration_minutes} min</p>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (err) {
        document.getElementById('upcoming-sessions').innerHTML = '<div class="loading">Failed to load sessions</div>';
    }
}

async function loadRecentActivity() {
    try {
        const [requests, sessions] = await Promise.all([
            apiRequest('GET', '/exchange-requests'),
            apiRequest('GET', '/sessions'),
        ]);
        const container = document.getElementById('recent-activity');
        const activities = [];
        requests.slice(0, 3).forEach(r => {
            activities.push({
                icon: r.status === 'ACCEPTED' ? 'check-circle' : r.status === 'REJECTED' ? 'x-circle' : 'send',
                text: `Request ${r.status.toLowerCase()}`,
                time: r.created_at,
            });
        });
        sessions.slice(0, 2).forEach(s => {
            activities.push({
                icon: s.status === 'COMPLETED' ? 'check-circle' : 'calendar',
                text: `Session ${s.status.toLowerCase()}`,
                time: s.created_at,
            });
        });
        if (activities.length === 0) {
            container.innerHTML = '<div class="loading">No recent activity</div>';
            return;
        }
        container.innerHTML = activities.slice(0, 5).map(a => `
            <div class="activity-item">
                <i data-lucide="${a.icon}"></i>
                <span>${a.text}</span>
                <span class="time">${new Date(a.time).toLocaleDateString()}</span>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (err) {
        document.getElementById('recent-activity').innerHTML = '<div class="loading">Failed to load activity</div>';
    }
}

async function sendRequest(receiverId) {
    try {
        await apiRequest('POST', '/exchange-requests', { receiver_id: receiverId, message: 'Let us exchange skills!' });
        loadRecommendedMatches();
    } catch (err) {
        alert(err.message);
    }
}

async function loadNotifications() {
    try {
        const data = await apiRequest('GET', '/notifications/unread-count');
        const badge = document.getElementById('notif-badge');
        if (data.count > 0) {
            badge.textContent = data.count;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    } catch (err) {}
}

function handleLogout() {
    clearToken();
    window.location.href = '/';
}

initDashboard();
