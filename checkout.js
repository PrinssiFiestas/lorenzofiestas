// Quantity Selector
const quantityInput = document.getElementById('quantity');
const decreaseBtn = document.getElementById('decrease-qty');
const increaseBtn = document.getElementById('increase-qty');
const subtotalElement = document.getElementById('subtotal');
const shippingCostElement = document.getElementById('shipping-cost');
const totalElement = document.getElementById('total');
const shippingSelect = document.getElementById('shipping');
const checkoutBtn = document.getElementById('checkout-btn');

const basePrice = 200;
let currentQuantity = 1;
let shippingCost = 0;

// Update price display
function updatePrice() {
    const subtotal = basePrice * currentQuantity;
    subtotalElement.textContent = `${subtotal.toFixed(2)} €`;

    // Calculate shipping cost
    switch(shippingSelect.value) {
        case 'express':
            shippingCost = 9.99;
            break;
        case 'overnight':
            shippingCost = 19.99;
            break;
        default:
            shippingCost = 0;
    }

    shippingCostElement.textContent = shippingCost === 0 ? '0.00 €' : `${shippingCost.toFixed(2)} €`;

    const total = subtotal + shippingCost;
    totalElement.textContent = `{total.toFixed(2)} €`;
}

// Quantity buttons
decreaseBtn.addEventListener('click', () => {
    if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
        updatePrice();
    }
});

increaseBtn.addEventListener('click', () => {
    if (currentQuantity < 10) {
        currentQuantity++;
        quantityInput.value = currentQuantity;
        updatePrice();
    }
});

quantityInput.addEventListener('change', () => {
    let value = parseInt(quantityInput.value);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 10) value = 10;
    currentQuantity = value;
    quantityInput.value = currentQuantity;
    updatePrice();
});

// Shipping selection
shippingSelect.addEventListener('change', updatePrice);

// Checkout button
checkoutBtn.addEventListener('click', () => {
    alert('Checkout functionality will be implemented later.\n\nThis is a placeholder for the actual checkout process.');

    // Here you would normally:
    // 1. Collect form data
    // 2. Validate inputs
    // 3. Send to payment processor
    // 4. Handle the response
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize price display
updatePrice();
