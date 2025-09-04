document.addEventListener("DOMContentLoaded", () => {
  const nombre   = document.getElementById("nombre");
  const edadSel  = document.getElementById("edad");           // ahora es <select>
  const generoSel = document.getElementById("genero");        // puede no existir
  const identidadRadios = document.querySelectorAll('input[name="identidad"]'); // radios, si existen
  const checkbox = document.getElementById("cbx-46");
  const boton    = document.getElementById("btn-conectar");
  const text     = document.querySelector(".text-footer");    // puede no existir

  const edadError   = document.getElementById("edad-error");
  const nombreError = document.getElementById("nombre-error");

  const tiempoInicio = Date.now();
  const user_agent = navigator.userAgent;

  // ---- utils
  function getGenero() {
    // 1) Si hay <select id="genero">
    if (generoSel) return generoSel.value || "";
    // 2) Si hay radios name="identidad"
    if (identidadRadios && identidadRadios.length) {
      const r = Array.from(identidadRadios).find(x => x.checked);
      return r ? r.value : "";
    }
    return "";
  }

  // ---- validaciones
  function validarEdad(){
    if (!edadSel) return true; // si no hay campo, no bloquea
    const val = edadSel.value;

    if (!val) {
      edadError.textContent = "Selecciona un rango de edad.";
      edadSel.setCustomValidity("Selecciona un rango");
      return false;
    }

    // valores permitidos (opcional, por seguridad)
    const permitidos = ["00-12","13-17","18-24","25-34","35-44","45-54","55-64","65+"];
    if (!permitidos.includes(val)) {
      edadError.textContent = "Selecciona un rango válido.";
      edadSel.setCustomValidity("Valor inválido");
      return false;
    }

    edadError.textContent = "";
    edadSel.setCustomValidity("");
    return true;
  }

  function validarNombre(){
    const v = (nombre?.value || "").trim().replace(/\s+/g, " ");
    if (v === "") { 
      nombreError.textContent = ""; 
      nombre?.setCustomValidity(""); 
      return false; 
    }
    const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(v);
    const partes = v.split(" ");
    const dosPalabras = partes.length >= 2 && partes[0].length >= 2 && partes[1].length >= 2;

    if (!soloLetras){ 
      nombreError.textContent = "Usa solo letras y espacios."; 
      nombre?.setCustomValidity("Caracteres inválidos"); 
      return false; 
    }
    if (!dosPalabras){ 
      nombreError.textContent = "Escribe nombre y apellido."; 
      nombre?.setCustomValidity("Nombre incompleto"); 
      return false; 
    }
    nombreError.textContent = ""; 
    nombre?.setCustomValidity(""); 
    return true;
  }

  function validarGenero(){
    return getGenero() !== "";
  }

  function validar() {
    const ok = validarNombre() && validarEdad() && validarGenero() && (checkbox?.checked || false);

    if (boton){
      boton.disabled = !ok;
      boton.style.pointerEvents = ok ? "auto" : "none";
      boton.style.backgroundColor = ok ? "#2c39ee" : "#504c4c";
    }
    if (text){
      text.textContent = ok ? "Listo para conectar" : "Acepta los términos y condiciones para continuar";
      text.style.color = ok ? "#15db51" : "#46484d";
    }
  }

  // ---- eventos
  nombre?.addEventListener("input", () => { validarNombre(); validar(); });
  nombre?.addEventListener("change", () => { validarNombre(); validar(); });

  edadSel?.addEventListener("change", () => { validarEdad(); validar(); });

  if (generoSel){
    generoSel.addEventListener("input", validar);
    generoSel.addEventListener("change", validar);
  }
  if (identidadRadios && identidadRadios.length){
    identidadRadios.forEach(r => {
      r.addEventListener("input", validar);
      r.addEventListener("change", validar);
    });
  }

  checkbox?.addEventListener("input", validar);
  checkbox?.addEventListener("change", validar);

  // helper query param
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  validar(); // estado inicial

  // ---- envío
  boton?.addEventListener("click", async () => {
    const user_mac = getQueryParam("user_mac");
    const router_mac = getQueryParam("router_mac");
    const timeonscreen = Math.floor((Date.now() - tiempoInicio) / 1000);

    if (!user_mac || !router_mac) {
      alert("Faltan datos de conexión. Intenta recargar la página.");
      return;
    }

    const data = new URLSearchParams();
    data.append("nombre", (nombre?.value || "").trim());
    data.append("edad", edadSel?.value || "");           // ahora mandamos el rango (p.ej. "13-17")
    data.append("genero", getGenero());                  // radio o select, según exista
    data.append("timeonscreen", timeonscreen);
    data.append("user_agent", user_agent);

    try {
      const response = await fetch(`http://localhost:4000/api/v2/campaigns/encuesta?user_mac=${user_mac}&router_mac=${router_mac}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
