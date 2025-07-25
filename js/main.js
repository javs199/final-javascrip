
document.addEventListener('DOMContentLoaded', function () {
    const servicesContainer = document.getElementById('services-container');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');

    let cart = [];

    // Cargar servicios desde el JSON
    fetch('data/services.json')
        .then(response => response.json())
        .then(services => {
            renderServices(services);
        });

    // Renderizar servicios en el HTML
    function renderServices(services) {
        servicesContainer.innerHTML = '';
        services.forEach(service => {
            const serviceCard = `
                <article class="service-card">
                    <div id="${service.id}Carousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${service.images.map((image, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${image}" class="d-block w-100" alt="${service.name}">
                                </div>
                            `).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#${service.id}Carousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#${service.id}Carousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div class="service-content">
                        <div class="service-header">
                            <h3>${service.name}</h3>
                            <img src="${service.icon}" alt="${service.name} icon" />
                        </div>
                        <div class="service-description">
                            <p>${service.description}</p>
                        </div>
                        <div class="service-footer">
                            <span class="price">$${service.price}</span>
                            <button class="btn btn-primary add-to-cart" data-service-id="${service.id}" data-service-name="${service.name}" data-service-price="${service.price}">Add to Cart</button>
                        </div>
                    </div>
                </article>
            `;
            servicesContainer.innerHTML += serviceCard;
        });
    }

    // Event listener para agregar al carrito
    servicesContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            const serviceId = e.target.dataset.serviceId;
            const serviceName = e.target.dataset.serviceName;
            const servicePrice = parseFloat(e.target.dataset.servicePrice);

            addToCart({ id: serviceId, name: serviceName, price: servicePrice });
        }
    });

    // Función para agregar al carrito
    function addToCart(service) {
        const existingItem = cart.find(item => item.id === service.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...service, quantity: 1 });
        }
        updateCart();
        Swal.fire({
            title: 'Added to cart!',
            text: `${service.name} has been added to your cart.`,
            icon: 'success',
            confirmButtonText: 'Cool'
        })
    }

    // Función para actualizar el carrito
    function updateCart() {
        if(cartItemsContainer){
            cartItemsContainer.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                const cartItem = `
                    <div class="cart-item">
                        <div class="item-details">
                            <h5>${item.name}</h5>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="btn btn-danger remove-item" data-service-id="${item.id}">Remove</button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItem;
                total += item.price * item.quantity;
            });
    
            if(cartTotal){
                cartTotal.textContent = `Total: $${total.toFixed(2)}`;
            }
    
            if(cartCount){
                cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
            }
        }
    }

    // Event listener para remover del carrito
    if(cartItemsContainer){
        cartItemsContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-item')) {
                const serviceId = e.target.dataset.serviceId;
                removeFromCart(serviceId);
            }
        });
    }


    // Función para remover del carrito
    function removeFromCart(serviceId) {
        cart = cart.filter(item => item.id !== serviceId);
        updateCart();
    }

    // Event listener para el checkout
    if(checkoutBtn){
        checkoutBtn.addEventListener('click', function () {
            if (cart.length > 0) {
                Swal.fire({
                    title: 'Checkout',
                    text: 'Are you sure you want to proceed to checkout?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, proceed!',
                    cancelButtonText: 'No, cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        cart = [];
                        updateCart();
                        Swal.fire(
                            'Success!',
                            'Your order has been placed.',
                            'success'
                        )
                    }
                })
            } else {
                Swal.fire({
                    title: 'Empty Cart',
                    text: 'Your cart is empty. Please add items before checking out.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                })
            }
        });
    }
});
