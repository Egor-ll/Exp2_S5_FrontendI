// =============================================
// EL AMIGO - INTERACTIVIDAD CON JAVASCRIPT
// =============================================

// Obtenemos los elementos del DOM de la página Games.
const buscador = document.getElementById("buscador-games");
const filtro = document.getElementById("filtro-plataforma");
const botonFiltrar = document.getElementById("btn-filtrar");
const botonLimpiar = document.getElementById("btn-limpiar");
const juegos = document.querySelectorAll(".games");

/*
 * EVENTO CLICK
 * Filtra los juegos escritos directamente en HTML
 * según nombre y plataforma.
 */
botonFiltrar.addEventListener("click", function () {

    const textoBuscado = buscador.value.toLowerCase().trim();
    const plataformaSeleccionada = filtro.value;

    juegos.forEach(function (juego) {

        const contenidoJuego = juego.textContent.toLowerCase();
        const plataformaJuego = juego.dataset.plataforma;

        const coincideNombre =
            contenidoJuego.includes(textoBuscado);

        const coincidePlataforma =
            plataformaSeleccionada === "todas" ||
            plataformaJuego === plataformaSeleccionada;

        juego.style.display =
            coincideNombre && coincidePlataforma
                ? ""
                : "none";
    });

    // Aplicamos los mismos criterios a los productos cargados mediante Fetch.
    filtrarProductosDinamicos(
        textoBuscado,
        plataformaSeleccionada
    );
});

/*
 * EVENTO CLICK
 * Restablece los filtros y vuelve a mostrar todos los productos.
 */
botonLimpiar.addEventListener("click", function () {

    buscador.value = "";
    filtro.value = "todas";

    juegos.forEach(function (juego) {
        juego.style.display = "";
    });

    document.querySelectorAll(".producto-api").forEach(function (producto) {
        producto.style.display = "";
    });
});

/*
 * EVENTO MOUSEOVER
 * Agrega un pequeño efecto visual cuando el usuario
 * pasa el mouse sobre una tarjeta.
 */
juegos.forEach(function (juego) {

    juego.addEventListener("mouseover", function () {
        juego.classList.add("juego-hover");
    });

    juego.addEventListener("mouseout", function () {
        juego.classList.remove("juego-hover");
    });
});

/*
 * EVENTO CLICK
 * Abre un modal centrado con la información completa
 * del juego seleccionado.
 */
juegos.forEach(function (juego) {

    juego.addEventListener("click", function () {
        abrirModalJuego(juego);
    });
});

/*
 * MANIPULACIÓN DEL DOM
 * Crea dinámicamente un modal utilizando createElement()
 * y appendChild() para mostrar la información del juego.
 */
function abrirModalJuego(juego) {

    // Si ya existe un modal, lo eliminamos antes de crear otro.
    const modalExistente = document.querySelector(".modal-juego");

    if (modalExistente) {
        modalExistente.remove();
    }

    // Obtenemos la información desde la tarjeta seleccionada.
    const imagenOriginal = juego.querySelector("img");
    const tituloOriginal = juego.querySelector("figcaption");
    const plataformaOriginal = juego.querySelector(".plataforma");
    const descripcionOriginal =
        juego.querySelector(".card-body > p:not(.precio-games)");
    const precioOriginal = juego.querySelector(".precio-games");

    // Creamos el contenedor principal del modal.
    const modal = document.createElement("div");

    modal.classList.add("modal-juego");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Información del juego");

    // Creamos el contenido interno del modal.
    const contenido = document.createElement("div");

    contenido.classList.add("modal-juego-contenido");

    // Creamos el botón para cerrar el modal.
    const botonCerrar = document.createElement("button");

    botonCerrar.classList.add("modal-juego-cerrar");
    botonCerrar.type = "button";
    botonCerrar.textContent = "×";
    botonCerrar.setAttribute("aria-label", "Cerrar información del juego");

    // Creamos la imagen del juego.
    const imagen = document.createElement("img");

    imagen.src = imagenOriginal.src;
    imagen.alt = imagenOriginal.alt;

    // Creamos el título.
    const titulo = document.createElement("h2");

    titulo.textContent = tituloOriginal.textContent.trim();

    // Creamos la plataforma.
    const plataforma = document.createElement("span");

    plataforma.classList.add("modal-plataforma");
    plataforma.textContent =
        plataformaOriginal.textContent.trim();

    // Creamos la descripción.
    const descripcion = document.createElement("p");

    descripcion.classList.add("modal-descripcion");
    descripcion.textContent =
        descripcionOriginal.textContent.trim();

    // Creamos el precio.
    const precio = document.createElement("p");

    precio.classList.add("modal-precio");

    // Copiamos los elementos internos del precio original.
    Array.from(precioOriginal.childNodes).forEach(function (nodo) {
        precio.appendChild(nodo.cloneNode(true));
    });

    // Agregamos todos los elementos al contenido del modal.
    contenido.appendChild(botonCerrar);
    contenido.appendChild(imagen);
    contenido.appendChild(titulo);
    contenido.appendChild(plataforma);
    contenido.appendChild(descripcion);
    contenido.appendChild(precio);

    // Agregamos el contenido al modal.
    modal.appendChild(contenido);

    // Agregamos el modal al body de la página.
    document.body.appendChild(modal);

    // Evitamos que la página se desplace mientras el modal está abierto.
    document.body.style.overflow = "hidden";

    /*
     * EVENTO CLICK
     * Cierra el modal mediante el botón X.
     */
    botonCerrar.addEventListener("click", function () {
        cerrarModalJuego(modal);
    });

    /*
     * EVENTO CLICK
     * Cierra el modal cuando se hace clic en el fondo oscuro.
     */
    modal.addEventListener("click", function (evento) {

        if (evento.target === modal) {
            cerrarModalJuego(modal);
        }
    });
}

/*
 * MANIPULACIÓN DEL DOM
 * Elimina el modal de la página y restaura
 * el desplazamiento normal del documento.
 */
function cerrarModalJuego(modal) {

    modal.remove();

    document.body.style.overflow = "";
}

/*
 * FETCH API
 * Cargamos los productos destacados desde un archivo JSON externo.
 * El archivo contiene nombre, plataforma, precios y descuento.
 */
function cargarProductos() {

    const contenedor = document.getElementById(
        "contenedor-productos-api"
    );

    if (!contenedor) {
        return;
    }

    fetch("data/productos.json")
        .then(function (respuesta) {

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo cargar el archivo de productos."
                );
            }

            return respuesta.json();
        })
        .then(function (productos) {

            mostrarProductos(productos);
        })
        .catch(function (error) {

            console.error(
                "Error al cargar productos:",
                error
            );

            contenedor.innerHTML =
                '<p class="mensaje-api">No fue posible cargar los productos. Intenta nuevamente.</p>';
        });
}

/*
 * MANIPULACIÓN DEL DOM
 * Creamos las tarjetas dinámicamente utilizando
 * createElement y appendChild.
 * También mostramos el precio anterior,
 * descuento y precio de oferta.
 */
function mostrarProductos(productos) {

    const contenedor = document.getElementById(
        "contenedor-productos-api"
    );

    contenedor.innerHTML = "";

    productos.forEach(function (producto) {

        const tarjeta = document.createElement("article");

        tarjeta.classList.add("producto-api");

        tarjeta.dataset.plataforma =
            producto.plataforma
                .toLowerCase()
                .replace(/\s+/g, "");

        tarjeta.dataset.nombre =
            producto.nombre.toLowerCase();

        const imagen = document.createElement("img");

        imagen.src = producto.imagen;
        imagen.alt = "Portada de " + producto.nombre;

        const titulo = document.createElement("h4");

        titulo.textContent = producto.nombre;

        const plataforma = document.createElement("p");

        plataforma.textContent =
            "Plataforma: " + producto.plataforma;

        const descripcion = document.createElement("p");

        descripcion.textContent =
            producto.descripcion;

        const precio = document.createElement("p");

        precio.classList.add("precio-api");

        const precioAnterior = document.createElement("span");

        precioAnterior.classList.add("precio-anterior");
        precioAnterior.textContent =
            producto.precioAnterior;

        const descuento = document.createElement("span");

        descuento.classList.add("descuento");
        descuento.textContent =
            producto.descuento;

        const precioOferta = document.createElement("strong");

        precioOferta.classList.add("precio-oferta");
        precioOferta.textContent =
            producto.precioOferta;

        precio.appendChild(precioAnterior);
        precio.appendChild(descuento);
        precio.appendChild(precioOferta);

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(plataforma);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(precio);

        contenedor.appendChild(tarjeta);
    });
}

/*
 * FILTRO DE PRODUCTOS DINÁMICOS
 * Reutilizamos los mismos criterios del filtro principal
 * para las tarjetas creadas mediante Fetch API.
 */
function filtrarProductosDinamicos(
    textoBuscado,
    plataformaSeleccionada
) {

    document.querySelectorAll(".producto-api").forEach(function (producto) {

        const coincideNombre =
            producto.dataset.nombre.includes(textoBuscado);

        const coincidePlataforma =
            plataformaSeleccionada === "todas" ||
            producto.dataset.plataforma === plataformaSeleccionada;

        producto.style.display =
            coincideNombre && coincidePlataforma
                ? ""
                : "none";
    });
}

// Iniciamos la carga de datos cuando la página está lista.
document.addEventListener(
    "DOMContentLoaded",
    cargarProductos
);