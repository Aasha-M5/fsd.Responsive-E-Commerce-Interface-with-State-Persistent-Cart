<?php
// Test authentication API endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Test response
echo json_encode([
    'success' => true,
    'message' => 'Auth API is working',
    'method' => $_SERVER['REQUEST_METHOD'],
    'action' => $_GET['action'] ?? 'none',
    'post_data' => file_get_contents('php://input'),
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
