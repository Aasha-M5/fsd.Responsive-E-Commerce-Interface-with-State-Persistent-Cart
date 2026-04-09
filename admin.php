<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check admin authentication
session_start();
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$action = $_GET['action'] ?? '';

try {
    $conn = getConnection();
    
    switch ($action) {
        case 'stats':
            getDashboardStats($conn);
            break;
        case 'users':
            getUsers($conn);
            break;
        case 'products':
            getProducts($conn);
            break;
        case 'orders':
            getOrders($conn);
            break;
        case 'recent_activity':
            getRecentActivity($conn);
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

function getDashboardStats($conn) {
    try {
        // Get total products
        $stmt = $conn->query("SELECT COUNT(*) as count FROM products");
        $totalProducts = $stmt->fetch()['count'];
        
        // Get total users
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
        $totalUsers = $stmt->fetch()['count'];
        
        // Get total orders (simulated - in real app this would be from orders table)
        $totalOrders = 0;
        
        // Get total revenue (simulated)
        $totalRevenue = 0;
        
        echo json_encode([
            'success' => true,
            'data' => [
                'totalProducts' => $totalProducts,
                'totalUsers' => $totalUsers,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue
            ]
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function getUsers($conn) {
    try {
        $stmt = $conn->query("
            SELECT id, username, email, full_name, created_at,
                   CASE WHEN id = 1 THEN 'admin' ELSE 'user' END as role
            FROM users 
            ORDER BY created_at DESC
        ");
        $users = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $users
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function getProducts($conn) {
    try {
        $stmt = $conn->query("
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.created_at DESC
        ");
        $products = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $products
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function getOrders($conn) {
    // Simulated orders data
    $orders = [
        [
            'id' => 1,
            'user' => 'john_doe',
            'total' => 3999.00,
            'status' => 'completed',
            'date' => '2024-03-25'
        ],
        [
            'id' => 2,
            'user' => 'jane_smith',
            'total' => 1599.00,
            'status' => 'pending',
            'date' => '2024-03-25'
        ]
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $orders
    ]);
}

function getRecentActivity($conn) {
    // Simulated activity data
    $activities = [
        [
            'type' => 'New User',
            'description' => 'john_doe created an account',
            'date' => '2024-03-25 10:30 AM',
            'status' => 'User',
            'color' => '#27ae60'
        ],
        [
            'type' => 'New Order',
            'description' => 'Order #1234 placed by jane_smith',
            'date' => '2024-03-25 09:45 AM',
            'status' => 'Order',
            'color' => '#3498db'
        ],
        [
            'type' => 'Product Added',
            'description' => 'Laptop Pro 15" added to inventory',
            'date' => '2024-03-25 09:00 AM',
            'status' => 'Product',
            'color' => '#f39c12'
        ],
        [
            'type' => 'User Login',
            'description' => 'admin logged into admin panel',
            'date' => '2024-03-25 08:30 AM',
            'status' => 'Admin',
            'color' => '#e74c3c'
        ]
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $activities
    ]);
}
?>
