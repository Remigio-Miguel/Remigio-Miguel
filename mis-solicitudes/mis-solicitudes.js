
const list = document.querySelector("#request-list");

// Evitar que los datos ingresados se interpreten como HTML
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

// Recuperar información guardada
const booking = window.HogarioPages.booking();
const rating = window.Hogario.read("hogario-rating");

const items = booking ? [booking] : [];

// Actualizar cantidad de solicitudes
document.querySelector("#request-total").textContent =
  `${items.length} ${items.length === 1 ? "solicitud" : "solicitudes"}`;

// Mostrar mensaje si no existen solicitudes
if (!items.length) {

  list.innerHTML = `
    <div class="empty-state">
      <strong>Todavía no tienes solicitudes.</strong>
      <br>
      Cuando reserves un servicio, aparecerá aquí con sus detalles.
    </div>
  `;

} else {

  list.innerHTML = items.map((item) => {

    const technician =
      window.HogarioPages.technicians[item.technician] ||
      window.HogarioPages.technicians.carlos;

    const date = item.fecha
      ? new Date(`${item.fecha}T12:00:00`).toLocaleDateString(
          "es-PE",
          {
            day: "numeric",
            month: "short"
          }
        )
      : "Fecha por confirmar";

    const rated = rating?.technician === item.technician;

    return `
      <article class="card request-row">

        <div class="request-description">

          <span class="request-category">
            ${escapeHtml(item.servicio)} · ${escapeHtml(technician.name)}
          </span>

          <p>
            ${escapeHtml(item.problema || "Solicitud enviada")}
          </p>

          <div class="search-summary">

            <span class="pill">
              ${escapeHtml(item.distrito || technician.district)}
            </span>

            <span class="pill">
              ${escapeHtml(date)}${item.horario ? ` · ${escapeHtml(item.horario)}` : ""}
            </span>

            <span class="pill">
              ${escapeHtml(technician.price)}
            </span>

          </div>

        </div>

        <div class="request-controls">

          <span class="status">
            ${escapeHtml(item.status || "Pendiente")}
          </span>

          ${
            rated
              ? `
                <span class="field-hint">
                  Calificada · ${escapeHtml(rating.rating)}/5 ★
                </span>
              `
              : `
                <a
                  class="button button--secondary"
                  href="${window.Hogario.route("calificar")}?tecnico=${encodeURIComponent(item.technician)}"
                >
                  Calificar técnico
                </a>
              `
          }

        </div>

      </article>
    `;

  }).join("");

}
