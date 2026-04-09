// E-Commerce App with State-Persistent Cart
class ECommerceApp {
    constructor() {
        this.products = [];
        this.cart = [];
        this.categories = [];
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadProducts();
        await this.loadCategories();
        await this.loadCart();
        this.updateCartUI();
    }

    setupEventListeners() {
        // Mobile menu toggle
        document.getElementById('mobileMenuToggle').addEventListener('click', () => {
            document.querySelector('.nav').classList.toggle('active');
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('href'));
            });
        });

        // Clear cart button
        document.getElementById('clearCartBtn').addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.handleCheckout();
        });
    }

    handleNavigation(target) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="${target}"]`).classList.add('active');

        // Show/hide sections
        document.getElementById('products').style.display = target === '#products' ? 'block' : 'none';
        document.getElementById('cart').style.display = target === '#cart' ? 'block' : 'none';

        // Close mobile menu
        document.querySelector('.nav').classList.remove('active');
    }

    async loadProducts(categoryId = null) {
        try {
            this.showLoading(true);
            const url = categoryId ? `api/products.php?category=${categoryId}` : 'api/products.php';
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this.products = data.data;
                this.renderProducts();
            } else {
                this.showToast('Failed to load products', 'error');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showToast('Error loading products', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('api/categories.php');
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.data;
                this.renderCategories();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategories() {
        const container = document.getElementById('categoryButtons');
        container.innerHTML = '<button class="category-btn active" data-category="all">All Products</button>';
        
        this.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.setAttribute('data-category', category.id);
            button.textContent = category.name;
            button.addEventListener('click', () => this.filterByCategory(category.id));
            container.appendChild(button);
        });
    }

    filterByCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${categoryId}"]`).classList.add('active');
        
        // Load products for this category
        if (categoryId === 'all') {
            this.loadProducts();
        } else {
            this.loadProducts(categoryId);
        }
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        
        if (this.products.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-box-open"></i>
                    <h3>No products found</h3>
                    <p>Try selecting a different category</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    ${product.image_url ? 
                        `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                        '<i class="fas fa-image fa-3x"></i>'
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || 'No description available'}</p>
                    <span class="product-category">${product.category_name || 'Uncategorized'}</span>
                    <div class="product-price">₹${parseFloat(product.price).toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="app.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    async addToCart(productId) {
        try {
            const response = await fetch('api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: 1
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showToast('Item added to cart!');
                await this.loadCart();
                this.updateCartUI();
            } else {
                this.showToast(data.message || 'Failed to add item to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showToast('Error adding item to cart', 'error');
        }
    }

    async loadCart() {
        try {
            const response = await fetch('api/cart.php');
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.data;
                this.cartTotal = data.total;
                this.cartItemCount = data.item_count;
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }

    updateCartUI() {
        // Update cart count in header
        document.getElementById('cartCount').textContent = this.cartItemCount || 0;
        
        // Update cart items
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        ${item.image_url ? 
                            `<img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            '<i class="fas fa-image fa-2x"></i>'
                        }
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${parseFloat(item.price).toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.product_id}, ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="app.updateCartItemQuantity(${item.product_id}, this.value)">
                            <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.product_id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        // Update cart total
        document.getElementById('cartTotal').textContent = (this.cartTotal || 0).toFixed(2);
    }

    async updateCartItemQuantity(productId, quantity) {
        quantity = parseInt(quantity);
        
        if (quantity <= 0) {
            await this.removeFromCart(productId);
            return;
        }

        try {
            const response = await fetch('api/cart.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadCart();
                this.updateCartUI();
            } else {
                this.showToast(data.message || 'Failed to update cart', 'error');
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            this.showToast('Error updating cart', 'error');
        }
    }

    async removeFromCart(productId) {
        try {
            const response = await fetch('api/cart.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: 0
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadCart();
                this.updateCartUI();
                this.showToast('Item removed from cart');
            } else {
                this.showToast(data.message || 'Failed to remove item', 'error');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showToast('Error removing item', 'error');
        }
    }

    async clearCart() {
        if (!confirm('Are you sure you want to clear your entire cart?')) {
            return;
        }

        try {
            const response = await fetch('api/cart.php', {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = [];
                this.cartTotal = 0;
                this.cartItemCount = 0;
                this.updateCartUI();
                this.showToast('Cart cleared');
            } else {
                this.showToast(data.message || 'Failed to clear cart', 'error');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            this.showToast('Error clearing cart', 'error');
        }
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'error');
            return;
        }

        // Simple checkout simulation
        const total = this.cartTotal.toFixed(2);
        const itemCount = this.cartItemCount;
        
        if (confirm(`Checkout Summary:\n${itemCount} items\nTotal: ₹${total}\n\nProceed to checkout?`)) {
            this.showToast('Processing checkout... (Demo mode)');
            
            // In a real application, this would redirect to a payment processor
            setTimeout(() => {
                this.showToast('Order placed successfully! (Demo)', 'success');
                this.clearCart();
                this.handleNavigation('#products');
            }, 2000);
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const grid = document.getElementById('productsGrid');
        
        if (show) {
            loading.style.display = 'block';
            grid.style.display = 'none';
        } else {
            loading.style.display = 'none';
            grid.style.display = 'grid';
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // LocalStorage synchronization for offline capability
    syncWithLocalStorage() {
        // Save cart to localStorage for offline capability
        localStorage.setItem('ecommerce_cart', JSON.stringify({
            cart: this.cart,
            total: this.cartTotal,
            itemCount: this.cartItemCount,
            timestamp: Date.now()
        }));
    }

    loadFromLocalStorage() {
        // Load cart from localStorage if available and recent (within 1 hour)
        const savedCart = localStorage.getItem('ecommerce_cart');
        if (savedCart) {
            try {
                const data = JSON.parse(savedCart);
                const oneHourAgo = Date.now() - (60 * 60 * 1000);
                
                if (data.timestamp > oneHourAgo) {
                    this.cart = data.cart || [];
                    this.cartTotal = data.total || 0;
                    this.cartItemCount = data.itemCount || 0;
                    this.updateCartUI();
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ECommerceApp();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.section) {
        app.handleNavigation(event.state.section);
    }
});

// Service Worker registration for PWA capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
