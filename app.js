// ===== PRODUCT DATA =====
const products = [
  {
    id: 1,
    name: 'Shadow Edition',
    category: 'snapback',
    price: 49.99,
    oldPrice: 65.00,
    badge: 'Más Vendida',
    rating: 4.9,
    reviews: 342,
    image: 'img/shadow-edition.png'
  },
  {
    id: 2,
    name: 'Arctic Frost',
    category: 'dadhat',
    price: 39.99,
    oldPrice: null,
    badge: 'Nueva',
    rating: 4.8,
    reviews: 128,
    image: 'img/arctic-frost.png'
  },
  {
    id: 3,
    name: 'Heritage Classic',
    category: 'fitted',
    price: 54.99,
    oldPrice: 70.00,
    badge: 'Oferta',
    rating: 4.9,
    reviews: 256,
    image: 'img/heritage-classic.png'
  },
  {
    id: 4,
    name: 'Night Rider',
    category: 'snapback',
    price: 44.99,
    oldPrice: null,
    badge: null,
    rating: 4.7,
    reviews: 189,
    image: 'img/night-rider.png'
  },
  {
    id: 5,
    name: 'Sunset Vibes',
    category: 'dadhat',
    price: 42.99,
    oldPrice: 55.00,
    badge: 'Oferta',
    rating: 4.8,
    reviews: 204,
    image: 'img/sunset-vibes.jpg'
  },
  {
    id: 6,
    name: 'Urban Knit',
    category: 'beanie',
    price: 34.99,
    oldPrice: null,
    badge: 'Nueva',
    rating: 4.6,
    reviews: 97,
    image: 'img/urban-knit.jpg'
  },
  {
    id: 7,
    name: 'Golden Hour',
    category: 'fitted',
    price: 59.99,
    oldPrice: null,
    badge: 'Premium',
    rating: 5.0,
    reviews: 88,
    image: 'img/golden-hour.png'
  },
  {
    id: 8,
    name: 'Forest Walker',
    category: 'dadhat',
    price: 38.99,
    oldPrice: 50.00,
    badge: 'Oferta',
    rating: 4.7,
    reviews: 156,
    image: 'img/forest-walker.jpg'
  },
  {
    id: 9,
    name: 'Blizzard Knit',
    category: 'beanie',
    price: 32.99,
    oldPrice: null,
    badge: null,
    rating: 4.5,
    reviews: 73,
    image: 'img/blizzard-knit.png'
  }
];

// ===== STATE =====
let cart = [];
let activeFilter = 'all';
let wishlist = new Set();

// ===== DOM REFERENCES =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#preloader').classList.add('hidden');
  }, 800);
});

// ===== NAVBAR =====
const navbar = $('#navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Hamburger menu
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('mobile-open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('mobile-open');
  });
});

// ===== SCROLL REVEAL =====
const revealElements = $$('.reveal, .reveal-left, .reveal-right');
const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.88;
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ===== PRODUCT RENDERING =====
const productsGrid = $('#productsGrid');

function renderProducts(filter = 'all') {
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  productsGrid.innerHTML = filtered.map((p, i) => `
    <div class="product-card reveal visible" style="animation: fadeInUp 0.6s ${i * 0.1}s both var(--ease-out);" data-category="${p.category}">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" class="product-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="product-wishlist ${wishlist.has(p.id) ? 'active' : ''}" data-id="${p.id}" aria-label="Agregar a favoritos">
          ${wishlist.has(p.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <p class="product-category">${getCategoryLabel(p.category)}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          ${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 > 0 ? '☆' : ''}
          <span>(${p.reviews})</span>
        </div>
        <div class="product-price-row">
          <div>
            <span class="product-price">$${p.price.toFixed(2)}</span>
            ${p.oldPrice ? `<span class="product-old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
          </div>
        </div>
        <button class="add-to-cart" data-id="${p.id}">Agregar al Carrito</button>
      </div>
    </div>
  `).join('');

  // Attach events
  $$('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });

  $$('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(parseInt(btn.dataset.id));
    });
  });
}

function getCategoryLabel(cat) {
  const labels = { snapback: 'Snapback', dadhat: 'Dad Hat', fitted: 'Fitted', beanie: 'Beanie' };
  return labels[cat] || cat;
}

// ===== FILTER =====
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts(activeFilter);
  });
});

// ===== WISHLIST =====
function toggleWishlist(id) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast('Eliminado de favoritos');
  } else {
    wishlist.add(id);
    showToast('Agregado a favoritos ❤️');
  }
  renderProducts(activeFilter);
}

// ===== CART =====
const cartBtn = $('#cartBtn');
const cartOverlay = $('#cartOverlay');
const cartSidebar = $('#cartSidebar');
const cartClose = $('#cartClose');
const cartItems = $('#cartItems');
const cartBadge = $('#cartBadge');
const cartCount = $('#cartCount');
const cartTotal = $('#cartTotal');
const cartFooter = $('#cartFooter');
const cartEmpty = $('#cartEmpty');

function openCart() {
  cartOverlay.classList.add('active');
  cartSidebar.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('active');
  cartSidebar.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
  showToast(`${product.name} agregado al carrito`);

  // Animate badge
  cartBadge.style.transform = 'scale(1.4)';
  setTimeout(() => cartBadge.style.transform = 'scale(1)', 300);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartBadge.textContent = totalItems;
  cartCount.textContent = totalItems;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartFooter.style.display = 'none';
    cartItems.innerHTML = '';
    cartItems.appendChild(cartEmpty);
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
          <div class="cart-item-qty">
            <button onclick="updateQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// ===== CHECKOUT =====
$('#checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) return;
  showToast('¡Gracias por tu compra! 🎉');
  cart = [];
  updateCart();
  setTimeout(closeCart, 1000);
});

// ===== TOAST =====
const toast = $('#toast');
let toastTimeout;

function showToast(message) {
  $('#toastMsg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ===== NEWSLETTER =====
$('#newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#newsletterEmail').value;
  if (email) {
    showToast('¡Suscripción exitosa! Bienvenido al Club CRWN 🎉');
    $('#newsletterEmail').value = '';
  }
});

// ===== SMOOTH SCROLL =====
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CATEGORY CARDS CLICK =====
$$('.category-card').forEach((card, i) => {
  const categories = ['snapback', 'dadhat', 'fitted', 'beanie'];
  card.addEventListener('click', () => {
    // Set filter
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    const filterBtn = $(`.filter-btn[data-filter="${categories[i]}"]`);
    if (filterBtn) filterBtn.classList.add('active');

    activeFilter = categories[i];
    renderProducts(activeFilter);

    // Scroll to products
    $('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== NUMBER COUNTER ANIMATION =====
function animateCounters() {
  const stats = $$('.hero-stat h3');
  stats.forEach(stat => {
    const text = stat.textContent;
    if (stat.dataset.animated) return;

    const match = text.match(/^([\d.]+)/);
    if (match) {
      const target = parseFloat(match[1]);
      const suffix = text.replace(match[1], '');
      let current = 0;
      const increment = target / 60;
      stat.dataset.animated = true;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(counter);
        }
        stat.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
      }, 25);
    }
  });
}

// Trigger counter when hero is in view
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

heroObserver.observe($('.hero-stats'));

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    hamburger.classList.remove('active');
    navLinks.classList.remove('mobile-open');
  }
});

// ===== INIT =====
renderProducts();
updateCart();
