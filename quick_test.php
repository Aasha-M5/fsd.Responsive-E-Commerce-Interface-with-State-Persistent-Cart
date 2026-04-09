<?php
// Quick test to verify system is working
echo "<h2>🚀 ShopHub E-Commerce System Test</h2>";

// Test 1: Database Connection
echo "<h3>1. Database Connection</h3>";
try {
    $conn = new PDO("mysql:host=localhost;dbname=ecommerce_db", 'root', '');
    echo "<p style='color: green;'>✅ Database connection: SUCCESS</p>";
} catch(PDOException $e) {
    echo "<p style='color: red;'>❌ Database connection: FAILED - " . $e->getMessage() . "</p>";
}

// Test 2: Check Tables
echo "<h3>2. Database Tables</h3>";
$tables = ['users', 'products', 'categories', 'cart'];
foreach ($tables as $table) {
    try {
        $result = $conn->query("SELECT COUNT(*) FROM $table");
        $count = $result->fetchColumn();
        echo "<p style='color: green;'>✅ Table '$table': $count records</p>";
    } catch(PDOException $e) {
        echo "<p style='color: red;'>❌ Table '$table': MISSING</p>";
    }
}

// Test 3: Sample Users
echo "<h3>3. Test Users Available</h3>";
try {
    $stmt = $conn->query("SELECT username, role FROM users");
    echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
    echo "<tr style='background: #f0f0f0;'><th>Username</th><th>Role</th><th>Login URL</th></tr>";
    while ($row = $stmt->fetch()) {
        $url = $row['role'] === 'admin' ? 'admin/login.html' : 'login.html';
        echo "<tr><td>{$row['username']}</td><td>{$row['role']}</td><td><a href='$url'>$url</a></td></tr>";
    }
    echo "</table>";
} catch(PDOException $e) {
    echo "<p style='color: red;'>❌ Error loading users: " . $e->getMessage() . "</p>";
}

// Test 4: File Structure
echo "<h3>4. File Structure Check</h3>";
$files = [
    'index.html' => 'Main Store',
    'login.html' => 'User Login',
    'admin/login.html' => 'Admin Login',
    'api/auth.php' => 'Auth API',
    'api/products.php' => 'Products API',
    'css/styles.css' => 'Main Styles',
    'js/app.js' => 'Main JavaScript'
];

foreach ($files as $file => $description) {
    if (file_exists($file)) {
        echo "<p style='color: green;'>✅ $description: $file</p>";
    } else {
        echo "<p style='color: red;'>❌ $description: $file (MISSING)</p>";
    }
}

echo "<hr>";
echo "<h3>🎯 Next Steps</h3>";
echo "<p><a href='index.html' style='background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🏪 Go to Main Store</a></p>";
echo "<p><a href='login.html' style='background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>👤 Go to User Login</a></p>";
echo "<p><a href='admin/login.html' style='background: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🛡️ Go to Admin Login</a></p>";
echo "<p><a href='setup_complete.php' style='background: #f39c12; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>📋 Setup Complete Page</a></p>";
?>
