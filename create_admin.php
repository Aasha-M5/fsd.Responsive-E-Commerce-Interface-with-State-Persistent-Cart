<?php
// Create fresh admin account
$conn = new PDO("mysql:host=localhost;dbname=ecommerce_db", 'root', '');
$hash = password_hash('admin123', PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)");
$stmt->execute(['admin', 'admin@shophub.com', $hash, 'Administrator', 'admin']);
echo "New admin created. Use: admin / admin123";
?>
