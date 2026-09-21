function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('auth-error').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('auth-error').style.display = 'none';
}

function showError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg;
    el.style.display = 'block';
}

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    btn.disabled = true;
    btn.textContent = 'Signing in...';
    try {
        const data = await apiRequest('POST', '/auth/login', { email, password });
        setToken(data.access_token);
        window.location.href = '/dashboard.html';
    } catch (err) {
        showError(err.message || 'Login failed');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }
}

async function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const department = document.getElementById('reg-department').value;
    const year = parseInt(document.getElementById('reg-year').value);
    const password = document.getElementById('reg-password').value;
    const btn = document.getElementById('register-btn');
    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }
    btn.disabled = true;
    btn.textContent = 'Creating account...';
    try {
        const data = await apiRequest('POST', '/auth/register', {
            name, email, department, year, password
        });
        setToken(data.access_token);
        window.location.href = '/dashboard.html';
    } catch (err) {
        showError(err.message || 'Registration failed');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

if (isLoggedIn()) {
    window.location.href = '/dashboard.html';
}
