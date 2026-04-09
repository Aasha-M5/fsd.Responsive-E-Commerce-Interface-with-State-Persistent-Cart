<?php
require_once '../config.php';

try {
    $conn = getConnection();
    
    $stmt = $conn->prepare("SELECT * FROM categories ORDER BY name");
    $stmt->execute();
    $categories = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $categories
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
