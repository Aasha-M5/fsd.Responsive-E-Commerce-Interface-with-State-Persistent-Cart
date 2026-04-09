// Admin Dashboard System
class AdminDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.checkAdminAuth();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    checkAdminAuth() {
        const adminSession = localStorage.getItem('admin_session') || sessionStorage.getItem('admin_session');
        
        if (!adminSession) {
            window.location.href = 'login.html';
            return;
        }

        try {
            const admin = JSON.parse(adminSession);
            if (admin.role !== 'admin') {
                window.location.href = '../login.html';
                return;
            }
            
            // Update admin info in header
            document.getElementById('adminName').textContent = admin.full_name || admin.username;
            document.getElementById('adminUsername').textContent = admin.username;
        } catch (error) {
            console.error('Invalid admin session:', error);
            window.location.href = 'login.html';
        }
    }

    setupEventListeners() {
        // Menu navigation
        document.querySelectorAll('.admin-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('href'));
            });
        });
    }

    handleNavigation(section) {
        // Update active menu item
        document.querySelectorAll('.admin-menu a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="${section}"]`).classList.add('active');

        // Load section content
        this.loadSection(section);
    }

    async loadDashboardData() {
        try {
            // Load statistics
            await this.loadStatistics();
            // Load recent activity
            await this.loadRecentActivity();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showToast('Error loading dashboard data', 'error');
        }
    }

    async loadStatistics() {
        try {
            const response = await fetch('../api/admin.php?action=stats');
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('totalProducts').textContent = result.data.totalProducts || 0;
                document.getElementById('totalUsers').textContent = result.data.totalUsers || 0;
                document.getElementById('totalOrders').textContent = result.data.totalOrders || 0;
                document.getElementById('totalRevenue').textContent = `₹${(result.data.totalRevenue || 0).toFixed(2)}`;
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    async loadRecentActivity() {
        try {
            const response = await fetch('../api/admin.php?action=recent_activity');
            const result = await response.json();
            
            const activityContainer = document.getElementById('recentActivity');
            
            if (result.success && result.data.length > 0) {
                activityContainer.innerHTML = result.data.map(activity => `
                    <div style="padding: 15px; border-bottom: 1px solid #ecf0f1; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${activity.type}</strong>
                            <p style="margin: 5px 0; color: #7f8c8d;">${activity.description}</p>
                            <small style="color: #95a5a6;">${activity.date}</small>
                        </div>
                        <span style="background: ${activity.color}; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">
                            ${activity.status}
                        </span>
                    </div>
                `).join('');
            } else {
                activityContainer.innerHTML = '<p>No recent activity found.</p>';
            }
        } catch (error) {
            console.error('Error loading recent activity:', error);
            document.getElementById('recentActivity').innerHTML = '<p>Error loading activity.</p>';
        }
    }

    loadSection(section) {
        const contentArea = document.querySelector('.admin-content');
        
        switch (section) {
            case '#dashboard':
                window.location.reload();
                break;
            case '#products':
                this.loadProductsSection();
                break;
            case '#users':
                this.loadUsersSection();
                break;
            case '#orders':
                this.loadOrdersSection();
                break;
            case '#categories':
                this.loadCategoriesSection();
                break;
            case '#settings':
                this.loadSettingsSection();
                break;
        }
    }

    loadProductsSection() {
        const contentArea = document.querySelector('.admin-content');
        contentArea.innerHTML = `
            <div class="admin-header">
                <h1>Products Management</h1>
                <button class="btn btn-primary" onclick="this.addProduct()">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </div>
            <div class="admin-section">
                <h2>Products List</h2>
                <div id="productsList">
                    <p>Loading products...</p>
                </div>
            </div>
        `;
        this.loadProducts();
    }

    loadUsersSection() {
        const contentArea = document.querySelector('.admin-content');
        contentArea.innerHTML = `
            <div class="admin-header">
                <h1>Users Management</h1>
            </div>
            <div class="admin-section">
                <h2>Users List</h2>
                <div id="usersList">
                    <p>Loading users...</p>
                </div>
            </div>
        `;
        this.loadUsers();
    }

    loadOrdersSection() {
        const contentArea = document.querySelector('.admin-content');
        contentArea.innerHTML = `
            <div class="admin-header">
                <h1>Orders Management</h1>
            </div>
            <div class="admin-section">
                <h2>Orders List</h2>
                <div id="ordersList">
                    <p>Loading orders...</p>
                </div>
            </div>
        `;
        this.loadOrders();
    }

    loadCategoriesSection() {
        const contentArea = document.querySelector('.admin-content');
        contentArea.innerHTML = `
            <div class="admin-header">
                <h1>Categories Management</h1>
                <button class="btn btn-primary" onclick="this.addCategory()">
                    <i class="fas fa-plus"></i> Add Category
                </button>
            </div>
            <div class="admin-section">
                <h2>Categories List</h2>
                <div id="categoriesList">
                    <p>Loading categories...</p>
                </div>
            </div>
        `;
        this.loadCategories();
    }

    loadSettingsSection() {
        const contentArea = document.querySelector('.admin-content');
        contentArea.innerHTML = `
            <div class="admin-header">
                <h1>Settings</h1>
            </div>
            <div class="admin-section">
                <h2>System Settings</h2>
                <form id="settingsForm">
                    <div class="form-group">
                        <label>Store Name</label>
                        <input type="text" id="storeName" value="ShopHub">
                    </div>
                    <div class="form-group">
                        <label>Store Email</label>
                        <input type="email" id="storeEmail" value="admin@shophub.com">
                    </div>
                    <div class="form-group">
                        <label>Currency</label>
                        <select id="currency">
                            <option value="INR" selected>Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Settings</button>
                </form>
            </div>
        `;
    }

    async loadProducts() {
        // Implementation for loading products
        try {
            const response = await fetch('../api/products.php');
            const result = await response.json();
            
            const container = document.getElementById('productsList');
            if (result.success) {
                container.innerHTML = `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 10px; text-align: left;">ID</th>
                                <th style="padding: 10px; text-align: left;">Name</th>
                                <th style="padding: 10px; text-align: left;">Price</th>
                                <th style="padding: 10px; text-align: left;">Stock</th>
                                <th style="padding: 10px; text-align: left;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.data.map(product => `
                                <tr style="border-bottom: 1px solid #ecf0f1;">
                                    <td style="padding: 10px;">${product.id}</td>
                                    <td style="padding: 10px;">${product.name}</td>
                                    <td style="padding: 10px;">₹${parseFloat(product.price).toFixed(2)}</td>
                                    <td style="padding: 10px;">${product.stock_quantity}</td>
                                    <td style="padding: 10px;">
                                        <button class="btn btn-sm" style="margin-right: 5px;">Edit</button>
                                        <button class="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    async loadUsers() {
        // Implementation for loading users
        try {
            const response = await fetch('../api/admin.php?action=users');
            const result = await response.json();
            
            const container = document.getElementById('usersList');
            if (result.success) {
                container.innerHTML = `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 10px; text-align: left;">ID</th>
                                <th style="padding: 10px; text-align: left;">Username</th>
                                <th style="padding: 10px; text-align: left;">Email</th>
                                <th style="padding: 10px; text-align: left;">Role</th>
                                <th style="padding: 10px; text-align: left;">Joined</th>
                                <th style="padding: 10px; text-align: left;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.data.map(user => `
                                <tr style="border-bottom: 1px solid #ecf0f1;">
                                    <td style="padding: 10px;">${user.id}</td>
                                    <td style="padding: 10px;">${user.username}</td>
                                    <td style="padding: 10px;">${user.email}</td>
                                    <td style="padding: 10px;">
                                        <span style="background: ${user.role === 'admin' ? '#e74c3c' : '#27ae60'}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 0.8rem;">
                                            ${user.role}
                                        </span>
                                    </td>
                                    <td style="padding: 10px;">${user.created_at}</td>
                                    <td style="padding: 10px;">
                                        <button class="btn btn-sm" style="margin-right: 5px;">Edit</button>
                                        ${user.role !== 'admin' ? '<button class="btn btn-danger btn-sm">Delete</button>' : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch (error) {
            console.error('Error loading users:', error);
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
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});
