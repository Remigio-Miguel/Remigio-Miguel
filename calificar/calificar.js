const tech = window.HogarioPages.selectedTechnician();
const booking = window.HogarioPages.booking() || {};
document.querySelector("#rating-name").textContent = tech.name;
document.querySelector("#rating-image").src = tech.image;
document.querySelector("#rating-image").alt = tech.name;
document.querySelector("#rating-specialty").textContent = `${tech.specialty} · Servicio realizado`;
let rating = 0;
const buttons = [...document.querySelectorAll("[data-rating]")];
const ratingInput = document.querySelector("#rating-value");
const setRating = (value) => {
  rating = value;
  ratingInput.value = String(value);
  buttons.forEach((button) => {
    const active = Number(button.dataset.rating) <= rating;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelector("#rating-hint").textContent = `${value} de 5 estrellas`;
};
buttons.forEach((button) => button.addEventListener("click", () => setRating(Number(button.dataset.rating))));
document.querySelector("#rating-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!rating) {
    document.querySelector("#rating-hint").textContent = "Selecciona una calificación antes de continuar.";
    buttons[0].focus();
    return;
  }
  const data = Object.fromEntries(new FormData(event.currentTarget));
  window.Hogario.write("hogario-rating", { ...data, technician: tech.id, technicianName: tech.name, date: new Date().toISOString() });
  const success = document.querySelector("#rating-success");
  success.textContent = `Gracias por calificar a ${tech.name}. Tu reseña quedó guardada en este navegador.`;
  success.classList.remove("is-hidden");
});
if (booking.technician && !new URLSearchParams(location.search).has("tecnico")) history.replaceState(null, "", `?tecnico=${booking.technician}`);
