// =============================================
// EL AMIGO - INTERACTIVIDAD DE PRODUCTOS
// =============================================

// Obtenemos los elementos del DOM utilizados por el filtro.
const buscadorProductos = document.getElementById("buscador-productos");
const filtroCategoria = document.getElementById("filtro-categoria");
const botonFiltrarProductos = document.getElementById("btn-filtrar-productos");
const botonLimpiarProductos = document.getElementById("btn-limpiar-productos");

/*
 * EVENTO CLICK
 * Filtra los productos según el nombre escrito y la categoría seleccionada.
 */
botonFiltrarProductos.addEventListener("click", function () {

    aplicarFiltroProductos();

});

/*
 * EVENTO CLICK
 * Limpia el buscador y restablece la categoría
 * para volver a mostrar todos los productos.
 */
botonLimpiarProductos.addEventListener("click", function () {

    buscadorProductos.value = "";
    filtroCategoria.value = "todas";

    aplicarFiltroProductos();

});

/*
 * FUNCIÓN REUTILIZABLE
 * Compara el texto y la categoría seleccionada
 * con cada tarjeta del catálogo.
 */
function aplicarFiltroProductos() {

    const textoBuscado =
        buscadorProductos.value.toLowerCase().trim();

    const categoriaSeleccionada =
        filtroCategoria.value;

    const productos =
        document.querySelectorAll(".tarjeta-producto");

    productos.forEach(function (producto) {

        const contenidoProducto =
            producto.textContent.toLowerCase();

        const categoriaProducto =
            producto.dataset.categoria;

        const coincideNombre =
            contenidoProducto.includes(textoBuscado);

        const coincideCategoria =
            categoriaSeleccionada === "todas" ||
            categoriaProducto === categoriaSeleccionada;

        producto.style.display =
            coincideNombre && coincideCategoria
                ? ""
                : "none";

    });
}

/*
 * CATEGORÍA DESDE LA PORTADA
 * Permite abrir producto.html desde una categoría
 * del index y aplicar automáticamente el filtro correspondiente.
 */
const parametrosURL =
    new URLSearchParams(window.location.search);

const categoriaURL =
    parametrosURL.get("categoria");

if (["teclados", "audifonos", "mouse"].includes(categoriaURL)) {

    filtroCategoria.value = categoriaURL;

    aplicarFiltroProductos();

}

/*
 * EVENTO MOUSEOVER
 * Agrega un pequeño efecto visual cuando el usuario
 * pasa el mouse sobre una tarjeta de producto.
 */
const productos =
    document.querySelectorAll(".tarjeta-producto");

productos.forEach(function (producto) {

    producto.addEventListener("mouseover", function () {

        producto.classList.add("producto-hover");

    });

    producto.addEventListener("mouseout", function () {

        producto.classList.remove("producto-hover");

    });

});

/*
 * EVENTO CLICK
 * Abre un modal centrado con la información
 * completa del producto seleccionado.
 */
productos.forEach(function (producto) {

    producto.addEventListener("click", function () {

        abrirModalProducto(producto);

    });

});

/*
 * MANIPULACIÓN DEL DOM
 * Creamos dinámicamente el modal utilizando
 * createElement() y appendChild().
 */
function abrirModalProducto(producto) {

    // Creamos el fondo oscuro del modal.
    const modal =
        document.createElement("div");

    modal.classList.add("modal-producto");

    // Creamos el contenido central.
    const contenido =
        document.createElement("div");

    contenido.classList.add(
        "modal-producto-contenido"
    );

    // Creamos el botón de cerrar.
    const botonCerrar =
        document.createElement("button");

    botonCerrar.classList.add(
        "modal-producto-cerrar"
    );

    botonCerrar.type = "button";

    botonCerrar.textContent = "×";

    botonCerrar.setAttribute(
        "aria-label",
        "Cerrar información del producto"
    );

    // Obtenemos los datos originales del producto.
    const imagenOriginal =
        producto.querySelector("img");

    const tituloOriginal =
        producto.querySelector("figcaption");

    const descripcionOriginal =
        producto.querySelector(
            ".card-body > p:not(.precio-producto)"
        );

    const precioOriginal =
        producto.querySelector(".precio-producto");

    // Creamos la imagen grande.
    const imagen =
        document.createElement("img");

    imagen.src =
        imagenOriginal.src;

    imagen.alt =
        imagenOriginal.alt;

    // Creamos el título.
    const titulo =
        document.createElement("h2");

    titulo.textContent =
        tituloOriginal.textContent.trim();

    // Creamos la descripción.
    const descripcion =
        document.createElement("p");

    descripcion.classList.add(
        "modal-descripcion-producto"
    );

    descripcion.textContent =
        descripcionOriginal.textContent.trim();

    // Creamos el precio.
    const precio =
        document.createElement("p");

    precio.classList.add(
        "modal-precio-producto"
    );

    // Copiamos el contenido del precio original.
    Array.from(precioOriginal.childNodes).forEach(function (nodo) {

        precio.appendChild(
            nodo.cloneNode(true)
        );

    });

    // Construimos el contenido del modal.
    contenido.appendChild(botonCerrar);
    contenido.appendChild(imagen);
    contenido.appendChild(titulo);
    contenido.appendChild(descripcion);
    contenido.appendChild(precio);

    // Agregamos el contenido al modal.
    modal.appendChild(contenido);

    // Agregamos el modal al body.
    document.body.appendChild(modal);

    // Bloqueamos el desplazamiento de la página.
    document.body.style.overflow = "hidden";

    /*
     * EVENTO CLICK
     * Cierra el modal mediante el botón X.
     */
    botonCerrar.addEventListener("click", function () {

        cerrarModalProducto(modal);

    });

    /*
     * EVENTO CLICK
     * Cierra el modal al hacer clic fuera del contenido.
     */
    modal.addEventListener("click", function (evento) {

        if (evento.target === modal) {

            cerrarModalProducto(modal);

        }

    });

}

/*
 * FUNCIÓN REUTILIZABLE
 * Cierra el modal y restaura el desplazamiento
 * normal de la página.
 */
function cerrarModalProducto(modal) {

    modal.remove();

    document.body.style.overflow = "";

}