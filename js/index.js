
/*
 * EVENTO CLICK Y MANIPULACIÓN DEL DOM
 * Muestra una recomendación de producto cuando el usuario presiona el botón.
 * El contenido se crea dinámicamente para demostrar el uso del DOM.
 */
const botonRecomendacion = document.getElementById("btn-recomendacion");
const resultadoRecomendacion = document.getElementById("resultado-recomendacion");

botonRecomendacion.addEventListener("click", function () {
    resultadoRecomendacion.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "🎧 Te recomendamos Audífonos Razer Blackshark V2";

    const descripcion = document.createElement("p");
    descripcion.textContent = "Una buena alternativa para gaming gracias a su sonido inmersivo y comodidad.";

    const enlace = document.createElement("a");
    enlace.href = "producto.html?categoria=audifonos";
    enlace.textContent = "Ver audífonos →";

    resultadoRecomendacion.appendChild(titulo);
    resultadoRecomendacion.appendChild(descripcion);
    resultadoRecomendacion.appendChild(enlace);
});

/*
 * EVENTO MOUSEOVER
 * Visual a las tarjetas de ofertas y categorías al pasar el mouse.*/

document.querySelectorAll(".oferta-card, .categoria-card").forEach(function (elemento) {
    elemento.addEventListener("mouseover", function () {
        elemento.classList.add("elemento-hover");
    });

    elemento.addEventListener("mouseout", function () {
        elemento.classList.remove("elemento-hover");
    });
});
