// ==================================================
// Green Tech Solutions Enterprises - script.js
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    /* ========== LANGUAGE TOGGLE ========== */
    const langToggle = document.getElementById("langToggle");
    const savedLang = localStorage.getItem("preferredLanguage") || "en";
    setLanguage(savedLang);

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            const current = langToggle.getAttribute("data-lang");
            const next = current === "en" ? "hi" : "en";
            setLanguage(next);
            localStorage.setItem("preferredLanguage", next);
        });
    }

    /* ========== SCROLL ANIMATIONS ========== */
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll(".slide-up, .fade-in").forEach(el => {
        observer.observe(el);
    });

    /* ========== PRODUCTS PAGE ========== */
    if (document.getElementById("productsGrid")) {
        loadProducts();
    }

    /* ========== PRODUCT DETAILS PAGE ========== */
    if (document.getElementById("productName")) {
        loadProductDetails();
    }

    /* ========== CONTACT FORM ========== */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            const success = document.getElementById("formSuccess");
            if (success) {
                success.classList.remove("d-none");
                contactForm.reset();
                setTimeout(() => success.classList.add("d-none"), 5000);
            }
        });
    }

    /* ========== CATEGORY FILTER ========== */
    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.addEventListener("change", () => {
            filterProducts(input.id);
        });
    });
});

/* ==================================================
   LANGUAGE HANDLER
================================================== */
function setLanguage(lang) {
    const toggle = document.getElementById("langToggle");
    if (toggle) {
        toggle.setAttribute("data-lang", lang);
        toggle.textContent = lang === "en" ? "हिंदी" : "English";
    }

    document.querySelectorAll("[data-en],[data-hi]").forEach(el => {
        const value = el.getAttribute(`data-${lang}`);
        if (value) el.textContent = value;
    });

    document.documentElement.lang = lang;

    const title = document.querySelector("title");
    if (title && title.hasAttribute(`data-${lang}`)) {
        title.textContent = title.getAttribute(`data-${lang}`);
    }
}

/* ==================================================
   LOAD PRODUCTS
================================================== */
async function loadProducts() {
    try {
        const res = await fetch("assets/data/products.json");
        const products = await res.json();
        displayProducts(products);
        setLanguage(getCurrentLanguage()); // re-apply language
    } catch (err) {
        console.error("Product load failed:", err);
    }
}

/* ==================================================
   DISPLAY PRODUCTS
================================================== */
function displayProducts(products) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    grid.innerHTML = "";
    products.forEach(p => grid.appendChild(createProductCard(p)));
}

/* ==================================================
   PRODUCT CARD (FIXED CATEGORY DATA)
================================================== */
function createProductCard(product) {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 mb-4";

    const card = document.createElement("div");
    card.className = "card h-100 product-card";
    card.dataset.category = product.category.en.toLowerCase(); // ✅ FIX

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name.en;
    img.className = "card-img-top";
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.setAttribute("data-en", product.name.en);
    title.setAttribute("data-hi", product.name.hi);
    title.textContent = product.name.en;

    const category = document.createElement("p");
    category.className = "text-muted mb-2";
    category.setAttribute("data-en", product.category.en);
    category.setAttribute("data-hi", product.category.hi);
    category.textContent = product.category.en;

    const desc = document.createElement("p");
    desc.className = "card-text flex-grow-1";
    desc.setAttribute("data-en", product.description.en.slice(0, 100) + "...");
    desc.setAttribute("data-hi", product.description.hi.slice(0, 100) + "...");
    desc.textContent = product.description.en.slice(0, 100) + "...";

    const btn = document.createElement("a");
    btn.href = `product.html?id=${product.id}`;
    btn.className = "btn btn-primary mt-auto";
    btn.setAttribute("data-en", "View Details");
    btn.setAttribute("data-hi", "विवरण देखें");
    btn.textContent = "View Details";

    body.append(title, category, desc, btn);
    card.append(img, body);
    col.appendChild(card);

    return col;
}

/* ==================================================
   FILTER PRODUCTS (NOW WORKING)
================================================== */
function filterProducts(category) {
    document.querySelectorAll(".product-card").forEach(card => {
        const show =
            category === "all" ||
            card.dataset.category === category;

        card.parentElement.style.display = show ? "block" : "none";
    });
}

/* ==================================================
   PRODUCT DETAILS
================================================== */
function loadProductDetails() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;

    fetch("assets/data/products.json")
        .then(r => r.json())
        .then(products => {
            const product = products.find(p => p.id == id);
            if (product) renderProductDetails(product);
        })
        .catch(err => console.error(err));
}

function renderProductDetails(product) {
    const lang = getCurrentLanguage();

    document.getElementById("productImage").src = product.image;
    document.getElementById("productImage").alt = product.name[lang];

    const name = document.getElementById("productName");
    name.setAttribute("data-en", product.name.en);
    name.setAttribute("data-hi", product.name.hi);
    name.textContent = product.name[lang];

    const desc = document.getElementById("productDescription");
    desc.setAttribute("data-en", product.description.en);
    desc.setAttribute("data-hi", product.description.hi);
    desc.textContent = product.description[lang];

    const badge = document.getElementById("productCategory");
    badge.setAttribute("data-en", product.category.en);
    badge.setAttribute("data-hi", product.category.hi);
    badge.textContent = product.category[lang];

    const msg =
        lang === "en"
            ? `Hello, I am interested in your ${product.name.en}.`
            : `नमस्ते, मुझे आपके ${product.name.hi} में रुचि है।`;

    document.getElementById("whatsappBtn").href =
        `https://wa.me/917378997339?text=${encodeURIComponent(msg)}`;
}

/* ==================================================
   UTIL
================================================== */
function getCurrentLanguage() {
    return localStorage.getItem("preferredLanguage") || "en";
}
