/*
 * =============================================
 * EL AMIGO - VALIDACIÓN DEL FORMULARIO
 * =============================================
 * Funcionalidades:
 * - Validación mediante evento submit.
 * - Validación adicional con JavaScript.
 * - Manipulación del DOM para mostrar mensajes.
 * - Restablecimiento del formulario.
 */

// Seleccionamos el formulario mediante el DOM.
const formulario = document.querySelector("form");


// EVENTO SUBMIT
// =============================================
// Evita el envío real del formulario y valida
// los datos ingresados por el usuario.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // Valida que el nombre tenga al menos 3 caracteres.
    if (nombre.length < 3) {
        mostrarMensaje(
            "El nombre debe tener al menos 3 caracteres.",
            "error"
        );
        return;
    }

    // Valida que el correo tenga un formato básico válido.
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
        mostrarMensaje(
            "Ingresa un correo electrónico válido.",
            "error"
        );
        return;
    }

    // Valida que el mensaje tenga al menos 5 caracteres.
    if (mensaje.length < 5) {
        mostrarMensaje(
            "El mensaje debe tener al menos 5 caracteres.",
            "error"
        );
        return;
    }

    // Si todas las validaciones son correctas,
    // se muestra un mensaje de confirmación.
    mostrarMensaje(
        "¡Gracias, " + nombre + "! Tu mensaje fue enviado correctamente.",
        "exito"
    );

    // Limpia los campos del formulario.
    formulario.reset();
});

// EVENTO RESET
// =============================================
// Elimina el mensaje dinámico cuando el usuario
// restablece nuevamente el formulario.
formulario.addEventListener("reset", function () {
    const mensajeAnterior = document.getElementById("mensaje-formulario");

    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
});

// MANIPULACIÓN DEL DOM
// =============================================
// Crea dinámicamente un elemento <p> y lo agrega
// después de los campos del formulario.
function mostrarMensaje(texto, tipo) {
    const mensajeAnterior = document.getElementById("mensaje-formulario");

    // Evita que se acumulen varios mensajes.
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    // Crea un nuevo elemento mediante JavaScript.
    const mensaje = document.createElement("p");

    mensaje.id = "mensaje-formulario";
    mensaje.textContent = texto;
    mensaje.classList.add("mensaje-formulario", tipo);

    // Agrega el mensaje dinámicamente al formulario.
    formulario.appendChild(mensaje);
}