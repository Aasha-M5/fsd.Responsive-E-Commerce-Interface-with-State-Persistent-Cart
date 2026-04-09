<?php
require_once '../config.php';

try {
    $conn = getConnection();
    
    // Get products with optional category filter
    $category_id = isset($_GET['category']) ? (int)$_GET['category'] : null;
    
    $query = "
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
    ";
    
    if ($category_id) {
        $query .= " WHERE p.category_id = :category_id";
    }
    
    $query .= " ORDER BY p.created_at DESC";
    
    $stmt = $conn->prepare($query);
    
    if ($category_id) {
        $stmt->bindParam(':category_id', $category_id);
    }
    
    $stmt->execute();
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $products
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
