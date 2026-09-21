/*
 * =============================================
 * EL AMIGO - INTERACTIVIDAD DE GAMES
 * =============================================
 * Funcionalidades:
 * - Filtro por nombre y plataforma.
 * - Efecto hover.
 * - Modal de información del juego.
 * - Carga de productos mediante Fetch API.
 * - Filtrado de productos dinámicos.
 * - Carrito flotante mediante manipulación del DOM.
 */

// Elementos principales de los filtros.
const buscador = document.getElementById("buscador-games");
const filtro = document.getElementById("filtro-plataforma");
const botonFiltrar = document.getElementById("btn-filtrar");
const botonLimpiar = document.getElementById("btn-limpiar");

// Elementos del carrito.
const carritoFlotante = document.getElementById("carrito-flotante");
const botonMinimizarCarrito = document.getElementById("btn-minimizar-carrito");
const botonCarritoMinimizado = document.getElementById("btn-carrito-minimizado");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const botonLimpiarCarrito = document.getElementById("btn-limpiar-carrito");

// Arreglo que almacena los productos agregados.
const carrito = [];

// Tarjetas de juegos escritas directamente en HTML.
const juegos = document.querySelectorAll(".games");

/*
 * EVENTO CLICK
 * Filtra los juegos HTML y los productos cargados
 * mediante Fetch API.
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
            coincideNombre && coincidePlataforma ? "" : "none";
    });

    // Aplicamos los mismos criterios a los productos dinámicos.
    filtrarProductosDinamicos(
        textoBuscado,
        plataformaSeleccionada
    );
});

/*
 * EVENTO CLICK
 * Restablece los filtros y vuelve a mostrar
 * todos los juegos y productos dinámicos.
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
 * Agrega un efecto visual a las tarjetas.
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
 * Abre el modal cuando se selecciona una tarjeta.
 */
juegos.forEach(function (juego) {
    juego.addEventListener("click", function () {
        abrirModalJuego(juego);
    });

    // Botón para agregar el juego al carrito.
    const botonCarrito = juego.querySelector(".btn-agregar-carrito");

    botonCarrito.addEventListener("click", function (evento) {
        // Evita que el click abra el modal de la tarjeta.
        evento.stopPropagation();

        agregarJuegoAlCarrito(juego);
    });
});

/*
 * Agrega un juego escrito en HTML al carrito.
 */
function agregarJuegoAlCarrito(juego) {
    const nombre = juego.querySelector("figcaption").textContent.trim();
    const precioElemento = juego.querySelector(".precio-oferta");

    // Utilizamos el precio de oferta cuando existe.
    const precio =
        precioElemento
            ? precioElemento.textContent.trim()
            : juego.querySelector(".precio-games strong").textContent.trim();

    carrito.push({
        nombre: nombre,
        precio: precio
    });

    actualizarCarrito();

    // Mostramos el carrito automáticamente.
    carritoFlotante.classList.remove("oculto");
    botonCarritoMinimizado.classList.add("oculto");
}

/*
 * Abre el modal con la información completa del juego.
 */
function abrirModalJuego(juego) {
    // Si ya existe un modal, lo eliminamos.
    const modalExistente = document.querySelector(".modal-juego");

    if (modalExistente) {
        modalExistente.remove();
    }

    // Obtenemos la información original.
    const imagenOriginal = juego.querySelector("img");
    const tituloOriginal = juego.querySelector("figcaption");
    const plataformaOriginal = juego.querySelector(".plataforma");
    const descripcionOriginal =
        juego.querySelector(".card-body > p:not(.precio-games)");
    const precioOriginal = juego.querySelector(".precio-games");

    // Creamos el fondo del modal.
    const modal = document.createElement("div");

    modal.classList.add("modal-juego");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Información del juego");

    // Creamos el contenido central.
    const contenido = document.createElement("div");
    contenido.classList.add("modal-juego-contenido");

    // Creamos el botón de cerrar.
    const botonCerrar = document.createElement("button");

    botonCerrar.classList.add("modal-juego-cerrar");
    botonCerrar.type = "button";
    botonCerrar.textContent = "×";
    botonCerrar.setAttribute(
        "aria-label",
        "Cerrar información del juego"
    );

    // Creamos la imagen.
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

    // Copiamos el contenido del precio original.
    Array.from(precioOriginal.childNodes).forEach(function (nodo) {
        precio.appendChild(nodo.cloneNode(true));
    });

    // Construimos el modal.
    contenido.appendChild(botonCerrar);
    contenido.appendChild(imagen);
    contenido.appendChild(titulo);
    contenido.appendChild(plataforma);
    contenido.appendChild(descripcion);
    contenido.appendChild(precio);

    modal.appendChild(contenido);
    document.body.appendChild(modal);

    // Bloqueamos el desplazamiento mientras el modal está abierto.
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
     * Cierra el modal al hacer clic en el fondo.
     */
    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            cerrarModalJuego(modal);
        }
    });
}

/*
 * Cierra el modal y restaura el desplazamiento.
 */
function cerrarModalJuego(modal) {
    modal.remove();
    document.body.style.overflow = "";
}

/*
 * FETCH API
 * Carga los productos destacados desde productos.json.
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
 * Crea las tarjetas de los productos obtenidos
 * mediante Fetch API.
 */
function mostrarProductos(productos) {
    const contenedor = document.getElementById(
        "contenedor-productos-api"
    );

    contenedor.innerHTML = "";

    productos.forEach(function (producto) {
        const tarjeta = document.createElement("article");

        tarjeta.classList.add("producto-api");

        // Datos utilizados posteriormente por el filtro.
        tarjeta.dataset.plataforma =
            producto.plataforma
                .toLowerCase()
                .replace(/\s+/g, "");

        tarjeta.dataset.nombre =
            producto.nombre.toLowerCase();

        // Imagen.
        const imagen = document.createElement("img");

        imagen.src = producto.imagen;
        imagen.alt = "Portada de " + producto.nombre;

        // Nombre.
        const titulo = document.createElement("h4");

        titulo.textContent = producto.nombre;

        // Plataforma.
        const plataforma = document.createElement("p");

        plataforma.textContent =
            "Plataforma: " + producto.plataforma;

        // Descripción.
        const descripcion = document.createElement("p");

        descripcion.textContent =
            producto.descripcion;

        // Precio.
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

        // Botón de carrito.
        const botonCarrito = document.createElement("button");

        botonCarrito.type = "button";
        botonCarrito.classList.add("btn-agregar-carrito");
        botonCarrito.textContent = "🛒 Agregar al carrito";

        /*
         * EVENTO CLICK
         * Agrega el producto obtenido mediante Fetch.
         */
        botonCarrito.addEventListener("click", function () {
            agregarProductoDinamicoAlCarrito(producto);
        });

        // Construimos la tarjeta.
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(plataforma);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(botonCarrito);

        contenedor.appendChild(tarjeta);
    });
}

/*
 * Agrega al carrito un producto obtenido
 * mediante Fetch API.
 */
function agregarProductoDinamicoAlCarrito(producto) {
    carrito.push({
        nombre: producto.nombre,
        precio: producto.precioOferta
    });

    actualizarCarrito();

    carritoFlotante.classList.remove("oculto");
    botonCarritoMinimizado.classList.add("oculto");
}

/*
 * FILTRO DE PRODUCTOS DINÁMICOS
 * Utiliza los mismos criterios de búsqueda
 * que las tarjetas principales.
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

/*
 * CARRITO
 * Actualiza la lista, cantidad y total
 * mediante manipulación del DOM.
 */
function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    let total = 0;

    carrito.forEach(function (producto, indice) {
        const elemento = document.createElement("div");
        elemento.classList.add("producto-carrito");

        const nombreProducto = document.createElement("span");
        nombreProducto.textContent = producto.nombre;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.classList.add("btn-eliminar-carrito");
        botonEliminar.textContent = "×";
        botonEliminar.setAttribute(
            "aria-label",
            "Eliminar " + producto.nombre
        );

        botonEliminar.addEventListener("click", function () {
            carrito.splice(indice, 1);
            actualizarCarrito();
        });

        const precioProducto = document.createElement("strong");
        precioProducto.textContent = producto.precio;

        const informacion = document.createElement("div");
        informacion.classList.add("info-producto-carrito");
        informacion.appendChild(nombreProducto);
        informacion.appendChild(botonEliminar);

        elemento.appendChild(informacion);
        elemento.appendChild(precioProducto);
        listaCarrito.appendChild(elemento);

        // Convierte "$42.490" en 42490 para calcular el total.
        const precioNumerico = Number(
            producto.precio.replace("$", "").replace(/\./g, "")
        );

        total += precioNumerico;
    });

    // Muestra un mensaje si el carrito está vacío.
    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <p id="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;
    }

    cantidadCarrito.textContent = carrito.length;
    totalCarrito.textContent = "$" + total.toLocaleString("es-CL");
}

/*
 * EVENTO CLICK
 * Limpia todos los productos del carrito.
 */
if (botonLimpiarCarrito) {
    botonLimpiarCarrito.addEventListener("click", function () {
        carrito.length = 0;
        actualizarCarrito();
    });
}

/*
 * EVENTO CLICK
 * Minimiza el carrito y muestra el botón circular.
 */
botonMinimizarCarrito.addEventListener("click", function () {
    carritoFlotante.classList.add("oculto");
    botonCarritoMinimizado.classList.remove("oculto");
});

/*
 * EVENTO CLICK
 * Vuelve a abrir el carrito minimizado.
 */
botonCarritoMinimizado.addEventListener("click", function () {
    carritoFlotante.classList.remove("oculto");
    botonCarritoMinimizado.classList.add("oculto");
});

/*
 * Iniciamos la carga de productos mediante Fetch API.
 */
document.addEventListener(
    "DOMContentLoaded",
    cargarProductos
);
// Evento IR a Pagar
const btnIrPagar = document.getElementById("btn-ir-pagar");

btnIrPagar.addEventListener("click", function () {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert("El proceso de pago estará disponible próximamente.");
});