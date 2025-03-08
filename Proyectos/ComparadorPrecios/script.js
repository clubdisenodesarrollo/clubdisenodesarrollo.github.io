function calcular() {
    const producto = document.getElementById('producto').value;
    const supermercado1 = parseFloat(document.getElementById('supermercado1').value);
    const supermercado2 = parseFloat(document.getElementById('supermercado2').value);
    const supermercado3 = parseFloat(document.getElementById('supermercado3').value);
    const supermercado4 = parseFloat(document.getElementById('supermercado4').value);

    const precios = [supermercado1, supermercado2, supermercado3, supermercado4];
    const menorPrecio = Math.min(...precios);
    let supermercadoConMenorPrecio = '';

    // Crear un nuevo contenedor para los resultados
    const nuevoResultado = document.createElement('div');
    nuevoResultado.classList.add('resultado');

    // Determinar el supermercado con el menor precio
    precios.forEach((precio, index) => {
        const supermercado = `Supermercado ${index + 1}`;
        const precioFormateado = precio.toFixed(2);
        const esMenorPrecio = precio === menorPrecio;

        if (esMenorPrecio) {
            supermercadoConMenorPrecio = supermercado;
        }

        const contenido = `
            <p>${supermercado}: $${precioFormateado} ${esMenorPrecio ? '(Menor precio)' : ''}</p>
        `;
        nuevoResultado.innerHTML += contenido;
    });

    // Agregar el resultado final
    nuevoResultado.innerHTML += `
        <p>Producto: ${producto}</p>
        <p>Supermercado más económico: ${supermercadoConMenorPrecio} ($${menorPrecio.toFixed(2)})</p>
    `;

    // Agregar el nuevo contenedor a la sección de resultados
    document.getElementById('resultados').appendChild(nuevoResultado);

    // Función para ordenar los productos por el menor precio de cada supermercado
    ordenarProductos();
}

function ordenarProductos() {
    const producto = document.getElementById('producto').value;
    const supermercado1 = parseFloat(document.getElementById('supermercado1').value);
    const supermercado2 = parseFloat(document.getElementById('supermercado2').value);
    const supermercado3 = parseFloat(document.getElementById('supermercado3').value);
    const supermercado4 = parseFloat(document.getElementById('supermercado4').value);

    const productos = [
        { nombre: producto, supermercado1, supermercado2, supermercado3, supermercado4 }
    ];

    // Ordenar los productos por el menor precio de cada supermercado
    productos.sort((a, b) => {
        const menorA = Math.min(a.supermercado1, a.supermercado2, a.supermercado3, a.supermercado4);
        const menorB = Math.min(b.supermercado1, b.supermercado2, b.supermercado3, b.supermercado4);
        return menorA - menorB;
    });

    // Crear un nuevo contenedor para los resultados ordenados
    const nuevoResultado = document.createElement('div');
    nuevoResultado.classList.add('resultado');

    // Generar el contenido HTML con los resultados ordenados
    productos.forEach(p => {
        const menorPrecio = Math.min(p.supermercado1, p.supermercado2, p.supermercado3, p.supermercado4);
        let supermercadoConMenorPrecio = '';

        if (p.supermercado1 === menorPrecio) supermercadoConMenorPrecio = 'Supermercado 1';
        else if (p.supermercado2 === menorPrecio) supermercadoConMenorPrecio = 'Supermercado 2';
        else if (p.supermercado3 === menorPrecio) supermercadoConMenorPrecio = 'Supermercado 3';
        else if (p.supermercado4 === menorPrecio) supermercadoConMenorPrecio = 'Supermercado 4';

        nuevoResultado.innerHTML += `
            <p>${p.nombre}: $${menorPrecio.toFixed(2)} (${supermercadoConMenorPrecio})</p>
        `;
    });

    // Agregar el nuevo contenedor a la sección de resultados
    document.getElementById('resultados').appendChild(nuevoResultado);
}