document.addEventListener('DOMContentLoaded', function () {
    const servicesContainer = document.getElementById('services-container');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const favoriteCount = document.querySelector('.favorite-count');
    const favoritesModal = document.getElementById('favoritesModal');
    const favoriteItemsContainer = document.querySelector('.favorite-items');
    const noFavoritesMessage = document.querySelector('.no-favorites-message');
    const serviceSearchInput = document.getElementById('service-search-input');
    const locationFilterSelect = document.getElementById('location-filter-select');
    const priceSortSelect = document.getElementById('price-sort-select');

    let cart = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Dark Mode Logic
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        if (darkModeSwitch) {
            darkModeSwitch.checked = true;
        }
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        if (darkModeSwitch) {
            darkModeSwitch.checked = false;
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Event listener for dark mode switch
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', function () {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }

    // Cargar servicios desde el JSON
    let allServices = []; // Declare allServices here
    fetch('data/services.json')
        .then(response => response.json())
        .then(services => {
            allServices = services; // Assign fetched services to allServices
            renderServices(allServices);
        });

    // Renderizar servicios en el HTML
    function renderServices(services) {
        servicesContainer.innerHTML = '';
        services.forEach(service => {
            const isFavorited = favorites.some(fav => fav.id === service.id);
            const favoriteIconClass = isFavorited ? 'bi-heart-fill' : 'bi-heart';
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
                            <button class="btn btn-outline-danger favorite-btn" data-service-id="${service.id}">
                                <i class="bi ${favoriteIconClass}"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
            servicesContainer.innerHTML += serviceCard;
        });
        
    }

    // Event listener para agregar al carrito y favoritos
    servicesContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            const serviceId = e.target.dataset.serviceId;
            const serviceName = e.target.dataset.serviceName;
            const servicePrice = parseFloat(e.target.dataset.servicePrice);

            addToCart({ id: serviceId, name: serviceName, price: servicePrice });
        } else if (e.target.closest('.favorite-btn')) {
            const serviceId = e.target.closest('.favorite-btn').dataset.serviceId;
            toggleFavorite(serviceId);
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
                            <div class="quantity-control">
                                <button class="btn btn-sm btn-secondary decrease-quantity" data-service-id="${item.id}">-</button>
                                <input type="number" class="item-quantity" value="${item.quantity}" min="1" data-service-id="${item.id}">
                                <button class="btn btn-sm btn-secondary increase-quantity" data-service-id="${item.id}">+</button>
                            </div>
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

    // Event listener para remover del carrito y cambiar cantidad
    if(cartItemsContainer){
        cartItemsContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-item')) {
                const serviceId = e.target.dataset.serviceId;
                removeFromCart(serviceId);
            } else if (e.target.classList.contains('increase-quantity')) {
                const serviceId = e.target.dataset.serviceId;
                changeQuantity(serviceId, 1);
            } else if (e.target.classList.contains('decrease-quantity')) {
                const serviceId = e.target.dataset.serviceId;
                changeQuantity(serviceId, -1);
            }
        });

        cartItemsContainer.addEventListener('change', function (e) {
            if (e.target.classList.contains('item-quantity')) {
                const serviceId = e.target.dataset.serviceId;
                const newQuantity = parseInt(e.target.value);
                setQuantity(serviceId, newQuantity);
            }
        });
    }

    // Función para cambiar la cantidad de un item en el carrito
    function changeQuantity(serviceId, delta) {
        const item = cart.find(item => item.id === serviceId);
        if (item) {
            item.quantity += delta;
            if (item.quantity < 1) {
                removeFromCart(serviceId);
            } else {
                updateCart();
            }
        }
    }

    // Función para establecer la cantidad de un item en el carrito
    function setQuantity(serviceId, newQuantity) {
        const item = cart.find(item => item.id === serviceId);
        if (item) {
            if (newQuantity < 1) {
                removeFromCart(serviceId);
            } else {
                item.quantity = newQuantity;
                updateCart();
            }
        }
    }

    // Función para remover del carrito
    function removeFromCart(serviceId) {
        cart = cart.filter(item => item.id !== serviceId);
        updateCart();
    }

    

    // Favorites Logic
    function updateFavoriteCount() {
        if (favoriteCount) {
            favoriteCount.textContent = favorites.length;
        }
    }

    function renderFavorites() {
        if (favoriteItemsContainer) {
            favoriteItemsContainer.innerHTML = '';
            if (favorites.length === 0) {
                noFavoritesMessage.style.display = 'block';
            } else {
                noFavoritesMessage.style.display = 'none';
                favorites.forEach(service => {
                    const favoriteItemCard = `
                        <div class="favorite-item-card">
                            <img src="${service.images[0]}" alt="${service.name}" class="favorite-item-image">
                            <div class="favorite-item-details">
                                <h5>${service.name}</h5>
                                <p>${service.price}</p>
                            </div>
                            <button class="btn btn-danger remove-favorite" data-service-id="${service.id}">Remove</button>
                        </div>
                    `;
                    favoriteItemsContainer.innerHTML += favoriteItemCard;
                });
            }
        }
    }

    // Event listener for removing from favorites within the modal
    if (favoriteItemsContainer) {
        favoriteItemsContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-favorite')) {
                const serviceId = e.target.dataset.serviceId;
                toggleFavorite(serviceId); // Use toggleFavorite to remove
            }
        });
    }

    // Event listener for opening favorites modal
    if (favoritesModal) {
        favoritesModal.addEventListener('show.bs.modal', renderFavorites);
    }

    function toggleFavorite(serviceId) {
        const service = allServices.find(s => s.id === serviceId); // Use allServices here
        if (!service) return;

        const index = favorites.findIndex(fav => fav.id === serviceId);
        if (index > -1) {
            // Remove from favorites
            favorites.splice(index, 1);
            Swal.fire({
                title: 'Removed from Favorites!',
                text: `${service.name} has been removed from your favorites.`,
                icon: 'info',
                confirmButtonText: 'OK'
            });
        } else {
            // Add to favorites
            favorites.push(service);
            Swal.fire({
                title: 'Added to Favorites!',
                text: `${service.name} has been added to your favorites.`,
                icon: 'success',
                confirmButtonText: 'Awesome!'
            });
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderServices(allServices); // Re-render to update heart icons, use allServices
        updateFavoriteCount();
    }

    // Función que filtra y ordena los servicios
    function filterAndSortServices() {
        let filtered = [...allServices];

        // Filtro por búsqueda
        const query = serviceSearchInput.value.trim().toLowerCase();
        if (query) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(query) ||
                service.description.toLowerCase().includes(query)
            );
        }

        // Filtro por ubicación
        const location = locationFilterSelect.value;
        if (location) {
            filtered = filtered.filter(service => {
                // Si el filtro es 'ambas', muestra solo los que tengan esa location
                if (location === 'ambas') return service.location === 'ambas';
                // Si el filtro es 'interior' o 'exterior', muestra los que coincidan o sean 'ambas'
                return service.location === location || service.location === 'ambas';
            });
        }

        // Orden por precio
        if (priceSortSelect.value === 'asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (priceSortSelect.value === 'desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderServices(filtered);
    }

    // Listeners para los filtros y búsqueda
    if (serviceSearchInput) {
        serviceSearchInput.addEventListener('input', filterAndSortServices);
    }
    if (locationFilterSelect) {
        locationFilterSelect.addEventListener('change', filterAndSortServices);
    }
    if (priceSortSelect) {
        priceSortSelect.addEventListener('change', filterAndSortServices);
    }

    // Opcional: ejecuta el filtro al cargar los servicios
    fetch('data/services.json')
        .then(response => response.json())
        .then(services => {
            allServices = services;
            filterAndSortServices();
        });

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