// js/app.js

window.BADGE_FEEDBACK_TIME = 2000; // 2 segundos

window._resultadoContext = {
  modulo: null,      // servicios | productos | paquetes
  accion: null,      // eliminar | registrar | editar
  returnUrl: null,    // a dónde regresar
  tituloMensaje: null,
  textoMensaje: null
};


function setCurrentDate() {
  const el = document.getElementById("headerDate");
  if (!el) return;

  const now = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formatted = now.toLocaleDateString("es-MX", options);

  el.textContent = formatted;
}

function initLayout() {
  setCurrentDate();
  //loadPage("pages/home.html");
}

document.addEventListener("DOMContentLoaded", initLayout);

function focusFirstControl(container) {
  if (!container) return false;

  const selectors = "input, button, a[href]";
  const firstControl = container.querySelector(selectors);

  if (firstControl) {
    firstControl.focus();
    return true;
  }

  return false;
}

function focusIndexFallback() {
  const fallback = document.querySelector(".menu-link");
  if (fallback) fallback.focus();
}

document.addEventListener("input", e => {
  const input = e.target;

  if (!input.matches('input[data-currency="mxn"]')) return;

  let value = input.value.replace(/\D/g, "");

  if (!value) {
    input.value = "";
    return;
  }

  const number = (parseInt(value, 10) / 100).toFixed(2);

  input.value = `$ ${number} MXN`;
});

