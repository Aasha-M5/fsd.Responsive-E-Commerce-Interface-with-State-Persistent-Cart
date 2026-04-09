// Authentication System
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Password toggle buttons
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => this.togglePassword(e));
        });

        // Password strength indicator
        const passwordInput = document.getElementById('password');
        if (passwordInput && document.getElementById('registerForm')) {
            passwordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Form validation
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password'),
            remember_me: document.getElementById('rememberMe').checked
        };

        if (!this.validateLoginForm(loginData)) {
            return;
        }

        this.setLoading(form, true);

        try {
            console.log('Attempting login to:', 'api/auth.php?action=login');
            console.log('Login data:', { ...loginData, password: '[hidden]' });
            
            const response = await fetch('api/auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Response data:', result);

            if (result.success) {
                this.showToast('Login successful! Redirecting...', 'success');
                
                // Store user session
                if (loginData.remember_me) {
                    localStorage.setItem('user_session', JSON.stringify(result.user));
                } else {
                    sessionStorage.setItem('user_session', JSON.stringify(result.user));
                }

                // Redirect to main page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showToast(result.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast(`Network error: ${error.message}. Please check console for details.`, 'error');
        } finally {
            this.setLoading(form, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const registerData = {
            fullname: formData.get('fullname'),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirmPassword')
        };

        if (!this.validateRegisterForm(registerData)) {
            return;
        }

        this.setLoading(form, true);

        try {
            const response = await fetch('api/auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Registration successful! Please login.', 'success');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showToast(result.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showToast('Network error. Please try again.', 'error');
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

    validateRegisterForm(data) {
        let isValid = true;

        // Full name validation
        if (!data.fullname || data.fullname.length < 2) {
            this.showFieldError('fullname', 'Full name is required');
            isValid = false;
        } else {
            this.clearFieldError('fullname');
        }

        // Username validation
        if (!data.username || data.username.length < 3) {
            this.showFieldError('username', 'Username must be at least 3 characters');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
            this.showFieldError('username', 'Username can only contain letters, numbers, and underscores');
            isValid = false;
        } else {
            this.clearFieldError('username');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError('email');
        }

        // Password validation
        if (!data.password || data.password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            this.clearFieldError('password');
        }

        // Password confirmation
        if (data.password !== data.confirm_password) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        } else {
            this.clearFieldError('confirmPassword');
        }

        // Terms agreement
        if (!document.getElementById('agreeTerms').checked) {
            this.showToast('You must agree to the terms and conditions', 'error');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();

        switch (fieldName) {
            case 'username':
                if (value.length > 0 && value.length < 3) {
                    this.showFieldError(fieldName, 'Username must be at least 3 characters');
                } else {
                    this.clearFieldError(fieldName);
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value.length > 0 && !emailRegex.test(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid email address');
                } else {
                    this.clearFieldError(fieldName);
                }
                break;
            case 'password':
                if (value.length > 0 && value.length < 6) {
                    this.showFieldError(fieldName, 'Password must be at least 6 characters');
                } else {
                    this.clearFieldError(fieldName);
                }
                break;
        }
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

    togglePassword(e) {
        const button = e.currentTarget;
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.password-strength-bar');
        const strengthText = document.querySelector('.password-strength-text');
        
        if (!strengthBar || !strengthText) {
            return;
        }

        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        // Update strength indicator
        strengthBar.className = 'password-strength-bar';
        
        if (password.length === 0) {
            strengthBar.style.width = '0%';
            strengthText.textContent = '';
        } else if (strength <= 2) {
            strengthBar.classList.add('strength-weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#e74c3c';
        } else if (strength <= 4) {
            strengthBar.classList.add('strength-medium');
            strengthText.textContent = 'Medium password';
            strengthText.style.color = '#f39c12';
        } else {
            strengthBar.classList.add('strength-strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#27ae60';
        }
    }

    setLoading(form, loading) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            form.classList.add('loading');
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 
                                   submitButton.innerHTML.replace(/<i class="fas fa-spinner fa-spin"><\/i> Processing.../, 'Sign In');
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
        // Check if user is already logged in
        const userSession = localStorage.getItem('user_session') || sessionStorage.getItem('user_session');
        
        if (userSession) {
            try {
                const user = JSON.parse(userSession);
                // If on login/register page and user is logged in, redirect to main page
                if (window.location.pathname.includes('login.html') || 
                    window.location.pathname.includes('register.html')) {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Invalid session data:', error);
            }
        }
    }

    logout() {
        localStorage.removeItem('user_session');
        sessionStorage.removeItem('user_session');
        window.location.href = 'login.html';
    }
}

// Initialize auth system
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// Global logout function
function logout() {
    if (window.authSystem) {
        window.authSystem.logout();
    }
}
