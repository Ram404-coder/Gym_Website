// auth.js - Role-based authentication for AuraAthletic (Backend Connected)

const API_BASE = 'http://localhost:5000/api';

// User roles
const ROLES = {
    MEMBER: 'member',
    TRAINER: 'trainer',
    ADMIN: 'admin'
};


// BACKEND AUTHENTICATION


// Register new user (sends to backend MongoDB)
async function registerUser(name, email, password, role, trainerDetails = {}) {
    try {
        const requestBody = {
            name,
            email,
            password,
            role,
            ...trainerDetails
        };

        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.error || 'Registration failed' };
        }

        return { success: true, message: 'Registration successful', user: data.user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Network error. Make sure server is running.' };
    }
}

// Login user (checks backend MongoDB)
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.error || 'Login failed' };
        }

        // Store user session in localStorage
        localStorage.setItem('auraUser', JSON.stringify(data.user));

        return { success: true, message: 'Login successful', role: data.user.role, user: data.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Make sure server is running.' };
    }
}

// Logout user
function logoutUser() {
    localStorage.removeItem('auraUser');
    // Redirect to home page
    window.location.href = '/index.html';
}

// Get current logged-in user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('auraUser');
    return user ? JSON.parse(user) : null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === ROLES.ADMIN;
}

// Check if user is trainer
function isTrainer() {
    const user = getCurrentUser();
    return user && user.role === ROLES.TRAINER;
}

// Check if user is member
function isMember() {
    const user = getCurrentUser();
    return user && user.role === ROLES.MEMBER;
}

// Redirect based on role
function redirectBasedOnRole() {
    const user = getCurrentUser();
    const currentPath = window.location.pathname;

    if (!user) {
        // Not logged in, allow access to public pages only
        if (currentPath.includes('admin.html')) {
            window.location.href = '/login.html';
        }
        if (currentPath.includes('trainer-dashboard.html')) {
            window.location.href = '/login.html';
        }
        return;
    }

    // Admin can access everything
    if (user.role === ROLES.ADMIN) {
        return;
    }

    // Trainer can access trainer dashboard but not admin panel
    if (user.role === ROLES.TRAINER) {
        if (currentPath.includes('admin.html') && !currentPath.includes('schedule.html')) {
            alert('Access denied. Admin only area.');
            window.location.href = '/trainer-dashboard.html';
        }
        return;
    }

    // Member cannot access admin panel or trainer dashboard
    if (user.role === ROLES.MEMBER) {
        if (currentPath.includes('admin.html') || currentPath.includes('trainer-dashboard.html')) {
            alert('Access denied. Members only area.');
            window.location.href = '/index.html';
        }
    }
}

// ========================================
// NAVBAR AUTHENTICATION UI
// ========================================

// Update navbar based on login status
function updateNavbarAuth() {
    const user = getCurrentUser();

    // Find or create nav-actions container
    let actionsDiv = document.querySelector('.nav-actions');
    const navContainer = document.querySelector('.nav-container');

    if (!actionsDiv && navContainer) {
        actionsDiv = document.createElement('div');
        actionsDiv.className = 'nav-actions';
        navContainer.appendChild(actionsDiv);
    }

    if (!actionsDiv) return;

    if (user) {
        // User is logged in - show user name and logout button
        let dashboardLink = '';
        if (user.role === ROLES.TRAINER) {
            dashboardLink = `<a href="/trainer-dashboard.html" style="color: var(--gold); margin-right: 1rem; text-decoration: none;">📊 Dashboard</a>`;
        } else if (user.role === ROLES.ADMIN) {
            dashboardLink = `<a href="/admin.html" style="color: var(--gold); margin-right: 1rem; text-decoration: none;">⚙️ Admin</a>`;
        }

        actionsDiv.innerHTML = `
            ${dashboardLink}
            <span style="color: var(--gold); margin-right: 1rem;">👋 ${user.name}</span>
            <button onclick="logoutUser()" class="btn-logout" style="background: rgba(233,69,96,0.15); color: var(--crimson); border: 1px solid rgba(233,69,96,0.3); padding: 0.5rem 1.2rem; border-radius: 50px; cursor: pointer; transition: all 0.3s ease;">Logout</button>
        `;
    } else {
        // User is logged out - show login button
        actionsDiv.innerHTML = `
            <a href="/login.html" class="btn-member" style="background: transparent; color: white; border: 2px solid rgba(255,255,255,0.3); padding: 0.5rem 1.2rem; border-radius: 50px; text-decoration: none; transition: all 0.3s ease;">Login</a>
        `;
    }
    // Add to your existing auth.js, inside updateNavbarAuth function

    function updateNavbarAuth() {
        const user = getCurrentUser();
        let actionsDiv = document.querySelector('.nav-actions');
        const navLinks = document.querySelector('.nav-links');

        if (!actionsDiv && document.querySelector('.nav-container')) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'nav-actions';
            document.querySelector('.nav-container').appendChild(actionsDiv);
        }

        if (!actionsDiv) return;

        // Check if Join Now button already exists
        let joinBtn = document.querySelector('.btn-join');

        if (user) {
            // Remove Join Now button if exists
            if (joinBtn) joinBtn.remove();

            // Show user menu
            let dashboardLink = '';
            if (user.role === 'trainer') {
                dashboardLink = `<a href="/trainer-dashboard.html" style="color: var(--gold); margin-right: 1rem; text-decoration: none;">📊 Dashboard</a>`;
            } else if (user.role === 'admin') {
                dashboardLink = `<a href="/admin.html" style="color: var(--gold); margin-right: 1rem; text-decoration: none;">⚙️ Admin</a>`;
            }

            actionsDiv.innerHTML = `
            ${dashboardLink}
            <div class="user-greeting">
                <span class="user-name">👋 ${user.name}</span>
                <button onclick="logoutUser()" class="btn-logout">Logout</button>
            </div>
        `;
        } else {
            // Show login and join buttons
            actionsDiv.innerHTML = `
            <a href="/login.html" class="btn-login">Login</a>
        `;

            // Add Join Now button next to nav links
            if (navLinks && !joinBtn) {
                const joinLi = document.createElement('li');
                joinLi.innerHTML = '<a href="/schedule.html" class="btn-join">Join Now →</a>';
                navLinks.appendChild(joinLi);
            }
        }
    }
}

// Call this on every page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarAuth();
    redirectBasedOnRole();
});