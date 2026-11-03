
const tech = window.HogarioPages.selectedTechnician();

// Título de la página
document.title = `${tech.name} · Tecnicos YA`;

// Información del técnico
document.querySelector("#profile-name").textContent = tech.name;

document.querySelector("#profile-specialty").textContent =
  tech.specialty;

document.querySelector("#profile-image").src = tech.image;

document.querySelector("#profile-image").alt = tech.name;

document.querySelector("#profile-service").textContent =
  tech.specialty;

// Datos del técnico
document.querySelector("#profile-rating").textContent =
  `${tech.rating} / 5 · ${tech.reviews}`;

document.querySelector("#profile-experience").textContent =
  tech.experience;

document.querySelector("#profile-price").textContent =
  tech.price;

document.querySelector("#profile-availability").textContent =
  tech.available;

document.querySelector("#profile-district").textContent =
  tech.district;

// Servicios que realiza
document.querySelector("#profile-services").innerHTML =
  tech.services
    .map((service) => `<span class="pill">${service}</span>`)
    .join("");

// Botón para solicitar servicio
document.querySelector("#book-technician").href =
  `${window.Hogario.route("reservar")}?tecnico=${tech.id}`;
