/* ===============================================
   JAVASCRIPT - Benzin Zapravkasi
   Interaktiv Funksiyalar va Animatsiyalar
=============================================== */

// Asosiy o'zgaruvchilar
let currentPrice = 8500;
let currentFuel = 'regular';
let currentPaymentMethod = 'cash';
let totalLiters = 0;
let totalAmount = 0;
let transactionCount = 0;
let cart = [];

// Sahifani yuklaganda
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Ilovani ishga tushirish
function initializeApp() {
    // Benzin tugmalari
    document.querySelectorAll('.fuel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.fuel-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPrice = parseInt(this.dataset.price);
            currentFuel = this.dataset.fuel;
            updateDisplay();
        });
    });

    // Litr kirish maydonini o'zgartirish
    if (document.getElementById('litersInput')) {
        document.getElementById('litersInput').addEventListener('input', updateDisplay);
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Boshlang'ich ko'rsatkilar
    updateDisplay();
    updatePaymentNote();
}

// Narxni va litarni yangilash
function updateDisplay() {
    const litersInput = document.getElementById('litersInput');
    if (!litersInput) return;

    const liters = parseFloat(litersInput.value) || 0;
    const price = liters * currentPrice;
    
    const priceDisplay = document.getElementById('priceDisplay');
    const litersDisplay = document.getElementById('litersDisplay');
    const progressFill = document.getElementById('progressFill');

    if (priceDisplay) priceDisplay.textContent = price.toLocaleString('uz-UZ') + ' so\'m';
    if (litersDisplay) litersDisplay.textContent = liters.toFixed(2) + ' L';
    
    if (progressFill) {
        const progress = Math.min((liters / 200) * 100, 100);
        progressFill.style.width = progress + '%';
    }
}

// Tez to'ldirish
function quickFill(liters) {
    const input = document.getElementById('litersInput');
    if (input) {
        input.value = liters;
        updateDisplay();
    }
}

// To'lov usulini tanlash
function selectPayment(btn) {
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPaymentMethod = btn.dataset.method;
    updatePaymentNote();
}

function updatePaymentNote() {
    const note = document.getElementById('paymentNote');
    if (!note) return;

    const texts = {
        cash: 'Naqd pul: stansiyada to‘liq naqd to‘lovni amalga oshiring.',
        card: 'Karta: POS terminal yoki karta raqamini kiritish orqali to‘lovni tanlang. Bu sahifada hozircha simulyatsiya ishlaydi.',
        mobile: 'Mobil: Click, Payme yoki bank mobil ilovasi orqali to‘lovni tanlang. Bu sahifa faqat demo sifatida ko‘rsatadi.',
        crypto: 'Crypto: kripto hamyon orqali to‘lov. Ushbu sahifa real kripto tranzaksiyasini amalga oshirmaydi.'
    };

    note.innerHTML = `<strong>To'lov bo'yicha ma'lumot:</strong> ${texts[currentPaymentMethod] || 'Tanlangan usul uchun ko‘rsatmani ko‘ring.'}`;
}

// Насосни tozalash
function resetPump() {
    const input = document.getElementById('litersInput');
    const receipt = document.getElementById('receipt');
    const status = document.getElementById('status');

    if (input) input.value = 0;
    if (receipt) receipt.classList.remove('active');
    if (status) {
        status.textContent = '';
        status.className = 'status';
    }
    updateDisplay();
}

// Benzin sotish jarayoni
function completePump() {
    const litersInput = document.getElementById('litersInput');
    if (!litersInput) return;

    const liters = parseFloat(litersInput.value) || 0;
    
    if (liters <= 0) {
        showStatus('Iltimos, miqdor kiriting!', 'error');
        return;
    }

    if (liters > 200) {
        showStatus('Maksimal 200 litrga cheklangan!', 'error');
        return;
    }

    const total = liters * currentPrice;

    // Holat ko'rsatish
    showStatus('Benzin sotilmoqda... ⛽', 'info');

    // Насос animatsiyasi
    const pumpNozzle = document.getElementById('pumpNozzle');
    if (pumpNozzle) {
        pumpNozzle.style.animation = 'none';
        setTimeout(() => {
            pumpNozzle.style.animation = 'pump 0.6s infinite';
        }, 10);
    }

    // Sotish jarayonini simulyatsiya qilish
    setTimeout(() => {
        totalLiters += liters;
        totalAmount += total;
        transactionCount += 1;

        // Statistikani yangilash
        const totalLitersEl = document.getElementById('totalLiters');
        const totalAmountEl = document.getElementById('totalAmount');
        const transactionCountEl = document.getElementById('transactionCount');

        if (totalLitersEl) totalLitersEl.textContent = totalLiters.toFixed(1);
        if (totalAmountEl) totalAmountEl.textContent = totalAmount.toLocaleString('uz-UZ');
        if (transactionCountEl) transactionCountEl.textContent = transactionCount;

        // Raseykani ko'rsatish
        showReceipt(liters, total);
        
        showStatus('✓ Benzin muvaffaqiyatli sotildi!', 'success');

        // 3 sekunddan keyin tozalash
        setTimeout(() => {
            resetPump();
        }, 3000);
    }, 2000);
}

// Raseykani ko'rsatish
function showReceipt(liters, total) {
    const receipt = document.getElementById('receipt');
    if (!receipt) return;

    const now = new Date();
    
    const receiptFuel = document.getElementById('receiptFuel');
    const receiptLiters = document.getElementById('receiptLiters');
    const receiptPrice = document.getElementById('receiptPrice');
    const receiptPayment = document.getElementById('receiptPayment');
    const receiptTime = document.getElementById('receiptTime');
    const receiptTotal = document.getElementById('receiptTotal');

    if (receiptFuel) receiptFuel.textContent = getFuelName(currentFuel);
    if (receiptLiters) receiptLiters.textContent = liters.toFixed(2) + ' L';
    if (receiptPrice) receiptPrice.textContent = currentPrice.toLocaleString('uz-UZ') + ' so\'m/L';
    if (receiptPayment) receiptPayment.textContent = getPaymentName(currentPaymentMethod);
    if (receiptTime) receiptTime.textContent = now.toLocaleString('uz-UZ');
    if (receiptTotal) receiptTotal.textContent = total.toLocaleString('uz-UZ') + ' so\'m';
    
    receipt.classList.add('active');
}

// Holat xabari ko'rsatish
function showStatus(message, type) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = message;
        status.className = 'status ' + type;
    }
}

// Benzin turining nomini olish
function getFuelName(fuel) {
    const names = {
        'regular': 'Regular',
        'premium': 'Premium',
        'diesel': 'Dizel',
        'gas': 'Gaz'
    };
    return names[fuel] || fuel;
}

// To'lov usulining nomini olish
function getPaymentName(method) {
    const names = {
        'cash': 'Naqd Pul',
        'card': 'Karta',
        'mobile': 'Mobil',
        'crypto': 'Crypto'
    };
    return names[method] || method;
}

// Savatchaga mahsulot qo'shish
function addToCart(btn) {
    const product = btn.dataset.product;
    const price = parseInt(btn.dataset.price);

    cart.push({ product, price });

    // Tugmani animatsiyalash
    btn.classList.add('added');
    btn.textContent = '✓ Qo\'shildi!';

    setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = 'Savatchaga Qo\'sh';
    }, 2000);

    // Savatcha soni yangilash
    updateCartCount();
    showNotification(`${product} savatchaga qo'shildi!`);
}

// Savatcha sonini yangilash
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Savatcha ko'rsatish/yashirish
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');

    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }

    updateCartDisplay();
}

// Savatcha ko'rinishini yangilash
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Savatcha bo\'sh</p>';
    } else {
        let total = 0;
        let html = '';

        cart.forEach((item, index) => {
            total += item.price;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.product}</h4>
                        <p>${item.price.toLocaleString('uz-UZ')} so'm</p>
                    </div>
                    <button class="cart-remove" onclick="removeFromCart(${index})">✕</button>
                </div>
            `;
        });

        cartItems.innerHTML = html;
    }

    if (cartTotalPrice) {
        cartTotalPrice.textContent = cart.reduce((sum, item) => sum + item.price, 0).toLocaleString('uz-UZ') + ' so\'m';
    }
}

// Savatchadan olib tashlash
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
}

// Savatchani rasmiylash
function checkout() {
    if (cart.length === 0) {
        showNotification('Savatcha bo\'sh!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    showNotification(`Buyurtma rasmiylandi! Jami: ${total.toLocaleString('uz-UZ')} so'm`);

    setTimeout(() => {
        cart = [];
        updateCartCount();
        updateCartDisplay();
        toggleCart();
    }, 2000);
}

// Bildirishnoma ko'rsatish
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
        z-index: 9999;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Sahifaga scrolling
function scrollTo(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll bo'lgan vaqtda navbar background
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Sahifa yuklanganida animatsiyalar
window.addEventListener('load', function() {
    // Barcha elementlarni foydalanuvchiga ko'rinishi uchun
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
    });
});
