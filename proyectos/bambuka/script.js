// ==========================================================================
// MENU DIGITAL BAMBUKA - JAVASCRIPT
// ==========================================================================

class MenuDigital {
    constructor() {
        this.data = null;
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentProduct = null;
        
        // DOM Elements
        this.elements = {
            // Loading
            loading: document.getElementById('loading'),
            
            // Mobile Navigation
            menuToggle: document.getElementById('menuToggle'),
            sidebar: document.getElementById('sidebar'),
            closeSidebar: document.getElementById('closeSidebar'),
            overlay: document.getElementById('overlay'),
            
            // Search
            searchInput: document.getElementById('searchInput'),
            searchClear: document.getElementById('searchClear'),
            
            // Categories
            categoriesGrid: document.getElementById('categoriesGrid'),
            
            // Products
            productsGrid: document.getElementById('productsGrid'),
            productsTitle: document.getElementById('productsTitle'),
            
            // Modal
            modal: document.getElementById('productModal'),
            modalClose: document.getElementById('modalClose'),
            modalTitle: document.getElementById('modalTitle'),
            modalImage: document.getElementById('modalImage'),
            modalProductName: document.getElementById('modalProductName'),
            modalPrice: document.getElementById('modalPrice'),
            modalDescription: document.getElementById('modalDescription'),
            
            // Modal Carousel
            ingredientsList: document.getElementById('ingredientsList'),
            allergensList: document.getElementById('allergensList'),
            calories: document.getElementById('calories'),
            spicyLevel: document.getElementById('spicyLevel'),
            prepTime: document.getElementById('prepTime')
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.renderCategories();
            this.renderProducts();
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing menu:', error);
            this.showError('Error al cargar el menú');
        }
    }
    
    async loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.data = data.restaurant;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // Mobile Navigation
        this.elements.menuToggle?.addEventListener('click', () => this.toggleSidebar());
        this.elements.closeSidebar?.addEventListener('click', () => this.closeSidebar());
        this.elements.overlay?.addEventListener('click', () => this.closeSidebar());
        
        // Search
        this.elements.searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.searchClear?.addEventListener('click', () => this.clearSearch());
        
        // Modal
        this.elements.modalClose?.addEventListener('click', () => this.closeModal());
        this.elements.modal?.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.elements.modal.classList.contains('active')) {
                    this.closeModal();
                } else if (this.elements.sidebar.classList.contains('active')) {
                    this.closeSidebar();
                }
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.elements.sidebar.classList.contains('active')) {
                this.closeSidebar();
            }
        });
    }
    
    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    
    toggleSidebar() {
        const isActive = this.elements.sidebar.classList.contains('active');
        if (isActive) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        this.elements.sidebar.classList.add('active');
        this.elements.overlay.classList.add('active');
        this.elements.menuToggle.classList.add('active');
        document.body.classList.add('sidebar-open');
    }
    
    closeSidebar() {
        this.elements.sidebar.classList.remove('active');
        this.elements.overlay.classList.remove('active');
        this.elements.menuToggle.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
    
    // ==========================================================================
    // SEARCH FUNCTIONALITY
    // ==========================================================================
    
    handleSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        
        // Show/hide clear button
        if (this.searchQuery) {
            this.elements.searchClear.style.display = 'block';
        } else {
            this.elements.searchClear.style.display = 'none';
        }
        
        this.renderProducts();
    }
    
    clearSearch() {
        this.elements.searchInput.value = '';
        this.searchQuery = '';
        this.elements.searchClear.style.display = 'none';
        this.renderProducts();
    }
    
    // ==========================================================================
    // CATEGORIES
    // ==========================================================================
    
    renderCategories() {
        if (!this.data?.categories) return;
        
        const categoriesHTML = this.data.categories.map(category => `
            <div class="category-card" data-category="${category.id}" style="border-color: ${category.color}20">
                <span class="category-icon">${category.icon}</span>
                <h3 class="category-name">${category.name}</h3>
            </div>
        `).join('');
        
        this.elements.categoriesGrid.innerHTML = categoriesHTML;
        
        // Add click events
        this.elements.categoriesGrid.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const categoryId = categoryCard.dataset.category;
                this.filterByCategory(categoryId);
                
                // Update active state
                document.querySelectorAll('.category-card').forEach(card => 
                    card.classList.remove('active'));
                categoryCard.classList.add('active');
                
                // Update filter buttons
                this.updateFilterButtons(categoryId);
            }
        });
    }
    
    // ==========================================================================
    // PRODUCTS
    // ==========================================================================
    
    renderProducts() {
        if (!this.data?.products) return;
        
        let filteredProducts = this.data.products;
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.currentFilter);
        }
        
        // Apply search filter
        if (this.searchQuery) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery) ||
                product.description.toLowerCase().includes(this.searchQuery) ||
                product.category.toLowerCase().includes(this.searchQuery)
            );
        }
        
        // Update title
        this.updateProductsTitle(filteredProducts.length);
        
        // Render products
        if (filteredProducts.length === 0) {
            this.elements.productsGrid.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                </div>
            `;
            return;
        }
        
        const productsHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
        this.elements.productsGrid.innerHTML = productsHTML;
        
        // Add click events for details buttons
        this.elements.productsGrid.addEventListener('click', (e) => {
            const detailsBtn = e.target.closest('.details-btn');
            if (detailsBtn) {
                const productId = parseInt(detailsBtn.dataset.productId);
                this.showProductDetails(productId);
            }
        });
    }
    
    createProductCard(product) {
        const category = this.data.categories.find(cat => cat.id === product.category);
        const categoryColor = category ? category.color : '#0057B8';
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-header">
                        <h3 class="product-name">${product.name}</h3>
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="details-btn" data-product-id="${product.id}">
                            <i class="fas fa-info-circle"></i>
                            Ver detalles
                        </button>
                        <span class="category-badge ${product.category}" style="border-left-color: ${categoryColor}">
                            ${category ? category.name : product.category}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    filterByCategory(categoryId) {
        this.currentFilter = categoryId;
        this.renderProducts();
    }
    
    updateFilterButtons(activeCategory) {
        // Filter buttons removed - only category cards are used for filtering now
        return;
    }
    
    updateProductsTitle(count) {
        let title = 'Todos los productos';
        
        if (this.currentFilter !== 'all') {
            const category = this.data.categories.find(cat => cat.id === this.currentFilter);
            title = category ? category.name : this.currentFilter;
        }
        
        if (this.searchQuery) {
            title += ` (búsqueda: "${this.searchQuery}")`;
        }
        
        title += ` (${count})`;
        this.elements.productsTitle.textContent = title;
    }
    
    // ==========================================================================
    // PRODUCT MODAL
    // ==========================================================================
    
    showProductDetails(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) return;
        
        this.currentProduct = product;
        
        // Populate modal
        this.elements.modalProductName.textContent = product.name;
        this.elements.modalPrice.textContent = `$${product.price.toFixed(2)}`;
        this.elements.modalDescription.textContent = product.description;
        this.elements.modalImage.src = product.image;
        this.elements.modalImage.alt = product.name;
        
        // Populate details
        this.populateProductDetails(product);
        
        // Show modal
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Setup carousel
        this.setupCarousel();
    }
    
    populateProductDetails(product) {
        const details = product.details;
        
        // Ingredients
        this.elements.ingredientsList.innerHTML = details.ingredients.map(ingredient => 
            `<li>${ingredient}</li>`
        ).join('');
        
        // Allergens
        this.elements.allergensList.textContent = details.allergens.length > 0 
            ? details.allergens.join(', ') 
            : 'Ninguno reportado';
        
        // Calories
        this.elements.calories.textContent = `${details.calories} kcal`;
        
        // Spicy level
        this.renderSpicyLevel(details.spicy_level);
        
        // Preparation time
        this.elements.prepTime.textContent = details.preparation_time;
    }
    
    renderSpicyLevel(level) {
        const maxLevel = 3;
        let spicyHTML = '';
        
        for (let i = 0; i < maxLevel; i++) {
            const isActive = i < level;
            spicyHTML += `<i class="fas fa-pepper-hot spicy-icon ${isActive ? '' : 'inactive'}"></i>`;
        }
        
        this.elements.spicyLevel.innerHTML = spicyHTML;
    }
    
    setupCarousel() {
        const carouselBtns = document.querySelectorAll('.carousel-btn');
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        
        carouselBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Update buttons
                carouselBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update slides
                carouselSlides.forEach(slide => slide.classList.remove('active'));
                document.getElementById(`${tab}-tab`)?.classList.add('active');
            });
        });
    }
    
    closeModal() {
        this.elements.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentProduct = null;
    }
    
    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    hideLoading() {
        setTimeout(() => {
            this.elements.loading.classList.add('hidden');
        }, 500);
    }
    
    showError(message) {
        this.elements.loading.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">
                    Reintentar
                </button>
            </div>
        `;
    }
    
    // ==========================================================================
    // PERFORMANCE OPTIMIZATION
    // ==========================================================================
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Lazy load images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// ==========================================================================
// ADDITIONAL UTILITIES
// ==========================================================================

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the menu
    new MenuDigital();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add error handling for images
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiNubm8gZGlzcG9uaWJsZTwvdGV4dD4KPC9zdmc+';
        }
    }, true);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
    });
    
    // Add touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });
    
    function handleGesture() {
        const swipeThreshold = 100;
        const sidebar = document.getElementById('sidebar');
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - close sidebar
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - open sidebar (only if near edge)
            if (touchStartX < 50 && !sidebar.classList.contains('active')) {
                sidebar.classList.add('active');
                document.getElementById('overlay').classList.add('active');
                document.body.classList.add('sidebar-open');
            }
        }
    }
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}