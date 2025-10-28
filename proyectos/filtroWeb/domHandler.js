import {ImageHandler} from './filters.js';

// Acceso a elementos del DOM - Obtenemos una referencia a los elementos de la interfaz qeu vamos a manipular
const originalImage = document.getElementById("original-image");
const processedCanvas = document.getElementById("processed-image");
const loadImageButton = document.getElementById("load-image");
const imageUrlInput = document.getElementById("image-url");
const filters = document.querySelectorAll(".filters__button");

// Variables globales
let imageHandler;

// Eventos - Asignamos eventos a los elementos de la interfaz
// Al hacer clic en el botón de cargar imagen, se intenta cargar la imagen desde la URL introducida
// Para ello, incluimos un manejador de eventos que se ejecuta cuando el usuario hace clic en el botón de cargar imagen.
loadImageButton.addEventListener("click", () => {

    // Obtenemos la URL de la imagen introducida por el usuario
    const url = imageUrlInput.value;

    // Si no se ha introducido ninguna URL, mostramos un mensaje de alerta y salimos de la función
    if (!url) {
        alert("Por favor, introduce una URL válida.");
        return;
    }

    // Intentamos cargar la imagen desde la URL introducida - Se usa el método fetch() para cargar la imagen desde la URL introducida por el usuario.
    // Estudiaremos el método fetch() en detalle en las siguientes asignaturas.
    fetch(url)
        .then(response => {

            // Si la respuesta no es correcta, lanzamos un error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Si la respuesta es correcta, cargamos la imagen en el elemento <img> original
            originalImage.crossOrigin = "anonymous"; // Evita problemas de CORS
            originalImage.src = url; // Cargamos la imagen en el elemento <img> original
        })
        .then(() => {

            // Cuando la imagen se haya cargado correctamente, mostramos un mensaje en la consola
            originalImage.onload = () => {
                console.log("Imagen cargada correctamente desde:", originalImage.src);

                // Escalar la imagen original a 500x500 píxeles
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = 500;
                tempCanvas.height = 500;
                const tempCtx = tempCanvas.getContext("2d");
                tempCtx.drawImage(originalImage, 0, 0, 500, 500);

                // Establecer el contenido del canvas como fuente del <img> original
                originalImage.src = tempCanvas.toDataURL();
            };
        })
        .catch(error => {
            // Si se produce un error al cargar la imagen, mostramos un mensaje de error en la consola y una alerta al usuario
            console.error("Error al cargar la imagen:", error);
            alert("No se pudo cargar la imagen. Verifica la URL o las restricciones del servidor.");
        });
});

// Al hacer clic en un botón de filtro, se aplica el filtro correspondiente a la imagen original
filters.forEach(button => {
    button.addEventListener("click", () => {

        // Accedemos al atributo data-filter del botón para obtener el filtro que se va a aplicar
        const filter = button.getAttribute("data-filter");
        if (originalImage.complete && originalImage.naturalWidth > 0) {
            processedCanvas.width = 500;
            processedCanvas.height = 500;
            const ctx = processedCanvas.getContext("2d");
            ctx.drawImage(originalImage, 0, 0, 500, 500);

            // Aplicamos el filtro correspondiente a la imagen original
            imageHandler = new ImageHandler(processedCanvas);
            imageHandler.applyFilter(filter);
        } else {
            // Si no se ha cargado ninguna imagen, mostramos un mensaje de alerta
            alert("Primero debes cargar una imagen válida.");
        }
    });
});
