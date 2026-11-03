document.querySelectorAll("[data-service]").forEach((card) => {
  card.addEventListener("click", () => {
    const selected = card.dataset.service;
    sessionStorage.setItem("hogario-selected-service", selected);
  });
});
