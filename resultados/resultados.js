
const technicians = window.HogarioPages.technicians;

const list = document.querySelector("#technician-list");
const params = new URLSearchParams(location.search);

const service =
  params.get("servicio") ||
  sessionStorage.getItem("hogario-selected-service") ||
  "Gasfitería";

const district = params.get("distrito") || "Lima";

const normalize = (value) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Descripción de resultados
document.querySelector("#result-description").textContent =
  `Opciones para ${service} en ${district}. Revisa precios, experiencia y opiniones antes de elegir.`;

// Filtro de distrito
const districtFilter = document.querySelector("#district-filter");

if (
  district !== "Lima" &&
  ![...districtFilter.options].some((option) => option.value === district)
) {
  districtFilter.add(
    new Option(`${district} · sin técnicos simulados`, district)
  );
}

districtFilter.value = district === "Lima" ? "" : district;

// Mostrar técnicos
const render = () => {
  const minRating = Number(
    document.querySelector('input[name="rating"]:checked')?.value || 0
  );

  const availableToday =
    document.querySelector('input[name="available"]').checked;

  const chosenDistrict = districtFilter.value;

  const sort = document.querySelector("#sort-results").value;

  const matches = Object.entries(technicians)
    .map(([id, tech]) => ({ id, ...tech }))
    .filter(
      (tech) =>
        tech.categories.some(
          (category) => normalize(category) === normalize(service)
        ) &&
        Number(tech.rating) >= minRating &&
        (!availableToday || tech.available.toLowerCase().includes("hoy")) &&
        (!chosenDistrict || tech.district === chosenDistrict)
    );

  // Ordenar resultados
  if (sort === "rating") {
    matches.sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  if (sort === "price") {
    matches.sort(
      (a, b) =>
        Number(a.price.match(/\d+/)[0]) -
        Number(b.price.match(/\d+/)[0])
    );
  }

  // Actualizar cantidades
  document.querySelector("#results-count").textContent =
    `${matches.length} ${
      matches.length === 1
        ? "técnico disponible"
        : "técnicos disponibles"
    }`;

  document.querySelector("#result-status").textContent =
    `${matches.length} profesionales`;

  // Generar tarjetas
  list.innerHTML = matches.length
    ? matches
        .map(
          (tech) => `
            <article class="technician-card">

              <img
                src="${tech.image}"
                alt="${tech.name}"
                loading="lazy"
              >

              <div class="technician-summary">

                <div class="tech-title">
                  <div>
                    <h2>${tech.name}</h2>
                    <p>${tech.specialty}</p>
                  </div>

                  <span class="status">✓ Verificado</span>
                </div>

                <div class="tech-meta">
                  <span>★ ${tech.rating} · ${tech.reviews}</span>
                  <span>${tech.district}</span>
                  <span>${tech.experience}</span>
                  <span>${tech.available}</span>
                </div>

              </div>

              <div class="tech-bottom">

                <div>
                  <span class="muted">Precio referencial</span>
                  <strong>${tech.price}</strong>
                </div>

                <a
                  class="button button--secondary"
                  href="${window.Hogario.route("perfil-tecnico")}?tecnico=${tech.id}"
                >
                  Ver perfil <span aria-hidden="true">↗</span>
                </a>

              </div>

            </article>
          `
        )
        .join("")
    : `
      <div class="empty-state">
        No encontramos técnicos con esos filtros.
        Prueba cambiando tu búsqueda.
      </div>
    `;
};

// Detectar selección de técnico
list.addEventListener("click", (event) => {
  const link = event.target.closest('a[href*="perfil-tecnico"]');

  if (!link) return;

  const technicianId = new URL(link.href).searchParams.get("tecnico");

  if (technicianId) {
    sessionStorage.setItem(
      "hogario-selected-technician",
      technicianId
    );
  }
});

// Actualizar cuando cambien los filtros
document
  .querySelectorAll(
    'input[name="rating"], input[name="available"], #district-filter, #sort-results'
  )
  .forEach((control) => {
    control.addEventListener("change", render);
  });

// Primera carga
render();
