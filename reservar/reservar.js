
const params = new URLSearchParams(location.search);

const technicianId =
  params.get("tecnico") ||
  sessionStorage.getItem("hogario-selected-technician") ||
  window.HogarioPages.booking()?.technician ||
  "carlos";

const technician =
  window.HogarioPages.technicians[technicianId] ||
  window.HogarioPages.technicians.carlos;

// Información del técnico
document.querySelector("#booking-image").src = technician.image;
document.querySelector("#booking-image").alt = technician.name;

document.querySelector("#booking-name").textContent =
  technician.name;

document.querySelector("#booking-specialty").textContent =
  `${technician.specialty} · ${technician.district}`;

document.querySelector("#booking-price").textContent =
  technician.price;

// Volver al perfil del técnico
document.querySelector("#back-profile").href =
  `${window.Hogario.route("perfil-tecnico")}?tecnico=${technicianId}`;

// Servicio seleccionado
const serviceParam =
  params.get("servicio") ||
  sessionStorage.getItem("hogario-selected-service");

const serviceSelect = document.querySelector("#booking-service");

if (
  serviceParam &&
  [...serviceSelect.options].some(
    (option) =>
      option.value === serviceParam ||
      option.text === serviceParam
  )
) {
  serviceSelect.value = serviceParam;
}

// Distrito del técnico
const districtSelect = document.querySelector("#booking-district");

if (
  [...districtSelect.options].some(
    (option) =>
      option.value === technician.district ||
      option.text === technician.district
  )
) {
  districtSelect.value = technician.district;
}

// Recuperar solicitud guardada
const saved = window.HogarioPages.booking();

if (saved) {
  for (const [key, value] of Object.entries(saved)) {
    const field = document.querySelector(`[name="${key}"]`);

    if (field && value) {
      field.value = value;
    }
  }
}

// Enviar solicitud
document.querySelector("#booking-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(
    new FormData(event.currentTarget)
  );

  window.HogarioPages.saveBooking({
    ...data,
    technician: technicianId,
    status: "Pendiente"
  });

  window.location.href =
    window.Hogario.route("mis-solicitudes");
});
