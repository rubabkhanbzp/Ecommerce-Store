function addToCart(productId, productName, productPrice, imageUrl) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            productId, 
            img: imageUrl,
            name: productName, 
            price: productPrice, 
            quantity: 1 
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart');
    displayCart(); 
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-list');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    cartList.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';

        
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <h2>${item.name}</h2>
                        <p>Price: &#8360; ${item.price}</p>
                        <label for="quantity-${item.productId}">Quantity:
                            <input type="number" id="quantity-${item.productId}" value="${item.quantity}" min="0" onchange="updateQuantity('${item.productId}', this.value)">
                        </label>
                        <p>Total: &#8360; ${item.price * item.quantity}</p>
                        <button onclick="removeFromCart('${item.productId}')">Remove</button>
                    </div>
                </div>
                
            `;
            cartList.appendChild(listItem);
        });
    }
}

function updateQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
        if (quantity == 0) {
    
            cart.splice(itemIndex, 1);
        } else {
            
            cart[itemIndex].quantity = parseInt(quantity);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart(); 
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.productId !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); 
}


function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if(cart.length === 0){
        alert('Cart is empty');
    }else {
        fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cart })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Order created successfully') {
                alert(data.message);
                localStorage.removeItem('cart');
                window.location.href = '/orderConfirmation?orderId=' + data.orderId;
            } else {
                alert('Checkout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout.');
        });
    }
}

