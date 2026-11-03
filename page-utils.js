
const assetUrl = (path) => {
  const isGitHubPages = window.location.hostname.includes("github.io");
  const repoPrefix = isGitHubPages ? "/Remigio-Miguel" : "";
  const cleanPath = path.replace(/^\/+/, "");

  return `${repoPrefix}/${cleanPath}`;
};

window.HogarioPages = {
  technicians: {
    carlos: {
      name: "Carlos Mendoza",
      specialty: "Gasfitería y reparaciones",
      district: "Surco",
      rating: "4.9",
      reviews: "32 reseñas",
      price: "S/ 80 — 140",
      available: "Disponible hoy · 2:00 pm",
      experience: "8 años",
      image: assetUrl("technician-carlos.jpeg"),
      services: ["Fugas de agua", "Instalación de grifería", "Mantenimiento"],
      categories: ["Gasfitería", "Reparaciones", "Instalaciones"]
    },

    maria: {
      name: "María Torres",
      specialty: "Instalaciones eléctricas",
      district: "San Borja",
      rating: "4.8",
      reviews: "27 reseñas",
      price: "S/ 70 — 120",
      available: "Mañana · 9:00 am",
      experience: "6 años",
      image: assetUrl("technician-maria.jpeg"),
      services: ["Instalaciones", "Reparaciones eléctricas", "Iluminación"],
      categories: ["Electricidad", "Instalaciones"]
    },

    luis: {
      name: "Luis Ramírez",
      specialty: "Mantenimiento del hogar",
      district: "Miraflores",
      rating: "4.7",
      reviews: "19 reseñas",
      price: "S/ 90 — 160",
      available: "Disponible hoy",
      experience: "10 años",
      image: assetUrl("technician-luis.jpeg"),
      services: ["Reparaciones", "Mantenimiento", "Instalaciones"],
      categories: ["Mantenimiento", "Reparaciones", "Limpieza", "Carpintería"]
    }
  },

  selectedTechnician() {
    const id =
      new URLSearchParams(location.search).get("tecnico") ||
      sessionStorage.getItem("hogario-selected-technician") ||
      this.booking()?.technician ||
      "carlos";

    return {
      id,
      ...(this.technicians[id] || this.technicians.carlos)
    };
  },

  booking() {
    return window.Hogario.read("hogario-booking", null);
  },

  saveBooking(value) {
    window.Hogario.write("hogario-booking", value);
  },

  money(value) {
    return value || "S/ 80 — 140";
  }
};
