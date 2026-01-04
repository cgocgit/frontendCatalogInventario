import { initServicios, initEliminarServicio } from "./servicios.js";

const MENU_SECTIONS = {
  "pages/catalogo/servicios.html": "pages/catalogo/servicios.html",
  "pages/catalogo/servicios_registrar.html": "pages/catalogo/servicios.html",
  "pages/catalogo/servicios_ver.html": "pages/catalogo/servicios.html",
  "pages/catalogo/servicios_editar.html": "pages/catalogo/servicios.html",
  "pages/catalogo/servicios_eliminar.html": "pages/catalogo/servicios.html",
  
  "pages/home.html": "pages/home.html",
  "pages/inventario/inventario.html": "pages/inventario/inventario.html"
};

const pageInitializers = [
  initServicios,
  initEliminarServicio,
  initResultadoAccion
  /*,
  initInventario,
  initReportes*/
];

// Cargar página inicial al arrancar
document.addEventListener("DOMContentLoaded", () => {
  loadPage("pages/home.html");
});


document.addEventListener("click", e => {
  const link = e.target.closest("[data-page]");
  if (!link) return;

  e.preventDefault();
  console.trace("Traza");
  console.log("Link objetivo: ", link.dataset.page);
  loadPage(link.dataset.page);
});

function setSectionTitle(title) {
  const el = document.getElementById("sectionTitle");
  if (el) el.textContent = title;
}

function loadPage(url) {
  
  fetch(url)
    .then(response => response.text())
    .then(html => {
      const content = document.querySelector(".content");
      content.innerHTML = html;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const body = doc.querySelector("body");

      if (body && body.dataset.title && body.dataset.title === "Resultado de Acción") {
        console.log("Configurando título desde contexto de resultado de acción");
        const ctx = window._resultadoContext; 
        if (!ctx) setSectionTitle("Mesa Regia");
        console.log("Contexto de resultado de acción:", ctx.titulo);
        console.trace("Traza de setSectionTitle real");
        setSectionTitle(ctx.titulo);
      }
      if (body && body.dataset.title) {
        console.log("Configurando título de sección a:", body.dataset.title);
        console.trace("Traza de setSectionTitle");
        setSectionTitle(body.dataset.title);
      } else {
        setSectionTitle("Mesa Regia");
      }

      setActiveMenu(url);

      // ⬇️ CONTROL DE FOCO
      const focused = focusFirstControl(content);
      if (!focused) {
        focusIndexFallback();
      }

      // Inicializar módulo servicios si aplica
      pageInitializers.forEach(fn => fn());

      document.getElementById("estadoServicio");

    })
    .catch(err => console.error("Error cargando página:", err));
}

export {loadPage};

function setActiveMenu(url) {
  const activeUrl = MENU_SECTIONS[url] || url;

  document.querySelectorAll(".menu-link").forEach(link => {
    link.classList.remove("active");

    if (link.dataset.url === activeUrl) {
      link.classList.add("active");
    }
  });
}

function initResultadoAccion() {

  const titulo = document.getElementById("resultadoTitulo");
  const mensaje = document.getElementById("resultadoMensaje");
  const btnAceptar = document.getElementById("btnResultadoAceptar");

  if (!titulo || !mensaje || !btnAceptar) return;

  const ctx = window._resultadoContext;
  if (!ctx) return;

  if (ctx.accion === "eliminar" && ctx.modulo === "servicios") {
    titulo.textContent = ctx.tituloMensaje;
    mensaje.textContent = ctx.textoMensaje;
  }

  btnAceptar.onclick = () => {
    loadPage(ctx.returnUrl);
  };
}