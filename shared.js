
(() => {
  const isGitHubPages = window.location.hostname.includes("github.io");
  const repoPrefix = isGitHubPages ? "/Remigio-Miguel" : "";

  // Generador de rutas
  const route = (path = "") => {
    const cleanPath = path.replace(/^\/+|\/+$/g, "");

    return cleanPath
      ? `${repoPrefix}/${cleanPath}/index.html`
      : `${repoPrefix}/index.html`;
  };

  const primary = [
    ["Inicio", route()],
    ["Servicios", route("servicios")],
    ["Buscar servicio", route("buscar-servicio")],
  ];

  const account = [
    ["Mis solicitudes", route("mis-solicitudes")],
    ["Mi perfil", route("mi-perfil")],
  ];

  const footerGroups = [
    ["Explorar", primary],
    ["Mi cuenta", account],
  ];

  // Detectar página actual
  const currentPath = window.location.pathname.replace(/\/+$/, "");

  const navLink = ([label, href]) => {
    const normalizedHref = href.replace(/\/index\.html$/, "");
    const isActive =
      currentPath === normalizedHref ||
      currentPath === `${normalizedHref}/index.html`;

    return `<a href="${href}"${isActive ? ' aria-current="page"' : ""}>${label}</a>`;
  };

  // HEADER
  const header = document.querySelector("[data-site-header]");

  if (header) {
    header.className = "site-header";

    header.innerHTML = `
      <div class="header-main">

        <a class="brand" href="${route()}" aria-label="Tecnicos YA, inicio">

          <img
            src="${repoPrefix}/logo.png"
            alt="Logo Tecnicos YA"
            class="brand-logo"
            style="width: 38px; height: 38px; object-fit: cover; border-radius: 8px;"
          >

          <span>
            <span class="brand-name">
              Tecnicos YA<span style="color:var(--teal)">.</span>
            </span>

            <span class="brand-caption">
              marketplace de servicios
            </span>
          </span>

        </a>

        <nav class="main-nav" aria-label="Navegación principal">
          ${primary.map(navLink).join("")}
        </nav>

        <div class="header-actions">

          <a class="header-login" href="${route("mis-solicitudes")}">
            Mis solicitudes
          </a>

          <a class="header-tech" href="${route("mi-perfil")}">
            Mi perfil
          </a>

        </div>

      </div>

      <nav class="mobile-nav" aria-label="Navegación móvil">
        ${[...primary, ...account].map(navLink).join("")}
      </nav>
    `;
  }

  // FOOTER
  const footer = document.querySelector("[data-site-footer]");

  if (footer) {
    footer.className = "site-footer";

    footer.innerHTML = `
      <div class="container">

        <div class="footer-grid">

          ${footerGroups.map(([title, links]) => `
            <section class="footer-group">
              <h2>${title}</h2>

              ${links.map(([label, href]) =>
                `<a href="${href}">${label}</a>`
              ).join("")}

            </section>
          `).join("")}

        </div>

        <div class="footer-bottom">

          <span>
            Tecnicos YA · Marketplace para el hogar · Lima
          </span>

          <div class="footer-legal">
            <span>Prototipo académico · Lima</span>
          </div>

        </div>

      </div>
    `;
  }

  // LOCAL STORAGE
  const read = (key, fallback = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // NOTIFICACIONES
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

  // FUNCIONES GLOBALES
  window.Hogario = {
    read,
    write,
    toast,
    route,
  };

})();
