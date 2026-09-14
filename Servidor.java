// =============================================
// EL AMIGO - SERVIDOR HTTP LOCAL
// =============================================

import com.sun.net.httpserver.HttpServer;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;

public class Servidor {

    public static void main(String[] args) throws IOException {

        // Puerto utilizado por el servidor.
        int puerto = 8000;

        // Creamos el servidor escuchando en todas las interfaces de red.
        HttpServer servidor = HttpServer.create(
                new InetSocketAddress("0.0.0.0", puerto),
                0
        );

        /*
         * Contexto principal del servidor.
         * Permite acceder a los archivos HTML, CSS, JS,
         * imágenes y archivos JSON del proyecto.
         */
        servidor.createContext("/", intercambio -> {

            try {

                String ruta = intercambio.getRequestURI().getPath();

                // Si se accede a la raíz, mostramos index.html.
                if (ruta.equals("/")) {
                    ruta = "/index.html";
                }

                File archivo = new File("." + ruta);

                // Verificamos que el archivo exista.
                if (archivo.exists() && archivo.isFile()) {

                    byte[] contenido =
                            Files.readAllBytes(archivo.toPath());

                    intercambio.getResponseHeaders().set(
                            "Content-Type",
                            obtenerTipoContenido(archivo)
                    );

                    intercambio.sendResponseHeaders(
                            200,
                            contenido.length
                    );

                    intercambio.getResponseBody().write(contenido);
                    intercambio.getResponseBody().flush();

                } else {

                    // Archivo no encontrado.
                    String mensaje =
                            "404 - Archivo no encontrado";

                    byte[] contenido =
                            mensaje.getBytes();

                    intercambio.sendResponseHeaders(
                            404,
                            contenido.length
                    );

                    intercambio.getResponseBody().write(contenido);
                    intercambio.getResponseBody().flush();
                }

            } finally {

                // Cerramos la respuesta.
                intercambio.getResponseBody().close();
                intercambio.close();
            }
        });

        // Iniciamos el servidor.
        servidor.start();

        // Mostramos las direcciones disponibles.
        System.out.println(
                "Servidor iniciado en el puerto " + puerto
        );

        System.out.println(
                "http://localhost:" + puerto
        );

        System.out.println(
                "http://192.168.1.5:" + puerto
        );

        /*
         * Mantenemos el programa ejecutándose para que
         * el servidor continúe disponible.
         */
        try {

            Thread.currentThread().join();

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            System.out.println(
                    "Servidor detenido."
            );
        }
    }

    /*
     * Determina el tipo de contenido según la extensión
     * del archivo solicitado.
     */
    private static String obtenerTipoContenido(File archivo) {

        String nombre =
                archivo.getName().toLowerCase();

        if (nombre.endsWith(".html")) {

            return "text/html";

        } else if (nombre.endsWith(".css")) {

            return "text/css";

        } else if (nombre.endsWith(".js")) {

            return "application/javascript";

        } else if (nombre.endsWith(".json")) {

            return "application/json";

        } else if (nombre.endsWith(".png")) {

            return "image/png";

        } else if (nombre.endsWith(".jpg")
                || nombre.endsWith(".jpeg")) {

            return "image/jpeg";

        } else if (nombre.endsWith(".gif")) {

            return "image/gif";

        } else if (nombre.endsWith(".svg")) {

            return "image/svg+xml";

        } else {

            return "application/octet-stream";
        }
    }
}