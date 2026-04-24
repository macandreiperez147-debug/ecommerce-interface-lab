/* =====================================
   LAB 6 - DOM SCRIPTING FOR E-COMMERCE
   Fully Compliant with All Requirements
===================================== */

/* =====================================
   TASK 1: PRODUCT CLASS & DATA
===================================== */
class Product {
  constructor(id, name, price, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
  }
}

const products = [
  new Product(1, "Smartphone", 699, "Galaxy A34 5G.jpg"),
  new Product(2, "Headphones", 75, "jbl headphone.jpg"),
  new Product(3, "Smart Watch", 120, "watch.jpg"),
  new Product(4, "Laptop", 999, "laptop.jpg"),
  new Product(5, "Tablet", 450, "tablet.jpg"),
  new Product(6, "Camera", 800, "camera.jpg"),
  new Product(7, "Speaker", 60, "speaker.jpg"),
  new Product(8, "Keyboard", 40, "keyboard.jpg"),
  new Product(9, "Mouse", 25, "mouse.jpg"),
  new Product(10, "Monitor", 200, "monitor.jpg")
];

/* =====================================
   TASK 3: CART SYSTEM & LOCALSTORAGE
===================================== */
let cart = [];

// Load saved cart from localStorage
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) cart = JSON.parse(saved);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* =====================================
   TASK 2: DYNAMIC PRODUCT RENDERING
===================================== */
const productGrid = document.querySelector(".products-grid");

if (productGrid) {
  products.forEach(product => {
    const card = document.createElement("article");
    card.classList.add("product-card");

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = "$" + product.price;

    const btn = document.createElement("button");
    btn.textContent = "Add to Cart";
    btn.setAttribute("data-id", product.id);

    // Fade-in animation feedback
    btn.addEventListener("click", () => {
      card.classList.add("fade-in");
      setTimeout(() => card.classList.remove("fade-in"), 500);
    });

    card.append(img, name, price, btn);
    productGrid.appendChild(card);
  });
}

/* =====================================
   TASK 3: EVENT DELEGATION FOR CART
===================================== */
document.body.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON" && event.target.hasAttribute("data-id")) {
    const id = parseInt(event.target.getAttribute("data-id"));
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
  }
});

/* =====================================
   RENDER CART & CHECKOUT SUMMARY
===================================== */
function renderCart() {
  const cartList = document.querySelector(".cart-container");
  if (cartList) cartList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = "$" + item.price;

    const input = document.createElement("input");
    input.type = "number";
    input.value = item.quantity;
    input.min = 0;

    input.addEventListener("change", function () {
      const qty = parseInt(this.value);
      if (qty === 0) {
        cart = cart.filter(p => p.id !== item.id);
      } else {
        item.quantity = qty;
      }
      saveCart();
      renderCart();
    });

    li.append(img, name, price, input);
    cartList.appendChild(li);
  });

  updateCheckoutSummary();
}

// Update subtotal, shipping, total automatically
function updateCheckoutSummary() {
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
  if (shippingEl) shippingEl.textContent = `$${shipping}`;
  if (totalEl) totalEl.textContent = `$${total}`;
}

/* =====================================
   TASK 4: CHECKOUT FORM VALIDATION
===================================== */
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    let valid = true;
    const inputs = form.querySelectorAll("input[type='text']");
    inputs.forEach(input => {
      if (input.value.trim() === "") {
        input.classList.add("error");
        valid = false;
      } else {
        input.classList.remove("error");
      }
    });

    const paymentChecked = form.querySelector("input[name='payment']:checked");
    if (!paymentChecked) {
      alert("Please select a payment method!");
      valid = false;
    }

    if (valid) {
      alert("Order Placed Successfully!");
      cart = [];
      saveCart();
      renderCart();
      form.reset();
      // simulate redirect
      // window.location.href = 'thankyou.html';
    }
  });
}

/* =====================================
   TASK 5: ACCOUNT PAGE GREETING
===================================== */
const currentUser = { name: "Mac" };
const accountHeader = document.querySelector(".account-header");
if (accountHeader) {
  accountHeader.textContent = `Welcome, ${currentUser.name}`;
}

/* =====================================
   INITIALIZE CART ON PAGE LOAD
===================================== */
loadCart();
renderCart();