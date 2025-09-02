document.addEventListener("DOMContentLoaded", () => {
  const nombre = document.getElementById("nombre");
  const edad = document.getElementById("edad");
  const genero = document.getElementById("genero");
  const checkbox = document.getElementById("cbx-46");
  const boton = document.querySelector(".bottom-footer");
  const text = document.querySelector(".text-footer");

  // Desactivar botón al inicio
  boton.style.pointerEvents = "none";
  boton.style.opacity = "0.5";

  function validar() {
    const lleno =
      nombre.value.trim() !== "" &&
      edad.value !== "" &&
      genero.value !== "" &&
      checkbox.checked;

    if (lleno) {
      boton.style.pointerEvents = "auto";
      boton.style.opacity = "1";
      boton.style.backgroundColor = "#2c39ee";
      boton.disabled = false;
      text.style.color = "#15db51ff";
      text.innerHTML = "Listo para conectar";
    } else {
      boton.style.backgroundColor = "#d9dce0";
      boton.style.pointerEvents = "none";
      boton.style.opacity = "0.5";
      boton.disabled = true;
      text.innerHTML = "Acepta los términos y condiciones para continuar";
      text.style.color = "#46484d";
    }
  }

  // Escuchar cambios
  [nombre, edad, genero, checkbox].forEach(el => {
    el.addEventListener("input", validar);
    el.addEventListener("change", validar);
  });

  // Función para obtener parámetros GET
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  const tiempoInicio = Date.now();

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