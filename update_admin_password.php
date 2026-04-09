<?php
// Quick fix for admin password
$conn = new PDO("mysql:host=localhost;dbname=ecommerce_db", 'root', '');
$hash = password_hash('password', PASSWORD_DEFAULT);
$conn->prepare("UPDATE users SET password_hash = ? WHERE username = 'admin'")->execute([$hash]);
echo "Admin password updated. Use: admin / password";
?>
