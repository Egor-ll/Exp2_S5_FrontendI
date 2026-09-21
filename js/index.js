/*
 * =============================================
 * EL AMIGO - INTERACTIVIDAD DE INICIO
 * =============================================
 * Funcionalidades:
 * - Recomendación de productos mediante manipulación del DOM.
 * - Efecto hover en ofertas y categorías.
 * - Carga de productos mediante Fetch API.
 * - Carrito flotante mediante manipulación del DOM.
 */

// Elementos de la recomendación.
const botonRecomendacion = document.getElementById("btn-recomendacion");
const resultadoRecomendacion = document.getElementById("resultado-recomendacion");

// Elementos del carrito.
const carritoFlotante = document.getElementById("carrito-flotante");
const botonMinimizarCarrito = document.getElementById("btn-minimizar-carrito");
const botonCarritoMinimizado = document.getElementById("btn-carrito-minimizado");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const botonLimpiarCarrito = document.getElementById("btn-limpiar-carrito");

// Arreglo que almacena los productos agregados al carrito.
const carrito = [];

/*
 * EVENTO CLICK Y MANIPULACIÓN DEL DOM
 * Muestra una recomendación de producto cuando el usuario presiona el botón.
 * El contenido se crea dinámicamente para demostrar el uso del DOM.
 */
if (botonRecomendacion) {
    botonRecomendacion.addEventListener("click", function () {
        resultadoRecomendacion.innerHTML = "";

        const titulo = document.createElement("h3");
        titulo.textContent = "🎧 Te recomendamos Audífonos Razer Blackshark V2";

        const descripcion = document.createElement("p");
        descripcion.textContent = "Una buena alternativa para gaming gracias a su sonido inmersivo y comodidad.";

        const enlace = document.createElement("a");
        enlace.href = "accesorios.html?categoria=audifonos";
        enlace.textContent = "Ver audífonos →";

        resultadoRecomendacion.appendChild(titulo);
        resultadoRecomendacion.appendChild(descripcion);
        resultadoRecomendacion.appendChild(enlace);
    });
}

/*
 * EVENTO MOUSEOVER
 * Visual a las tarjetas de ofertas y categorías al pasar el mouse.
 */
document.querySelectorAll(".oferta-card, .categoria-card").forEach(function (elemento) {
    elemento.addEventListener("mouseover", function () {
        elemento.classList.add("elemento-hover");
    });

    elemento.addEventListener("mouseout", function () {
        elemento.classList.remove("elemento-hover");
    });
});

/*
 * FETCH API
 * Carga los productos destacados desde productos.json.
 */
function cargarProductos() {
    const contenedor = document.getElementById("lista-productos");
    const mensajeError = document.getElementById("mensaje-error-productos");

    if (!contenedor) {
        return;
    }

    fetch("data/productos.json")
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el archivo de productos.");
            }

            return respuesta.json();
        })
        .then(function (productos) {
            mostrarProductos(productos);
        })
        .catch(function (error) {
            console.error("Error al cargar los productos:", error);

            if (mensajeError) {
                mensajeError.classList.remove("d-none");
            }
        });
}

/*
 * MANIPULACIÓN DEL DOM
 * Crea las tarjetas de las ofertas obtenidas mediante Fetch API.
 */
function mostrarProductos(productos) {
    const contenedor = document.getElementById("lista-productos");

    contenedor.innerHTML = "";

    productos.forEach(function (producto) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("oferta-card");

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = "Portada de " + producto.nombre;

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;

        const plataforma = document.createElement("p");
        plataforma.textContent = "Plataforma: " + producto.plataforma;

        const precio = document.createElement("p");
        precio.classList.add("precio-oferta-inicio");
        precio.textContent = producto.precioOferta;

        const botonCarrito = document.createElement("button");
        botonCarrito.type = "button";
        botonCarrito.classList.add("btn-agregar-carrito");
        botonCarrito.textContent = "🛒 Agregar al carrito";

        botonCarrito.addEventListener("click", function () {
            agregarAlCarrito(producto);
        });

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(plataforma);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(botonCarrito);

        contenedor.appendChild(tarjeta);
    });
}

/*
 * CARRITO
 * Agrega un producto y actualiza la lista, contador y total.
 */
function agregarAlCarrito(producto) {
    carrito.push({
        nombre: producto.nombre,
        precio: producto.precioOferta
    });

    actualizarCarrito();
    carritoFlotante.classList.remove("oculto");
    botonCarritoMinimizado.classList.add("oculto");
}

/*
 * CARRITO
 * Actualiza la lista, contador y total mediante manipulación del DOM.
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
        botonEliminar.setAttribute("aria-label", "Eliminar " + producto.nombre);

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
 * EVENTO CLICK
 * Limpia todos los productos del carrito.
 */
botonLimpiarCarrito.addEventListener("click", function () {
    carrito.length = 0;
    actualizarCarrito();
});

/*
 * Iniciamos la carga de productos mediante Fetch API.
 */
document.addEventListener("DOMContentLoaded", cargarProductos);

// Evento IR a Pagar.
const btnIrPagar = document.getElementById("btn-ir-pagar");

btnIrPagar.addEventListener("click", function () {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert("El proceso de pago estará disponible próximamente.");
});
