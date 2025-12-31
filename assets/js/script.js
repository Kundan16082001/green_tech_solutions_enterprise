// Green Tech Solutions Enterprises - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Language Toggle Functionality
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        // Load saved language preference
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        setLanguage(savedLang);

        langToggle.addEventListener('click', function() {
            const currentLang = this.getAttribute('data-lang');
            const newLang = currentLang === 'en' ? 'hi' : 'en';
            setLanguage(newLang);
            localStorage.setItem('preferredLanguage', newLang);
        });
    }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });

    // Load Products (for products.html)
    if (document.getElementById('productsGrid')) {
        loadProducts();
    }

    // Load Product Details (for product.html)
    if (document.getElementById('productName')) {
        loadProductDetails();
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate form submission
            const formSuccess = document.getElementById('formSuccess');
            if (formSuccess) {
                formSuccess.classList.remove('d-none');
                contactForm.reset();
                setTimeout(() => {
                    formSuccess.classList.add('d-none');
                }, 5000);
            }
        });
    }

    // Product Filtering
    const categoryButtons = document.querySelectorAll('input[name="category"]');
    categoryButtons.forEach(button => {
        button.addEventListener('change', function() {
            filterProducts(this.id);
        });
    });
});

function setLanguage(lang) {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.setAttribute('data-lang', lang);
        langToggle.textContent = lang === 'en' ? 'हिंदी' : 'English';
    }

    // Update all elements with data-en and data-hi attributes
    document.querySelectorAll('[data-en], [data-hi]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });

    // Update document language
    document.documentElement.lang = lang;

    // Update page title
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.hasAttribute(`data-${lang}`)) {
        titleElement.textContent = titleElement.getAttribute(`data-${lang}`);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('assets/data/products.json');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';

    const card = document.createElement('div');
    card.className = 'card h-100 product-card';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name.en;
    img.className = 'card-img-top';
    img.loading = 'lazy';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.setAttribute('data-en', product.name.en);
    title.setAttribute('data-hi', product.name.hi);
    title.textContent = product.name.en;

    const category = document.createElement('p');
    category.className = 'text-muted mb-2';
    category.setAttribute('data-en', product.category.en);
    category.setAttribute('data-hi', product.category.hi);
    category.textContent = product.category.en;

    const description = document.createElement('p');
    description.className = 'card-text flex-grow-1';
    description.setAttribute('data-en', product.description.en.substring(0, 100) + '...');
    description.setAttribute('data-hi', product.description.hi.substring(0, 100) + '...');
    description.textContent = product.description.en.substring(0, 100) + '...';

    const link = document.createElement('a');
    link.href = `product.html?id=${product.id}`;
    link.className = 'btn btn-primary mt-auto';
    link.setAttribute('data-en', 'View Details');
    link.setAttribute('data-hi', 'विवरण देखें');
    link.textContent = 'View Details';

    cardBody.appendChild(title);
    cardBody.appendChild(category);
    cardBody.appendChild(description);
    cardBody.appendChild(link);

    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';

    productCards.forEach(card => {
        const cardCategory = card.querySelector('.text-muted').getAttribute(`data-${savedLang}`).toLowerCase();
        const filterCategory = category === 'all' ? '' : category;

        if (filterCategory === '' || cardCategory.includes(filterCategory.replace('s', ''))) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetch('assets/data/products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id == productId);
                if (product) {
                    displayProductDetails(product);
                }
            })
            .catch(error => console.error('Error loading product details:', error));
    }
}

function displayProductDetails(product) {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';

    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name[savedLang];

    document.getElementById('productName').setAttribute('data-en', product.name.en);
    document.getElementById('productName').setAttribute('data-hi', product.name.hi);
    document.getElementById('productName').textContent = product.name[savedLang];

    document.getElementById('productDescription').setAttribute('data-en', product.description.en);
    document.getElementById('productDescription').setAttribute('data-hi', product.description.hi);
    document.getElementById('productDescription').textContent = product.description[savedLang];

    const categoryBadge = document.getElementById('productCategory');
    categoryBadge.setAttribute('data-en', product.category.en);
    categoryBadge.setAttribute('data-hi', product.category.hi);
    categoryBadge.textContent = product.category[savedLang];

    const whatsappBtn = document.getElementById('whatsappBtn');
    const message = savedLang === 'en' ? 
        `Hello, I am interested in your ${product.name.en}.` : 
        `नमस्ते, मुझे आपके ${product.name.hi} में रुचि है।`;
    whatsappBtn.href = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
}

// Utility function to get current language
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'en';
}
