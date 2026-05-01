/* =====================================
   CART SYSTEM & LOCALSTORAGE
===================================== */
let cart = [];

/**
 * Loads cart data from localStorage when the page starts.
 */
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) cart = JSON.parse(saved);
}

/**
 * Saves the current cart state to localStorage.
 */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* =====================================
   FETCH PRODUCTS FROM BACKEND
===================================== */

/**
 * Fetches all products from the Spring Boot backend API.
 * Uses try/catch to handle possible errors such as:
 * - server not running
 * - network failure
 * - invalid response
 * If an error occurs, a message is displayed in the UI.
 */
async function fetchProducts() {
  try {
    // Attempt to call backend API
    const response = await fetch("http://localhost:8080/api/v1/products");

    // Check if response is successful
    if (!response.ok) {
      throw new Error("HTTP Error: " + response.status);
    }

    // Convert response to JSON
    const products = await response.json();

    // Render products in UI
    renderProducts(products);

  } catch (error) {
    // Handles any errors from fetch or processing
    console.error("Error fetching products:", error);

    const grid = document.querySelector(".products-grid");
    if (grid) {
      grid.innerHTML = "<p>Failed to load products.</p>";
    }
  }
}

/* =====================================
   DYNAMIC PRODUCT RENDERING
===================================== */

/**
 * Displays products dynamically in the HTML grid.
 */
function renderProducts(products) {
  const productGrid = document.querySelector(".products-grid");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (!products || products.length === 0) {
    productGrid.innerHTML = "<p>No products available.</p>";
    return;
  }

  products.forEach(product => {
    const card = document.createElement("article");
    card.classList.add("product-card");

    const img = document.createElement("img");

    // SAFE IMAGE HANDLING
    img.src = product.imageUrl ? product.imageUrl : "placeholder.jpg";
    img.alt = product.name;

    // fallback if image not found
    img.onerror = () => {
      img.src = "placeholder.jpg";
    };

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = "₱" + product.price;

    const btn = document.createElement("button");
    btn.textContent = "Add to Cart";
    btn.setAttribute("data-id", product.id);

    card.append(img, name, price, btn);
    productGrid.appendChild(card);
  });
}

/* =====================================
   ADD TO CART (EVENT DELEGATION)
===================================== */

/**
 * Handles adding products to cart.
 * Uses event delegation to listen for button clicks.
 * 
 * Uses try/catch to safely fetch product details:
 * - prevents app crash if API fails
 * - logs error for debugging
 */
document.body.addEventListener("click", async (event) => {

  if (event.target.tagName === "BUTTON" && event.target.hasAttribute("data-id")) {

    const id = event.target.getAttribute("data-id");

    try {
      // Fetch single product by ID
      const response = await fetch(`http://localhost:8080/api/v1/products/${id}`);
      const product = await response.json();

      // Check if product already exists in cart
      const existing = cart.find(item => item.id === product.id);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      saveCart();
      renderCart();

    } catch (err) {
      // Handles API or network errors
      console.error("Error adding to cart:", err);
    }
  }
});

/* =====================================
   CART RENDERING
===================================== */

/**
 * Renders cart items dynamically in the UI.
 */
function renderCart() {
  const cartList = document.querySelector(".cart-container");
  if (!cartList) return;

  cartList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = "₱" + item.price;

    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.value = item.quantity;

    input.addEventListener("change", () => {
      const qty = parseInt(input.value);

      if (qty === 0) {
        cart = cart.filter(p => p.id !== item.id);
      } else {
        item.quantity = qty;
      }

      saveCart();
      renderCart();
    });

    li.append(name, price, input);
    cartList.appendChild(li);
  });
}

/* =====================================
   INITIALIZE APP
===================================== */
loadCart();
renderCart();
fetchProducts();