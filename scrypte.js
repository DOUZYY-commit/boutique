const START_POINTS = 500;

const products = [
  // ROI
  { id: 2, category: "Roi", name: "Roi Titan", type: "Roi spécial", emoji: "🗿", price: 200,
    move: "2 cases dans toutes les directions", power: "Peut résister à une attaque" },
  { id: 3, category: "Roi", name: "Roi Peureux", type: "Roi spécial", emoji: "😢", price: 150,
    move: "1 case dans toutes les directions",
    power: "Pleure sur la pièce qui le met en échec : ses larmes font reculer cette pièce de 3 cases." },

  // REINE
  { id: 4, category: "Reine", name: "Reine Bouclier", type: "Spéciale", emoji: "♛", price: 250,
    move: "Partout",
    power: "Bouclier : s'active pour 1 coup, utilisable une seule fois par partie." },

  // TOUR
  { id: 6, category: "Tour", name: "Tour Rapide", type: "Tour spéciale", emoji: "⚡", price: 130,
    move: "Ligne droite", power: "Peut se déplacer de 2 cases en diagonale." },
  { id: 7, category: "Tour", name: "Tour Romaine", type: "Tour spéciale", emoji: "🏛️", price: 150,
    move: "Cavalier pendant 2 tours, Tour le reste du temps",
    power: "Tour déguisée en cavalier : ne peut se déplacer en cavalier que 2 fois." },

  // FOU
  { id: 9, category: "Fou", name: "Fou Fantôme", type: "Fou spécial", emoji: "👻", price: 130,
    move: "Diagonales", power: "Peut traverser une pièce (mais pas deux)." },
  { id: 10, category: "Fou", name: "Fou Halloween", type: "Fou spécial", emoji: "🎃", price: 130,
    move: "Diagonales", power: "Pouvoir à définir" },

  // CAVALIER
  { id: 11, category: "Cavalier", name: "Cavalier Ardent", type: "Spéciale", emoji: "♞", price: 130,
    move: "En L",
    power: "Traînée de feu : laisse une traînée sur son passage pendant 1 coup. Toute pièce qui passe dessus meurt. Une seule utilisation par partie." },

  // PION
  { id: 12, category: "Pion", name: "Soldat", type: "Spéciale", emoji: "🪖", price: 70,
    move: "Pion : 1 case vers l'avant",
    power: "Champ laser : lance un rayon sur une rangée de 2 cases. 3 utilisations par partie." },

  // VOLEUR
  { id: 13, category: "Voleur", name: "Voleur Sauteur", type: "Spéciale", emoji: "🥷", price: 160,
    move: "1 à 3 cases, toutes directions", power: "Peut sauter par-dessus les pièces." },
  { id: 14, category: "Voleur", name: "Voleur Copieur", type: "Spéciale", emoji: "🥷", price: 160,
    move: "1 à 3 cases, toutes directions",
    power: "Vol : copie le pouvoir d'une pièce capturée." },
  { id: 15, category: "Voleur", name: "Voleur Fuyard", type: "Spéciale", emoji: "🥷", price: 160,
    move: "1 à 3 cases, toutes directions",
    power: "Fuite : téléportation, 1 fois par partie." },
  { id: 16, category: "Voleur", name: "Grand Voleur", type: "Spéciale", emoji: "🥷", price: 200,
    move: "1 à 3 cases, toutes directions",
    power: "Grand Vol : conserve définitivement un pouvoir volé, 1 fois." },

  // SERPENT
  { id: 17, category: "Serpent", name: "Le Serpent", type: "Spéciale", emoji: "🐍", price: 180,
    move: "Zig-zag",
    power: "Poison : quand il mange un pion, un autre pion aléatoire est empoisonné et disparaît 2 coups après." }
];

const categories = ["Tous", ...new Set(products.map(p => p.category))];
let currentCategory = "Tous";

/* ---------- Sauvegarde (localStorage) ---------- */
const STORAGE_KEY = "echecs_boutique";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.balance === "number" && Array.isArray(saved.cart)) {
      // on garde seulement les articles qui existent encore dans la boutique
      saved.cart = saved.cart.filter(i => products.some(p => p.id === i.id) && i.qty > 0);
      return saved;
    }
  } catch (e) {}
  return { balance: START_POINTS, cart: [] };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, cart }));
  } catch (e) {}
}

let { balance, cart } = loadState();

/* ---------- Points ---------- */
function getProduct(id) { return products.find(p => p.id === id); }

function cartTotal() {
  return cart.reduce((sum, i) => sum + getProduct(i.id).price * i.qty, 0);
}

function remainingPoints() { return balance - cartTotal(); }

function updateHeader() {
  document.getElementById("points-count").textContent = remainingPoints();
  document.getElementById("cart-count").textContent =
    cart.reduce((sum, i) => sum + i.qty, 0);
}

/* ---------- Filtres ---------- */
function renderFilters() {
  document.getElementById("filters").innerHTML = categories.map(c =>
    `<button class="${c === currentCategory ? "active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");
}

document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  currentCategory = btn.dataset.cat;
  renderFilters();
  renderProducts();
});

/* ---------- Produits ---------- */
function renderProducts() {
  const list = currentCategory === "Tous"
    ? products
    : products.filter(p => p.category === currentCategory);

  document.getElementById("products").innerHTML = list.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="emoji">${p.emoji}</div>
      <div class="tag">${p.category}</div>
      <h3>${p.name}</h3>
      <p>⭐ ${p.price} pts</p>
    </article>
  `).join("");
}

document.getElementById("products").addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (card) openModal(Number(card.dataset.id));
});

/* ---------- Fenêtre de description ---------- */
const modal = document.getElementById("modal");

function openModal(id) {
  const p = getProduct(id);
  document.getElementById("modal-body").innerHTML = `
    <div class="emoji">${p.emoji}</div>
    <h2>${p.name}</h2>
    <dl>
      <dt>Catégorie</dt><dd>${p.category} · ${p.type}</dd>
      <dt>Déplacement</dt><dd>${p.move}</dd>
      <dt>Pouvoir spécial</dt><dd>${p.power}</dd>
      <dt>Prix</dt><dd>⭐ ${p.price} pts</dd>
    </dl>
    <button class="buy-btn" data-id="${p.id}">Ajouter au panier 🛒</button>
  `;
  modal.classList.remove("hidden");
}

function closeModal() { modal.classList.add("hidden"); }

document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

document.getElementById("modal-body").addEventListener("click", e => {
  const btn = e.target.closest(".buy-btn");
  if (!btn) return;
  if (addToCart(Number(btn.dataset.id))) closeModal();
});
/* ---------- Popup de message ---------- */
const popup = document.getElementById("popup");

function showPopup(type, title, message) {
  document.getElementById("popup-icon").textContent = type === "success" ? "✅" : "⚠️";
  document.getElementById("popup-title").textContent = title;
  document.getElementById("popup-message").textContent = message;
  popup.classList.remove("hidden");
}

function closePopup() { popup.classList.add("hidden"); }

document.getElementById("popup-ok").addEventListener("click", closePopup);
popup.addEventListener("click", e => { if (e.target === popup) closePopup(); });
/* ---------- Panier ---------- */
const cartPanel = document.getElementById("cart-panel");

function addToCart(id) {
  const p = getProduct(id);
  if (p.price > remainingPoints()) {
    showPopup("error", "Pas assez de points", "Il te manque ⭐ " + (p.price - remainingPoints()) + " pts pour ajouter cette pièce.");
    return false;
  }
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  refresh();
  return true;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (delta > 0 && getProduct(id).price > remainingPoints()) {
    alert("Pas assez de points !");
    return;
  }
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  refresh();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  refresh();
}

function clearCart() {
  cart = [];
  refresh();
}

function checkout() {
  if (cart.length === 0) return;
  const total = cartTotal();
  balance -= total;
  cart = [];
  refresh();
  alert("Commande validée ! " + total + " points dépensés.");
  closeCart();
}

function renderCart() {
  const box = document.getElementById("cart-items");

  if (cart.length === 0) {
    box.innerHTML = `<p class="cart-empty">Ton panier est vide.</p>`;
  } else {
    box.innerHTML = cart.map(i => {
      const p = getProduct(i.id);
      return `
        <div class="cart-line">
          <span class="emoji">${p.emoji}</span>
          <div class="info">
            <strong>${p.name}</strong><br>
            <small>⭐ ${p.price * i.qty} pts</small>
          </div>
          <div class="qty">
            <button data-action="minus" data-id="${p.id}">−</button>
            <span>${i.qty}</span>
            <button data-action="plus" data-id="${p.id}">+</button>
          </div>
          <button class="remove" data-action="remove" data-id="${p.id}" aria-label="Retirer">🗑️</button>
        </div>`;
    }).join("");
  }

  document.getElementById("cart-total").textContent = cartTotal();
  document.getElementById("cart-after").textContent = remainingPoints();
  document.getElementById("checkout-btn").disabled = cart.length === 0;
}

document.getElementById("cart-items").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "plus") changeQty(id, 1);
  if (btn.dataset.action === "minus") changeQty(id, -1);
  if (btn.dataset.action === "remove") removeFromCart(id);
});

function openCart() { renderCart(); cartPanel.classList.remove("hidden"); }
function closeCart() { cartPanel.classList.add("hidden"); }

document.getElementById("cart-btn").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
document.getElementById("checkout-btn").addEventListener("click", checkout);
document.getElementById("clear-btn").addEventListener("click", clearCart);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeModal(); closeCart(); }
});

/* Met tout à jour + sauvegarde */
function refresh() {
  updateHeader();
  renderCart();
  saveState();
}

renderFilters();
renderProducts();
refresh();