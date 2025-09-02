// Esperar a que cargue todo
document.addEventListener("DOMContentLoaded", () => {
  const nombre = document.getElementById("nombre");
  const edad = document.getElementById("edad");
  const genero = document.getElementById("genero");
  const checkbox = document.getElementById("cbx-46");
  const boton = document.getElementById("btn-conectar");

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
    } else {
      boton.style.backgroundColor = "#d9dce0";
      boton.style.pointerEvents = "none";
      boton.style.opacity = "0.5";
      boton.disabled = true;
    }
  }

  // Escuchar cambios
  [nombre, edad, genero, checkbox].forEach(el => {
    el.addEventListener("input", validar);
    el.addEventListener("change", validar);
  });

  // Enviar los datos al backend cuando se hace clic en "Conectar a Internet"
  boton.addEventListener("click", async () => {
    const data = new URLSearchParams();
    data.append("nombre", nombre.value.trim());
    data.append("edad", edad.value);
    data.append("genero", genero.value);

    try {
      const response = await fetch("/api/encuesta", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
      });

      const result = await response.json();

      if (result.redireccion) {
        window.location.href = result.redireccion;
      } else {
        alert("Gracias por participar. No se encontró redirección.");
      }
    } catch (err) {
      console.error("Error al enviar la encuesta:", err);
      alert("Ocurrió un error al enviar los datos. Intenta de nuevo.");
    }
  });
});