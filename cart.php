<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$session_id = getOrCreateSessionId();

try {
    $conn = getConnection();
    
    switch ($method) {
        case 'GET':
            // Get cart items
            $stmt = $conn->prepare("
                SELECT c.*, p.name, p.price, p.image_url 
                FROM cart c 
                JOIN products p ON c.product_id = p.id 
                WHERE c.session_id = :session_id
            ");
            $stmt->execute(['session_id' => $session_id]);
            $cart_items = $stmt->fetchAll();
            
            $total = array_sum(array_map(function($item) {
                return $item['price'] * $item['quantity'];
            }, $cart_items));
            
            echo json_encode([
                'success' => true,
                'data' => $cart_items,
                'total' => $total,
                'item_count' => array_sum(array_column($cart_items, 'quantity'))
            ]);
            break;
            
        case 'POST':
            // Add item to cart
            $data = json_decode(file_get_contents('php://input'), true);
            $product_id = (int)$data['product_id'];
            $quantity = (int)($data['quantity'] ?? 1);
            
            // Check if product exists and has stock
            $product_stmt = $conn->prepare("SELECT stock_quantity FROM products WHERE id = :id");
            $product_stmt->execute(['id' => $product_id]);
            $product = $product_stmt->fetch();
            
            if (!$product) {
                throw new Exception('Product not found');
            }
            
            if ($product['stock_quantity'] < $quantity) {
                throw new Exception('Insufficient stock');
            }
            
            // Check if item already in cart
            $existing_stmt = $conn->prepare("
                SELECT quantity FROM cart 
                WHERE session_id = :session_id AND product_id = :product_id
            ");
            $existing_stmt->execute([
                'session_id' => $session_id,
                'product_id' => $product_id
            ]);
            $existing = $existing_stmt->fetch();
            
            if ($existing) {
                // Update quantity
                $new_quantity = $existing['quantity'] + $quantity;
                if ($new_quantity > $product['stock_quantity']) {
                    throw new Exception('Insufficient stock');
                }
                
                $update_stmt = $conn->prepare("
                    UPDATE cart SET quantity = :quantity, updated_at = CURRENT_TIMESTAMP 
                    WHERE session_id = :session_id AND product_id = :product_id
                ");
                $update_stmt->execute([
                    'quantity' => $new_quantity,
                    'session_id' => $session_id,
                    'product_id' => $product_id
                ]);
            } else {
                // Insert new item
                $insert_stmt = $conn->prepare("
                    INSERT INTO cart (session_id, product_id, quantity) 
                    VALUES (:session_id, :product_id, :quantity)
                ");
                $insert_stmt->execute([
                    'session_id' => $session_id,
                    'product_id' => $product_id,
                    'quantity' => $quantity
                ]);
            }
            
            echo json_encode(['success' => true, 'message' => 'Item added to cart']);
            break;
            
        case 'PUT':
            // Update cart item quantity
            $data = json_decode(file_get_contents('php://input'), true);
            $product_id = (int)$data['product_id'];
            $quantity = (int)$data['quantity'];
            
            if ($quantity <= 0) {
                // Remove item
                $delete_stmt = $conn->prepare("
                    DELETE FROM cart 
                    WHERE session_id = :session_id AND product_id = :product_id
                ");
                $delete_stmt->execute([
                    'session_id' => $session_id,
                    'product_id' => $product_id
                ]);
            } else {
                // Update quantity
                $update_stmt = $conn->prepare("
                    UPDATE cart SET quantity = :quantity, updated_at = CURRENT_TIMESTAMP 
                    WHERE session_id = :session_id AND product_id = :product_id
                ");
                $update_stmt->execute([
                    'quantity' => $quantity,
                    'session_id' => $session_id,
                    'product_id' => $product_id
                ]);
            }
            
            echo json_encode(['success' => true, 'message' => 'Cart updated']);
            break;
            
        case 'DELETE':
            // Clear entire cart
            $delete_stmt = $conn->prepare("DELETE FROM cart WHERE session_id = :session_id");
            $delete_stmt->execute(['session_id' => $session_id]);
            
            echo json_encode(['success' => true, 'message' => 'Cart cleared']);
            break;
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
