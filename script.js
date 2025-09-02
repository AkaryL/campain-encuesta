// Esperar a que cargue todo
document.addEventListener("DOMContentLoaded", () => {
  const nombre = document.getElementById("nombre");
  const edad = document.getElementById("edad");
  const genero = document.getElementById("genero");
  const checkbox = document.getElementById("cbx-46");
  const boton = document.querySelector(".bottom-footer");
  const text = document.querySelector(".text-footer");

  // al inicio deshabilitado (color gris + sin clicks)
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
});
