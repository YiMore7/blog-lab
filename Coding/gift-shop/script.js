// Shopping cart functionality
let cart = [];

// Add to cart functionality
document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.card');
        const productTitle = card.querySelector('.product-title').textContent;
        const productPrice = card.querySelector('.product-price').textContent;
        
        // Add visual feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<span>✓ Added!</span>';
        this.style.backgroundColor = '#48bb78';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.backgroundColor = '';
        }, 2000);
        
        // Add product to cart
        const product = {
            id: Date.now(),
            title: productTitle,
            price: productPrice,
            timestamp: new Date().toISOString()
        };
        
        cart.push(product);
        console.log('Added to cart:', product);
        console.log('Current cart:', cart);
    });
});

// Button hover effects
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-1px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Primary button click effect
document.querySelectorAll('.primary-button').forEach(button => {
    button.addEventListener('click', function() {
        // Visual feedback for primary button
        const originalBg = this.style.backgroundColor;
        this.style.backgroundColor = '#48bb78';
        
        setTimeout(() => {
            this.style.backgroundColor = originalBg || '';
        }, 300);
    });
});

// Secondary button click effect
document.querySelectorAll('.secondary-button').forEach(button => {
    button.addEventListener('click', function() {
        // Visual feedback for secondary button
        this.style.borderColor = '#48bb78';
        this.style.color = '#48bb78';
        
        setTimeout(() => {
            this.style.borderColor = '';
            this.style.color = '';
        }, 300);
    });
});