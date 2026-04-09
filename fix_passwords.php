<?php
// Fix password hashes for demo accounts
echo "<h2>🔧 Fix Password Hashes</h2>";

try {
    $conn = new PDO("mysql:host=localhost;dbname=ecommerce_db", 'root', '');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Generate correct password hash for "password"
    $password = 'password';
    $correct_hash = password_hash($password, PASSWORD_DEFAULT);
    
    echo "<h3>Generated Hash for 'password':</h3>";
    echo "<p style='font-family: monospace; background: #f0f0f0; padding: 10px;'>$correct_hash</p>";
    
    // Update admin password
    $stmt = $conn->prepare("UPDATE users SET password_hash = :hash WHERE username = 'admin'");
    $stmt->execute(['hash' => $correct_hash]);
    echo "<p style='color: green;'>✅ Admin password updated</p>";
    
    // Update user passwords
    $stmt = $conn->prepare("UPDATE users SET password_hash = :hash WHERE username IN ('john_doe', 'jane_smith')");
    $stmt->execute(['hash' => $correct_hash]);
    echo "<p style='color: green;'>✅ User passwords updated</p>";
    
    // Verify the updates
    echo "<h3>Verification:</h3>";
    $stmt = $conn->query("SELECT username, password_hash FROM users");
    while ($row = $stmt->fetch()) {
        $verify = password_verify('password', $row['password_hash']);
        $status = $verify ? '✅ VALID' : '❌ INVALID';
        echo "<p>{$row['username']}: $status</p>";
    }
    
    echo "<hr>";
    echo "<h3>🎯 Test Login Credentials:</h3>";
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr style='background: #f0f0f0;'><th>Username</th><th>Password</th><th>Role</th><th>Login URL</th></tr>";
    echo "<tr><td>admin</td><td>password</td><td>admin</td><td><a href='admin/login.html'>Admin Login</a></td></tr>";
    echo "<tr><td>john_doe</td><td>password</td><td>user</td><td><a href='login.html'>User Login</a></td></tr>";
    echo "<tr><td>jane_smith</td><td>password</td><td>user</td><td><a href='login.html'>User Login</a></td></tr>";
    echo "</table>";
    
} catch(PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
