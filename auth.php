<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$action = $_GET['action'] ?? '';

try {
    $conn = getConnection();
    
    switch ($action) {
        case 'login':
            handleLogin($conn);
            break;
        case 'register':
            handleRegister($conn);
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function handleLogin($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? 'user';
    
    // Validation
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        return;
    }
    
    // Check user credentials
    $stmt = $conn->prepare("
        SELECT id, username, email, password_hash, full_name, role
        FROM users 
        WHERE username = :username OR email = :username
    ");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        return;
    }
    
    // Check role requirements
    if ($role === 'admin' && $user['role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        return;
    }
    
    // Start session
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['logged_in'] = true;
    
    // Update last login
    $updateStmt = $conn->prepare("
        UPDATE users SET last_login = CURRENT_TIMESTAMP 
        WHERE id = :id
    ");
    $updateStmt->execute(['id' => $user['id']]);
    
    // Return user data (without password)
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ]);
}

function handleRegister($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $fullname = trim($data['fullname'] ?? '');
    $username = trim($data['username'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $confirm_password = $data['confirm_password'] ?? '';
    
    // Validation
    if (empty($fullname) || empty($username) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }
    
    if (strlen($username) < 3) {
        echo json_encode(['success' => false, 'message' => 'Username must be at least 3 characters']);
        return;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        return;
    }
    
    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        return;
    }
    
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        echo json_encode(['success' => false, 'message' => 'Username can only contain letters, numbers, and underscores']);
        return;
    }
    
    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
        return;
    }
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        return;
    }
    
    // Hash password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user (default role is 'user')
    $stmt = $conn->prepare("
        INSERT INTO users (username, email, password_hash, full_name, role) 
        VALUES (:username, :email, :password_hash, :fullname, 'user')
    ");
    
    $result = $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password_hash' => $password_hash,
        'fullname' => $fullname
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed'
        ]);
    }
}

function handleLogout() {
    session_start();
    session_destroy();
    
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
}
?>
