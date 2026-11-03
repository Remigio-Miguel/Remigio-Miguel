(() => {
  // Detectar automáticamente si estamos en GitHub Pages (ej. /Remigio-Miguel/) o en raíz local
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  // Si el primer segmento no es una carpeta de nuestra app, asumimos que es el nombre del repositorio en GitHub
  const repoName = (pathSegments.length > 0 && !["buscar-servicio", "calificar", "mi-perfil", "mis-solicitudes", "perfil-tecnico", "reservar", "resultados", "servicios"].includes(pathSegments[0])) 
    ? `/${pathSegments[0]}` 
    : "";

  // Calcular cuántos niveles debemos subir usando "../" basándose en la profundidad actual
  const isSubpage = window.location.pathname.includes("/buscar-servicio/") ||
                    window.location.pathname.includes("/calificar/") ||
                    window.location.pathname.includes("/mi-perfil/") ||
                    window.location.pathname.includes("/mis-solicitudes/") ||
                    window.location.pathname.includes("/perfil-tecnico/") ||
                    window.location.pathname.includes("/reservar/") ||
                    window.location.pathname.includes("/resultados/") ||
                    window.location.pathname.includes("/servicios/");

  const prefix = isSubpage ? "../" : `${repoName}/` || "./";

  const sitePath = (path) => {
    // Si la ruta empieza con barra, la adaptamos al repositorio o raíz real
    if (path.startsWith("/")) {
      return `${repoName}${path}`;
    }
    return isSubpage ? `../${path}` : `${repoName}/${path}`.replace(/\/+/g, "/");
  };

  const primary = [
    ["Inicio", `${repoName}/` || "./"],
    ["Servicios", `${repoName}/servicios/` || "../servicios/"],
    ["Buscar servicio", `${repoName}/buscar-servicio/` || "../buscar-servicio/"],
  ];
  const account = [
    ["Mis solicitudes", `${repoName}/mis-solicitudes/` || "../mis-solicitudes/"],
    ["Mi perfil", `${repoName}/mi-perfil/` || "../mi-perfil/"],
  ];
  const footerGroups = [
    ["Explorar", [["Inicio", `${repoName}/`], ["Servicios", `${repoName}/servicios/`], ["Buscar servicio", `${repoName}/buscar-servicio/`]]],
    ["Mi cuenta", [["Mis solicitudes", `${repoName}/mis-solicitudes/`], ["Mi perfil", `${repoName}/mi-perfil/`]]],
  ];

  const currentPath = window.location.pathname;
  const navLink = ([label, href]) => `<a href="${href}"${currentPath.endsWith(href) || (href === `${repoName}/` && currentPath.endsWith("/")) ? ' aria-current="page"' : ""}>${label}</a>`;

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="header-main">
        <a class="brand" href="${repoName}/" aria-label="Tecnicos YA, inicio">
          <img src="${isSubpage ? "../logo.png" : "./logo.png"}" alt="Logo Tecnicos YA" class="brand-logo">
        </a>
        <nav class="main-nav" aria-label="Navegación principal">
          ${primary.map(navLink).join("")}
        </nav>
        <div class="header-actions">
          <a class="header-login" href="${repoName}/mis-solicitudes/index.html">Mis solicitudes</a>
          <a class="header-tech" href="${repoName}/mi-perfil/index.html">Mi perfil</a>
        </div>
      </div>
      <nav class="mobile-nav" aria-label="Navegación móvil">
        ${[...primary, ...account].map(navLink).join("")}
      </nav>
    `;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          ${footerGroups.map(([title, links]) => `
            <section class="footer-group">
              <h2>${title}</h2>
              ${links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
            </section>
          `).join("")}
        </div>
        <div class="footer-bottom">
          <span>Tecnicos YA · Marketplace para el hogar · Lima</span>
          <div class="footer-legal">
            <span>Prototipo académico · Lima</span>
          </div>
        </div>
      </div>
    `;
  }

  const read = (key, fallback = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  
  const toast = (message) => {
    const previous = document.querySelector(".toast-message");
    previous?.remove();
    const el = document.createElement("div");
    el.className = "toast-message";
    el.setAttribute("role", "status");
    el.textContent = message;
    document.body.append(el);
    window.setTimeout(() => el.remove(), 3000);
  };

  window.Hogario = { read, write, toast, url: sitePath };
})();