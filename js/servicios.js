
import { loadPage } from "./pageMenu.js";

const BADGE_FEEDBACK_TIME = 2000; // ms

export function initServicios() {

    const form = document.getElementById("form-servicio");
    if (!form) return; // No estamos en registrar

    form.addEventListener("submit", e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const modo = form.dataset.modo || "registrar";

      const selectTipo = form.tipo;
      const tipoValor = selectTipo.value;
      const tipoTexto = selectTipo.selectedOptions[0].text;
      const tarifaTexto = document.getElementById("tarifaBase").value;
      const tarifaNumero = parseFloat(
        tarifaTexto.replace(/[^0-9.]/g, "")
      );
      const status = document.getElementById("servicioActivo") ? "Si" : "No";

      const servicio = {
        codigo: form.codigo.value,
        nombre: form.nombre.value,
        tipoValor: tipoValor,   // para backend
        tipoTexto: tipoTexto,   // para UI
        tarifaBase: tarifaNumero,
        tarifaTexto: tarifaTexto,
        status: status
      };


      // Mostrar datos en el aviso (modal)
      document.getElementById("cCodigo").textContent = servicio.codigo;
      document.getElementById("cNombre").textContent = servicio.nombre;
      document.getElementById("cTipo").textContent = servicio.tipoTexto;
      document.getElementById("cTarifa").textContent = servicio.tarifaTexto;
      if (modo === "editar") document.getElementById("status").textContent = servicio.status;

      document
        .getElementById("confirmServicio")
        .classList
        .remove("hidden");
      // Guardar temporalmente
      window._servicioPendiente = servicio;

    });

}

document.addEventListener("click", e => {
  if (e.target.id === "btnCancelar") {
    document.getElementById("confirmServicio").classList.add("hidden");

    setEstadoServicio("danger");
    setTimeout(() => {
      resetEstadoServicio();
    }, BADGE_FEEDBACK_TIME);
    window._servicioPendiente = null;

    return

  }

  if (e.target.id === "btnConfirmar") {

    document.getElementById("confirmServicio").classList.add("hidden");
    setEstadoServicio("success", window._servicioPendiente);
    limpiarFormularioServicio();
    setTimeout(() => {
      resetEstadoServicio();
    }, BADGE_FEEDBACK_TIME);
    window._servicioPendiente = null;

    // Aquí luego va fetch()

    return
  }

  if (e.target.id !== "btnConfirmarEliminar") return;

  const ctx = window._resultadoContext;
  if (!ctx) return;

  // Cerrar modal
  document
    .getElementById("confirmServicio")
    ?.classList.add("hidden");

  if (ctx.accion === "eliminar") {
    console.log("Eliminar servicio confirmado. Llamado a loadPage a resultado_accion.html");
    loadPage("pages/resultado_accion.html");
  }
});

function setEstadoServicio(tipoEstado, servicio) {
  const badge = document.getElementById("estadoServicio");
  if (!badge) return;

  badge.className = `badge badge-${tipoEstado}`;

  if (tipoEstado === "success" && servicio) {
    badge.innerHTML = `
            Servicio registrado:
            <strong>${servicio.codigo}</strong> –
            ${servicio.nombre}
            <span>(${servicio.tipoTexto})</span> |
            ${servicio.tarifaTexto}
        `;
  }
  else if (tipoEstado === "warning") {
    badge.textContent = "Pendiente de confirmación del registro";
  }
  else if (tipoEstado === "danger") {
    badge.textContent = "Registro cancelado";
  }
}

function limpiarFormularioServicio() {
  const form = document.getElementById("form-servicio");
  if (!form) return;

  form.reset();

  // Limpieza específica
  const tarifa = document.getElementById("tarifaBase");
  if (tarifa) tarifa.value = "";

  // Quitar validaciones visuales si existen
  form.querySelectorAll(".error").forEach(el => {
    el.classList.remove("error");
  });

  // Accesibilidad: foco al primer campo
  form.querySelector("input, select, textarea")?.focus();
}

function resetEstadoServicio() {
  const badge = document.getElementById("estadoServicio");
  if (!badge) return;

  badge.className = "badge badge-info";
  badge.textContent = "Complete el formulario para registrar el servicio";
}

export function initEliminarServicio() {

  const btnEliminarServicio =
    document.getElementById("btnEliminarServicio");

  if (!btnEliminarServicio) return;

  btnEliminarServicio.addEventListener("click", () => {

    // Obtener datos DESDE el HTML de eliminación
    const codigo =
      document.getElementById("codigoServicio")?.textContent || "";
    const nombre =
      document.getElementById("nombreServicio")?.textContent || "";
    const tipo =
      document.getElementById("tipoServicio")?.textContent || "";
    const tarifa =
      document.getElementById("tarifaServicio")?.textContent || "";
    const activo =
      document.getElementById("activoServicio")?.textContent || "";

    // Reutilizar el modal
    document.querySelector("#confirmServicio h3").textContent =
      "Confirmar eliminación";

    document.getElementById("cCodigo").textContent = codigo;
    document.getElementById("cNombre").textContent = nombre;
    document.getElementById("cTipo").textContent = tipo;
    document.getElementById("cTarifa").textContent = tarifa;
    document.getElementById("status").textContent = activo;

    window._accionPendiente = "eliminar";

    // Dentro del click de "Eliminar servicio"
    window._resultadoContext = {
      accion: "eliminar",
      modulo: "servicios",
      returnUrl: "pages/catalogo/servicios.html",
      titulo: "Eliminar servicio",
      tituloMensaje: "Servicio eliminado",
      textoMensaje: "El servicio ha sido eliminado correctamente y ya no se encuentra disponible."
    };

    document
      .getElementById("confirmServicio")
      .classList
      .remove("hidden");

  });
}
