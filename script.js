document.addEventListener("DOMContentLoaded", () => {
  const nombre   = document.getElementById("nombre");
  const edad     = document.getElementById("edad");
  const genero   = document.getElementById("genero");
  const checkbox = document.getElementById("cbx-46");
  const boton    = document.getElementById("btn-conectar"); // si prefieres, usa tu querySelector actual
  const text     = document.querySelector(".text-footer");
  const edadError    = document.getElementById("edad-error");
  const nombreError  = document.getElementById("nombre-error");

  function validarEdad(){
    const v = edad.value.trim();
    if (v === "") { edadError.textContent = ""; edad.setCustomValidity(""); return false; }
    const n = Number(v);
    if (!Number.isInteger(n)) { edadError.textContent = "Ingresa un número entero."; edad.setCustomValidity("Número inválido"); return false; }
    if (n < 1 || n > 120) { edadError.textContent = "La edad debe estar entre 1 y 120."; edad.setCustomValidity("Fuera de rango"); return false; }
    edadError.textContent = ""; edad.setCustomValidity(""); return true;
  }

  function validarNombre(){
    const v = nombre.value.trim().replace(/\s+/g, " ");
    if (v === "") { nombreError.textContent = ""; nombre.setCustomValidity(""); return false; }
    const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(v);
    const partes = v.split(" ");
    const dosPalabras = partes.length >= 2 && partes[0].length >= 2 && partes[1].length >= 2;
    if (!soloLetras){ nombreError.textContent = "Usa solo letras y espacios."; nombre.setCustomValidity("Caracteres inválidos"); return false; }
    if (!dosPalabras){ nombreError.textContent = "Escribe nombre y apellido."; nombre.setCustomValidity("Nombre incompleto"); return false; }
    nombreError.textContent = ""; nombre.setCustomValidity(""); return true;
  }

  function validar() {
    const ok = validarNombre() &&
               validarEdad() &&
               genero.value !== "" &&
               checkbox.checked;

    boton.disabled = !ok;
    boton.style.pointerEvents = ok ? "auto" : "none";
    boton.style.opacity = ok ? "1" : "0.5";
    boton.style.backgroundColor = ok ? "#2c39ee" : "#d9dce0";
    text.textContent = ok ? "Listo para conectar" : "Acepta los términos y condiciones para continuar";
    text.style.color = ok ? "#15db51" : "#46484d";
  }

  // eventos
  nombre.addEventListener("input", () => { validarNombre(); validar(); });
  nombre.addEventListener("change", () => { validarNombre(); validar(); });
  edad.addEventListener("input", () => { validarEdad(); validar(); });
  edad.addEventListener("change", () => { validarEdad(); validar(); });
  [genero, checkbox].forEach(el => {
    el.addEventListener("input",  validar);
    el.addEventListener("change", validar);
  });

  // Función para obtener parámetros GET
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  const tiempoInicio = Date.now();
  const user_agent = navigator.userAgent;

  validar(); // estado inicial

  // Enviar los datos al backend cuando se hace clic en "Conectar a Internet"
  boton.addEventListener("click", async () => {
    const user_mac = getQueryParam("user_mac");
    const router_mac = getQueryParam("router_mac");
    const timeonscreen = Math.floor((Date.now() - tiempoInicio) / 1000);

    if (!user_mac || !router_mac) {
      alert("Faltan datos de conexión. Intenta recargar la página.");
      return;
    }

    const data = new URLSearchParams();
    data.append("nombre", nombre.value.trim());
    data.append("edad", edad.value);
    data.append("genero", genero.value);
    data.append("timeonscreen", timeonscreen);
    data.append("user_agent", user_agent);

    try {
      const response = await fetch(`http://localhost:4000/api/v2/campaigns/encuesta?user_mac=${user_mac}&router_mac=${router_mac}`, {
        method: "POST", // ✅ CORREGIDO: usar POST
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
      });

      const result = await response.json();

      if (result.campaign || result.redireccion) {
        window.location.href = result.campaign || result.redireccion;
      } else {
        alert("Gracias por participar. No se encontró redirección.");
      }
    } catch (err) {
      console.error("Error al enviar la encuesta:", err);
      alert("Ocurrió un error al enviar los datos. Intenta de nuevo.");
    }
  });
});