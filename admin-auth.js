// Admin Authentication System
class AdminAuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        // Admin login form
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }

        // Password toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePassword());
        }
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password'),
            remember_me: document.getElementById('rememberMe').checked,
            role: 'admin'
        };

        if (!this.validateLoginForm(loginData)) {
            return;
        }

        this.setLoading(form, true);

        try {
            console.log('Attempting admin login to:', '../api/auth.php?action=login');
            console.log('Login data:', { ...loginData, password: '[hidden]' });
            
            const response = await fetch('../api/auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Response data:', result);

            if (result.success) {
                // Check if user has admin role
                if (result.user.role !== 'admin') {
                    this.showToast('Access denied. Admin privileges required.', 'error');
                    return;
                }

                this.showToast('Admin login successful! Redirecting...', 'success');
                
                // Store admin session
                if (loginData.remember_me) {
                    localStorage.setItem('admin_session', JSON.stringify(result.user));
                } else {
                    sessionStorage.setItem('admin_session', JSON.stringify(result.user));
                }

                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showToast(result.message || 'Admin login failed', 'error');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            this.showToast(`Network error: ${error.message}. Please check console for details.`, 'error');
        } finally {
            this.setLoading(form, false);
        }
    }

    validateLoginForm(data) {
        let isValid = true;

        // Username validation
        if (!data.username || data.username.length < 3) {
            this.showFieldError('username', 'Username must be at least 3 characters');
            isValid = false;
        } else {
            this.clearFieldError('username');
        }

        // Password validation
        if (!data.password || data.password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            this.clearFieldError('password');
        }

        return isValid;
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message show';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.remove('error');
            
            // Remove error message
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('togglePassword');
        const icon = toggleButton.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    setLoading(form, loading) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            form.classList.add('loading');
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Admin Login';
            form.classList.remove('loading');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    checkExistingSession() {
        // Check if admin is already logged in
        const adminSession = localStorage.getItem('admin_session') || sessionStorage.getItem('admin_session');
        
        if (adminSession) {
            try {
                const admin = JSON.parse(adminSession);
                // If on login page and admin is logged in, redirect to dashboard
                if (window.location.pathname.includes('admin/login.html')) {
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                console.error('Invalid admin session data:', error);
            }
        }
    }

    logout() {
        localStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_session');
        window.location.href = 'login.html';
    }
}

// Initialize admin auth system
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuthSystem = new AdminAuthSystem();
});

// Global admin logout function
function adminLogout() {
    if (window.adminAuthSystem) {
        window.adminAuthSystem.logout();
    }
}
