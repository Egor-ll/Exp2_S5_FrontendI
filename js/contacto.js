// =============================================
// EL AMIGO - VALIDACIÓN DEL FORMULARIO
// =============================================

// Seleccionamos el formulario mediante su elemento del DOM.
const formulario = document.querySelector("form");

/*
 * EVENTO SUBMIT
 * Evita el envío real del formulario y muestra un mensaje dinámico.
 */
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // Validación adicional mediante JavaScript.
    if (nombre.length < 3) {
        mostrarMensaje("El nombre debe tener al menos 3 caracteres.", "error");
        return;
    }

    if (!email.includes("@")) {
        mostrarMensaje("Ingresa un correo electrónico válido.", "error");
        return;
    }

    if (mensaje.length < 5) {
        mostrarMensaje("El mensaje debe tener al menos 5 caracteres.", "error");
        return;
    }

    mostrarMensaje(
        "¡Gracias, " + nombre + "! Tu mensaje fue enviado correctamente.",
        "exito"
    );

    formulario.reset();
});

/*
 * MANIPULACIÓN DEL DOM
 * Crea un elemento <p> dinámicamente y lo agrega después del formulario.
 */
function mostrarMensaje(texto, tipo) {
    const mensajeAnterior = document.getElementById("mensaje-formulario");

    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    const mensaje = document.createElement("p");
    mensaje.id = "mensaje-formulario";
    mensaje.textContent = texto;
    mensaje.classList.add("mensaje-formulario", tipo);

    formulario.appendChild(mensaje);
}
