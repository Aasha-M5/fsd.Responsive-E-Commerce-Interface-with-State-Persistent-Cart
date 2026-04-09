CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(255),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Cart table for persistent cart storage
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_cart_item (session_id, product_id)
);

-- Users table (optional for user accounts)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'user') DEFAULT 'user',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users (including admin)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@shophub.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin'),
('john_doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'user'),
('jane_smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', 'user');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Latest electronic gadgets and devices'),
('Clothing', 'Fashion and apparel for all ages'),
('Books', 'Books across various genres'),
('Home & Garden', 'Items for home improvement and gardening');

-- Insert sample products (prices in INR)
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) VALUES
('Laptop Pro 15"', 'High-performance laptop with 16GB RAM and 512GB SSD', 79999.00, 1, 'images/laptop.jpg', 50),
('Wireless Headphones', 'Noise-cancelling Bluetooth headphones', 15999.00, 1, 'images/headphones.jpg', 100),
('Cotton T-Shirt', 'Comfortable 100% cotton t-shirt', 1599.00, 2, 'images/tshirt.jpg', 200),
('Jeans', 'Classic denim jeans', 3999.00, 2, 'images/jeans.jpg', 150),
('JavaScript Guide', 'Complete guide to modern JavaScript', 2399.00, 3, 'images/jsbook.jpg', 75),
('Garden Tools Set', 'Complete set of essential garden tools', 3199.00, 4, 'images/tools.jpg', 80);
