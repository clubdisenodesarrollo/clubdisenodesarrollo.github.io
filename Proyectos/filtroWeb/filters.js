class ImageHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    applyFilter(filter) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;

        switch (filter) {
            case "red":
                redFilter(pixels);
                break;
            case "green":
                greenFilter(pixels);
                break;
            case "blue":
                blueFilter(pixels);
                break;
            case "black-white":
                blackAndWhiteFilter(pixels);
                break;
            case "grey":
                greyFilter(pixels);
                break;
            case "negative":
                negativeFilter(pixels);
                break;
            case "sepia":
                sepiaFilter(pixels);
                break;
            case "gaussian-blur":
                this.applyGaussianBlur(this.canvas);
                return;
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    applyGaussianBlur(canvas) {
        gaussianBlur(canvas);
    }
}

/**
 * Aplica un filtro rojo a los píxeles de la imagen.
 *
 * Algoritmo:
 * 1. Iterar sobre el array de píxeles en pasos de 4 (cada píxel está representado por 4 valores: R, G, B, A).
 * 2. Para cada píxel, establecer el valor del componente verde (G) a 0.
 * 3. Para cada píxel, establecer el valor del componente azul (B) a 0.
 * 4. Dejar los valores del componente rojo (R) y alfa (A) sin cambios.
 *
 * @param {Uint8ClampedArray} pixels - Array de píxeles en formato RGBA.
 */
function redFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i + 1] = 0; // Green
        pixels[i + 2] = 0; // Blue
    }
}


/**
 * Aplica un filtro verde a los píxeles de la imagen.
 *
 * Algoritmo:
 * 1. Iterar sobre el array de píxeles en pasos de 4 (cada píxel está representado por 4 valores: R, G, B, A).
 * 2. Para cada píxel, establecer el valor del componente rojo (R) a 0.
 * 3. Para cada píxel, establecer el valor del componente azul (B) a 0.
 * 4. Dejar los valores del componente verde (G) y alfa (A) sin cambios.
 *
 * @param {Uint8ClampedArray} pixels - Array de píxeles en formato RGBA.
 */
function greenFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 0; // Red
        pixels[i + 2] = 0; // Blue
    }
}


/**
 * Aplica un filtro azul a los píxeles de la imagen.
 *
 * Algoritmo:
 * 1. Iterar sobre el array de píxeles en pasos de 4 (cada píxel está representado por 4 valores: R, G, B, A).
 * 2. Para cada píxel, establecer el valor del componente rojo (R) a 0.
 * 3. Para cada píxel, establecer el valor del componente verde (G) a 0.
 * 4. Dejar los valores del componente azul (B) y alfa (A) sin cambios.
 *
 * @param {Uint8ClampedArray} pixels - Array de píxeles en formato RGBA.
 */
function blueFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 0; // Red
        pixels[i + 1] = 0; // Green
    }
}


/**
 * Aplica un filtro blanco y negro a los píxeles de la imagen.
 *
 * Algoritmo:
 * 1. Iterar sobre el array de píxeles en pasos de 4 (cada píxel está representado por 4 valores: R, G, B, A).
 * 2. Para cada píxel, calcular el valor promedio de los componentes rojo (R), verde (G) y azul (B).
 * 3. Si el valor promedio es menor que 128, establecer los componentes R, G y B a 0 (negro).
 * 4. Si el valor promedio es mayor o igual a 128, establecer los componentes R, G y B a 255 (blanco).
 * 5. Dejar el valor del componente alfa (A) sin cambios.
 *
 * @param {Uint8ClampedArray} pixels - Array de píxeles en formato RGBA.
 */
function blackAndWhiteFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const average = (r + g + b) / 3;

        if (average < 128) {
            pixels[i] = pixels[i + 1] = pixels[i + 2] = 0; // Negro
        } else {
            pixels[i] = pixels[i + 1] = pixels[i + 2] = 255; // Blanco
        }
    }
}


/**
 * Aplica un filtro gris a los píxeles de la imagen.
 *
 * Algoritmo:
 * 1. Iterar sobre el array de píxeles en pasos de 4 (cada píxel está representado por 4 valores: R, G, B, A).
 * 2. Para cada píxel, calcular el valor promedio de los componentes rojo (R), verde (G) y azul (B).
 * 3. Establecer los componentes R, G y B al valor promedio calculado.
 * 4. Dejar el valor del componente alfa (A) sin cambios.
 *
 * @param {Uint8ClampedArray} pixels - Array de píxeles en formato RGBA.
 */
function greyFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const average = (r + g + b) / 3;

        pixels[i] = pixels[i + 1] = pixels[i + 2] = average; // Gris
    }
}


/**
 * Aplica un filtro negativo a los píxeles de la imagen.
 *
 * Algoritmo:
 * 1. Iterar sobre el array de píxeles en pasos de 4 (cada píxel está representado por 4 valores: R, G, B, A).
 * 2. Para cada píxel, restar el valor de cada componente (R, G, B) a 255.
 * 3. Establecer los componentes R, G y B al valor resultante.
 * 4. Dejar el valor del componente alfa (A) sin cambios.
 *
 * @param {Uint8ClampedArray} pixels - Array de píxeles en formato RGBA.
 */
function negativeFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255 - pixels[i]; // Red
        pixels[i + 1] = 255 - pixels[i + 1]; // Green
        pixels[i + 2] = 255 - pixels[i + 2]; // Blue
    }
}


/**
 * Aplica un filtro sepia a los píxeles de la imagen.
 *
 * Algoritmo:
 * 1. Iterar sobre el array de píxeles en pasos de 4 (cada píxel está representado por 4 valores: R, G, B, A).
 * 2. Para cada píxel, calcular los nuevos valores de los componentes R, G y B usando las siguientes fórmulas:
 *    - sepiaRojo = 0.393 * R + 0.769 * G + 0.189 * B
 *    - sepiaVerde = 0.349 * R + 0.686 * G + 0.168 * B
 *    - sepiaAzul = 0.272 * R + 0.534 * G + 0.131 * B
 * 3. Establecer los componentes R, G y B a los valores calculados, asegurándose de que no excedan 255. Puedes usar Math.min o un operador ternario.
 * 4. Dejar el valor del componente alfa (A) sin cambios.
 *
 * @param {Uint8ClampedArray} pixels - Array de píxeles en formato RGBA.
 */
function sepiaFilter(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const sepiaRed = 0.393 * r + 0.769 * g + 0.189 * b;
        const sepiaGreen = 0.349 * r + 0.686 * g + 0.168 * b;
        const sepiaBlue = 0.272 * r + 0.534 * g + 0.131 * b;

        pixels[i] = Math.min(255, sepiaRed); // Red
        pixels[i + 1] = Math.min(255, sepiaGreen); // Green
        pixels[i + 2] = Math.min(255, sepiaBlue); // Blue
    }
}


/**
 * Aplica un filtro de desenfoque gaussiano a los píxeles de la imagen. (https://en.wikipedia.org/wiki/Gaussian_blur)
 *
 * Algoritmo:
 * 1. Definir una matriz de pesos (kernel) para el desenfoque gaussiano y un divisor para normalizar los valores.
 * 2. Obtener el contexto del lienzo y los datos de los píxeles de la imagen.
 * 3. Crear una copia temporal de los datos de los píxeles para evitar modificar los datos originales durante el cálculo.
 * 4. Iterar sobre cada píxel de la imagen, excluyendo los bordes.
 * 5. Para cada píxel, aplicar la matriz de pesos a los píxeles vecinos para calcular los nuevos valores de los componentes rojo (R), verde (G) y azul (B).
 * 6. Dividir los valores calculados por el divisor para normalizarlos y asegurarse de que no excedan 255.
 * 7. Establecer los nuevos valores de los componentes R, G y B en el array de píxeles original.
 * 8. Colocar los datos modificados de nuevo en el lienzo.
 *
 * @param {HTMLCanvasElement} canvas - El elemento canvas que contiene la imagen a desenfocar.
 */
function gaussianBlur(canvas) {

    const width = canvas.width;
    const height = canvas.height;
    const weights = [
        [1, 5, 3],
        [1, 4, 1],
        [2, 2, 2],
    ];
    const divisor = 21;

    const tempCtx = canvas.getContext("2d");
    const imageData = tempCtx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const tempData = tempCtx.getImageData(0, 0, width, height);
    const tempPixels = tempData.data;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                    const weight = weights[ky + 1][kx + 1];

                    r += tempPixels[pixelIndex] * weight;
                    g += tempPixels[pixelIndex + 1] * weight;
                    b += tempPixels[pixelIndex + 2] * weight;
                }
            }

            const pixelIndex = (y * width + x) * 4;
            pixels[pixelIndex] = r / divisor;
            pixels[pixelIndex + 1] = g / divisor;
            pixels[pixelIndex + 2] = b / divisor;
        }
    }

    tempCtx.putImageData(imageData, 0, 0);
}

// Exportamos las funciones para poder usarlas en otros archivos
// No modificar esta parte
export { ImageHandler, redFilter, greenFilter, blueFilter, blackAndWhiteFilter, greyFilter, negativeFilter, sepiaFilter, gaussianBlur };
