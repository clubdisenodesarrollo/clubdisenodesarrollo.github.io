window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (window.pageYOffset > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});













// Datos de los proyectos (puedes agregar más proyectos aquí)
const proyectos = [
  {
    titulo: "Restaurante",
    imagen: "/Proyectos/CakeWorld/restaurante.png",
    enlace: "/Proyectos/CakeWorld/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/observatorioEspacial/index.html",
  },
  {
    titulo: "Observatorio",
    imagen: "/Proyectos/observatorioEspacial/observatorio.png",
    enlace: "/Proyectos/pagina ofi/index.html",
  },
  // Agrega más proyectos aquí...
];

// Función para generar las cartas
function generarCartas() {
  const contenedorCartas = document.getElementById("cartas");

  if (!contenedorCartas) {
    console.error("No se encontró el contenedor de cartas (#cartas).");
    return;
  }

  proyectos.forEach((proyecto, index) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");

    const enlace = document.createElement("a");
    enlace.href = proyecto.enlace;

    const contenedorImagen = document.createElement("div");
    contenedorImagen.classList.add("contenedor-imagen");

    const imagen = document.createElement("img");
    imagen.src = proyecto.imagen;
    imagen.alt = proyecto.titulo;

    const contenido = document.createElement("div");
    contenido.classList.add("contenido");

    const titulo = document.createElement("h2");
    titulo.textContent = `${index + 1}. ${proyecto.titulo}`; // Agrega el número del proyecto
    //titulo.textContent = proyecto.titulo;

    contenedorImagen.appendChild(imagen);
    contenido.appendChild(titulo);
    enlace.appendChild(contenedorImagen);
    enlace.appendChild(contenido);
    carta.appendChild(enlace);
    contenedorCartas.appendChild(carta);
  });
}

window.onload = generarCartas;