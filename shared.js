(() => {
  const routes = ["/buscar-servicio/index.html", "/calificar/index.html", "/mi-perfil/index.html", "/mis-solicitudes/index.html", "/perfil-tecnico/index.html", "/reservar/index.html", "/resultados/index.html", "/servicios/index.html"];
  const basePath = (() => {
    const pathname = window.location.pathname.replace(/index\.html$/, "");
    const route = routes.find((item) => pathname.endsWith(item));
    return route ? pathname.slice(0, -route.length).replace(/\/$/, "") : pathname.replace(/\/$/, "");
  })();
  const sitePath = (path) => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
  
  const primary = [
    ["Inicio", "/"],
    ["Servicios", "/servicios/"],
    ["Buscar servicio", "/buscar-servicio/"],
  ];
  const account = [
    ["Mis solicitudes", "/mis-solicitudes/"],
    ["Mi perfil", "/mi-perfil/"],
  ];
  const footerGroups = [
    ["Explorar", [["Inicio", "/"], ["Servicios", "/servicios/"], ["Buscar servicio", "/buscar-servicio/"]]],
    ["Mi cuenta", [["Mis solicitudes", "/mis-solicitudes/"], ["Mi perfil", "/mi-perfil/"]]],
  ];
  
  const pathname = window.location.pathname.slice(basePath.length).replace(/\/+$/, "") || "/";
  const navLink = ([label, href]) => `<a href="${sitePath(href)}"${pathname === href.replace(/\/+$/, "") || (href === "/" && pathname === "/") ? ' aria-current="page"' : ""}>${label}</a>`;
  
  document.querySelectorAll("[href^='/'], [src^='/'], [action^='/']").forEach((element) => {
    for (const attribute of ["href", "src", "action"]) {
      const value = element.getAttribute(attribute);
      if (value?.startsWith("/") && !value.startsWith("//")) element.setAttribute(attribute, sitePath(value));
    }
  });

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="header-main">
        <a class="brand" href="${sitePath("/")}" aria-label="Tecnicos YA, inicio">
          <!-- Aquí cargamos tu propia imagen con medidas adaptadas -->
          <img src="${sitePath("/logo.png")}" alt="Logo Tecnicos YA" class="brand-logo">

        </a>
        <nav class="main-nav" aria-label="Navegación principal">
          ${primary.map(navLink).join("")}
        </nav>
        <div class="header-actions">
          <a class="header-login" href="${sitePath("/mis-solicitudes/index.html")}">Mis solicitudes</a>
          <a class="header-tech" href="${sitePath("/mi-perfil/index.html")}">Mi perfil</a>
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
              ${links.map(([label, href]) => `<a href="${sitePath(href)}">${label}</a>`).join("")}
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