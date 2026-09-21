/*
 * =============================================
 * EL AMIGO - INTERACTIVIDAD DE PRODUCTOS
 * =============================================
 * Funcionalidades:
 * - Filtro por nombre y categoría.
 * - Filtro mediante parámetro URL.
 * - Efecto hover en productos.
 * - Modal de información del producto.
 * - Carrito flotante mediante manipulación del DOM.
 */

// Elementos utilizados por el carrito.
const carritoFlotante = document.getElementById("carrito-flotante");
const botonMinimizarCarrito = document.getElementById("btn-minimizar-carrito");
const botonCarritoMinimizado = document.getElementById("btn-carrito-minimizado");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");

// Arreglo que almacena los productos agregados al carrito.
const carrito = [];

/*
 * FUNCIÓN REUTILIZABLE
 * Muestra todos los productos o solamente
 * los de la categoría seleccionada.
 */
function aplicarFiltroCategoria(categoriaSeleccionada) {
    const productos = document.querySelectorAll(".tarjeta-producto");

    productos.forEach(function (producto) {
        const categoriaProducto = producto.dataset.categoria;

        producto.style.display =
            categoriaSeleccionada === "todas" ||
            categoriaProducto === categoriaSeleccionada
                ? ""
                : "none";
    });
}

/*
 * CATEGORÍA DESDE LA PORTADA
 * Permite abrir accesorios.html desde una categoría
 * del index y aplicar automáticamente el filtro.
 */
const parametrosURL = new URLSearchParams(window.location.search);
const categoriaURL = parametrosURL.get("categoria");

if (["teclados", "audifonos", "mouse"].includes(categoriaURL)) {
    aplicarFiltroCategoria(categoriaURL);
}

/*
 * Obtiene todas las tarjetas de productos.
 */
const productos = document.querySelectorAll(".tarjeta-producto");

productos.forEach(function (producto) {
    /*
     * EVENTO MOUSEOVER
     * Agrega un efecto visual al pasar el mouse.
     */
    producto.addEventListener("mouseover", function () {
        producto.classList.add("producto-hover");
    });

    producto.addEventListener("mouseout", function () {
        producto.classList.remove("producto-hover");
    });

    /*
     * EVENTO CLICK
     * Abre el modal con la información completa.
     */
    producto.addEventListener("click", function () {
        abrirModalProducto(producto);
    });

    /*
     * EVENTO CLICK
     * Agrega el producto seleccionado al carrito.
     */
    const botonCarrito = producto.querySelector(".btn-agregar-carrito");

    botonCarrito.addEventListener("click", function (evento) {
        // Evita que el click llegue al evento de la tarjeta y abra el modal.
        evento.stopPropagation();

        agregarAlCarrito(producto);
    });
});

/*
 * Agrega un producto al arreglo del carrito
 * y actualiza su contenido.
 */
function agregarAlCarrito(producto) {
    const nombre = producto.querySelector("figcaption").textContent.trim();
    const precioTexto = producto.querySelector(".precio-producto").textContent.trim();

    carrito.push({
        nombre: nombre,
        precio: precioTexto
    });

    actualizarCarrito();

    // El carrito aparece automáticamente después de agregar un producto.
    carritoFlotante.classList.remove("oculto");
    botonCarritoMinimizado.classList.add("oculto");
}

/*
 * Actualiza los productos, contador y total
 * mediante manipulación del DOM.
 */
function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    let total = 0;

    carrito.forEach(function (producto, indice) {
        const elemento = document.createElement("div");
        elemento.classList.add("producto-carrito");

        const informacionProducto = document.createElement("div");
        informacionProducto.classList.add("info-producto-carrito");

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

        informacionProducto.appendChild(nombreProducto);
        informacionProducto.appendChild(botonEliminar);

        const precioProducto = document.createElement("strong");
        precioProducto.textContent = producto.precio;

        elemento.appendChild(informacionProducto);
        elemento.appendChild(precioProducto);
        listaCarrito.appendChild(elemento);

        const precioNumerico = Number(
            producto.precio.replace("$", "").replace(/\./g, "")
        );

        total += precioNumerico;
    });

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
 * Minimiza el carrito y muestra solamente
 * el botón circular con el contador.
 */
botonMinimizarCarrito.addEventListener("click", function () {
    carritoFlotante.classList.add("oculto");
    botonCarritoMinimizado.classList.remove("oculto");
});

/*
 * EVENTO CLICK
 * Vuelve a abrir el carrito desde su estado minimizado.
 */
botonCarritoMinimizado.addEventListener("click", function () {
    carritoFlotante.classList.remove("oculto");
    botonCarritoMinimizado.classList.add("oculto");
});

/*
 * EVENTO CLICK
 * Abre un modal con la información completa
 * del producto seleccionado.
 */
function abrirModalProducto(producto) {
    // Creamos el fondo oscuro del modal.
    const modal = document.createElement("div");
    modal.classList.add("modal-producto");

    // Creamos el contenido central.
    const contenido = document.createElement("div");
    contenido.classList.add("modal-producto-contenido");

    // Creamos el botón de cerrar.
    const botonCerrar = document.createElement("button");
    botonCerrar.classList.add("modal-producto-cerrar");
    botonCerrar.type = "button";
    botonCerrar.textContent = "×";
    botonCerrar.setAttribute(
        "aria-label",
        "Cerrar información del producto"
    );

    // Obtenemos los datos originales del producto.
    const imagenOriginal = producto.querySelector("img");
    const tituloOriginal = producto.querySelector("figcaption");
    const descripcionOriginal = producto.querySelector(
        ".card-body > p:not(.precio-producto)"
    );
    const precioOriginal = producto.querySelector(".precio-producto");

    // Creamos la imagen grande.
    const imagen = document.createElement("img");
    imagen.src = imagenOriginal.src;
    imagen.alt = imagenOriginal.alt;

    // Creamos el título.
    const titulo = document.createElement("h2");
    titulo.textContent = tituloOriginal.textContent.trim();

    // Creamos la descripción.
    const descripcion = document.createElement("p");
    descripcion.classList.add("modal-descripcion-producto");
    descripcion.textContent = descripcionOriginal.textContent.trim();

    // Creamos el precio.
    const precio = document.createElement("p");
    precio.classList.add("modal-precio-producto");

    // Copiamos el contenido del precio original.
    Array.from(precioOriginal.childNodes).forEach(function (nodo) {
        precio.appendChild(nodo.cloneNode(true));
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

    // Bloqueamos temporalmente el desplazamiento de la página.
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
 * Cierra el modal y restaura el desplazamiento.
 */
function cerrarModalProducto(modal) {
    modal.remove();
    document.body.style.overflow = "";
}


/*
 * EVENTO CLICK
 * Limpia todos los productos del carrito.
 */
const btnLimpiarCarrito = document.getElementById("btn-limpiar-carrito");

btnLimpiarCarrito.addEventListener("click", function () {
    carrito.length = 0;
    actualizarCarrito();
});

// Ir a Pagar evento
const btnIrPagar = document.getElementById("btn-ir-pagar");

btnIrPagar.addEventListener("click", function () {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert("El proceso de pago estará disponible próximamente.");
});
