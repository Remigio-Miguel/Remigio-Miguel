const form = document.querySelector("#profile-form");
const profile = window.Hogario.read("hogario-profile", null);
if (profile) for (const [name, value] of Object.entries(profile)) {
  const field = form.elements.namedItem(name);
  if (field && value) field.value = value;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  window.Hogario.write("hogario-profile", data);
  document.querySelector("#profile-message").textContent = "Tus datos se guardaron en este navegador.";
  document.querySelector("#profile-message").classList.remove("is-hidden");
  document.querySelector(".profile-account-heading h2").textContent = data.name;
  document.querySelector(".profile-avatar").textContent = data.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
});

const paymentForm = document.querySelector("#payment-card-form");
const paymentList = document.querySelector("#payment-card-list");
const togglePaymentForm = document.querySelector("#toggle-payment-form");
const expiryInput = paymentForm.elements.namedItem("expiry");
let cards = window.Hogario.read("hogario-payment-cards", [
  { id: "hogario-card-4242", brand: "Visa", last4: "4242", holder: "Andrea Salazar", expiry: "2028-08" },
]);
const today = new Date();
expiryInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[character]);
const formatExpiry = (value) => {
  const [year, month] = value.split("-");
  return `${month}/${year.slice(-2)}`;
};
const renderCards = () => {
  if (!cards.length) {
    paymentList.innerHTML = '<div class="payment-empty"><span class="payment-empty-icon" aria-hidden="true">＋</span><strong>Aún no tienes tarjetas guardadas</strong><span>Agrega un método para tenerlo disponible en tu cuenta.</span></div>';
    return;
  }
  paymentList.innerHTML = cards.map((card, index) => `<article class="saved-payment"><div class="payment-preview"><div class="payment-preview-top"><span class="payment-chip" aria-hidden="true"></span><span class="payment-brand">${escapeHtml(card.brand)}</span></div><strong class="payment-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;${escapeHtml(card.last4)}</strong><div class="payment-preview-bottom"><span><small>TITULAR</small><strong>${escapeHtml(card.holder)}</strong></span><span><small>VENCE</small><strong>${escapeHtml(formatExpiry(card.expiry))}</strong></span></div></div><div class="saved-payment-actions"><span class="profile-payment-badge">${index === 0 ? "Principal" : "Guardada"}</span><button class="button button--secondary payment-remove-button" type="button" data-remove-card="${escapeHtml(card.id)}" aria-label="Eliminar tarjeta ${escapeHtml(card.brand)} terminada en ${escapeHtml(card.last4)}">Eliminar</button></div></article>`).join("");
};
const setPaymentFormOpen = (open) => {
  paymentForm.classList.toggle("is-hidden", !open);
  togglePaymentForm.setAttribute("aria-expanded", String(open));
  if (open) paymentForm.elements.namedItem("holder").focus();
  else paymentForm.reset();
};

renderCards();
togglePaymentForm.addEventListener("click", () => setPaymentFormOpen(paymentForm.classList.contains("is-hidden")));
document.querySelector("#cancel-payment-form").addEventListener("click", () => setPaymentFormOpen(false));
paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(paymentForm));
  const digits = data.number.replace(/\D/g, "");
  const numberInput = paymentForm.elements.namedItem("number");
  if (digits.length < 13 || digits.length > 19) {
    numberInput.setCustomValidity("Ingresa un número de tarjeta válido.");
    numberInput.reportValidity();
    return;
  }
  const [year, month] = data.expiry.split("-").map(Number);
  if (new Date(year, month - 1) < new Date(new Date().getFullYear(), new Date().getMonth())) {
    expiryInput.setCustomValidity("La fecha de vencimiento debe ser futura.");
    expiryInput.reportValidity();
    return;
  }
  numberInput.setCustomValidity("");
  expiryInput.setCustomValidity("");
  cards = [...cards, {
    id: crypto.randomUUID(),
    brand: data.brand,
    last4: digits.slice(-4),
    holder: data.holder.trim(),
    expiry: data.expiry,
  }];
  window.Hogario.write("hogario-payment-cards", cards);
  renderCards();
  setPaymentFormOpen(false);
});
paymentForm.elements.namedItem("number").addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));
expiryInput.addEventListener("input", () => expiryInput.setCustomValidity(""));
paymentList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-card]");
  if (!button) return;
  const card = cards.find((item) => item.id === button.dataset.removeCard);
  if (!card || !window.confirm(`¿Eliminar la tarjeta ${card.brand} terminada en ${card.last4}?`)) return;
  cards = cards.filter((item) => item.id !== card.id);
  window.Hogario.write("hogario-payment-cards", cards);
  renderCards();
});
