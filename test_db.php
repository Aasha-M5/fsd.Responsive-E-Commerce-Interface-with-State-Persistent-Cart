<?php
// Test database connection and tables
echo "<h3>Database Connection Test</h3>";

try {
    $conn = new PDO("mysql:host=localhost;dbname=ecommerce_db", 'root', '');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color: green;'>✓ Database connection successful</p>";
    
    // Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Users table exists</p>";
        
        // Check table structure
        $stmt = $conn->query("DESCRIBE users");
        echo "<h4>Users table structure:</h4>";
        echo "<table border='1'><tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th></tr>";
        while ($row = $stmt->fetch()) {
            echo "<tr><td>{$row['Field']}</td><td>{$row['Type']}</td><td>{$row['Null']}</td><td>{$row['Key']}</td></tr>";
        }
        echo "</table>";
        
        // Check if any users exist
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
        $count = $stmt->fetch()['count'];
        echo "<p>Number of users in database: $count</p>";
        
        if ($count > 0) {
            $stmt = $conn->query("SELECT id, username, email, created_at FROM users");
            echo "<h4>Existing users:</h4>";
            echo "<table border='1'><tr><th>ID</th><th>Username</th><th>Email</th><th>Created</th></tr>";
            while ($row = $stmt->fetch()) {
                echo "<tr><td>{$row['id']}</td><td>{$row['username']}</td><td>{$row['email']}</td><td>{$row['created_at']}</td></tr>";
            }
            echo "</table>";
        }
    } else {
        echo "<p style='color: red;'>✗ Users table does not exist</p>";
        
        // Create users table
        $sql = "CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            last_login TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $conn->exec($sql);
        echo "<p style='color: green;'>✓ Users table created</p>";
    }
    
} catch(PDOException $e) {
    echo "<p style='color: red;'>✗ Database connection failed: " . $e->getMessage() . "</p>";
    
    // Try to create database
    try {
        $conn = new PDO("mysql:host=localhost", 'root', '');
        $conn->exec("CREATE DATABASE IF NOT EXISTS ecommerce_db");
        echo "<p style='color: orange;'>⚠ Database created. Please run the database.sql file to create tables.</p>";
    } catch(PDOException $e2) {
        echo "<p style='color: red;'>✗ Could not create database: " . $e2->getMessage() . "</p>";
    }
}

echo "<hr><h3>PHP Info</h3>";
echo "<p>PHP Version: " . PHP_VERSION . "</p>";
echo "<p>PDO MySQL Support: " . (extension_loaded('pdo_mysql') ? 'Yes' : 'No') . "</p>";
echo "<p>Session Support: " . (session_status() !== PHP_SESSION_DISABLED ? 'Yes' : 'No') . "</p>";
?>
