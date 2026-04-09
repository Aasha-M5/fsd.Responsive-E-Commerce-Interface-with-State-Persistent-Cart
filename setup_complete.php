<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Complete - ShopHub</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .setup-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            max-width: 600px;
            text-align: center;
        }
        .success-icon {
            font-size: 4rem;
            color: #27ae60;
            margin-bottom: 20px;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .links {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 30px 0;
        }
        .link-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-decoration: none;
            color: #2c3e50;
            transition: all 0.3s;
            border: 2px solid transparent;
        }
        .link-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-color: #3498db;
        }
        .link-card i {
            font-size: 2rem;
            margin-bottom: 10px;
            display: block;
        }
        .user-link i { color: #3498db; }
        .admin-link i { color: #e74c3c; }
        .test-link i { color: #f39c12; }
        .home-link i { color: #27ae60; }
        .credentials {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: left;
        }
        .credentials h3 {
            margin-top: 0;
            color: #2c3e50;
        }
        .credential-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #bdc3c7;
        }
        .credential-item:last-child {
            border-bottom: none;
        }
        .credential-label {
            font-weight: bold;
            color: #555;
        }
        .credential-value {
            font-family: monospace;
            background: white;
            padding: 2px 8px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="setup-container">
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h1>🎉 Setup Complete!</h1>
        <p>Your ShopHub E-Commerce system is ready to use with both Admin and User access.</p>

        <div class="credentials">
            <h3>📝 Login Credentials</h3>
            <div class="credential-item">
                <span class="credential-label">Admin Username:</span>
                <span class="credential-value">admin</span>
            </div>
            <div class="credential-item">
                <span class="credential-label">Admin Password:</span>
                <span class="credential-value">password</span>
            </div>
            <div class="credential-item">
                <span class="credential-label">User Username:</span>
                <span class="credential-value">john_doe</span>
            </div>
            <div class="credential-item">
                <span class="credential-label">User Password:</span>
                <span class="credential-value">password</span>
            </div>
        </div>

        <div class="links">
            <a href="index.html" class="link-card home-link">
                <i class="fas fa-home"></i>
                <strong>Main Store</strong>
                <small>Shop as guest or user</small>
            </a>
            <a href="login.html" class="link-card user-link">
                <i class="fas fa-user"></i>
                <strong>User Login</strong>
                <small>Customer access</small>
            </a>
            <a href="admin/login.html" class="link-card admin-link">
                <i class="fas fa-shield-alt"></i>
                <strong>Admin Login</strong>
                <small>Management panel</small>
            </a>
            <a href="test_db.php" class="link-card test-link">
                <i class="fas fa-database"></i>
                <strong>Test Database</strong>
                <small>Verify setup</small>
            </a>
        </div>

        <p style="color: #7f8c8d; font-size: 0.9rem;">
            <i class="fas fa-info-circle"></i> 
            All prices are displayed in Indian Rupees (₹)
        </p>
    </div>
</body>
</html>
