window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (window.pageYOffset > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});









// Array de cartas
const cartas = [
  {
    titulo: "Observatorio",
    descripcion: "",
    imagen: "/Proyectos/observatorioEspacial/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/Proyectos/observatorioEspacial/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Pump It Up - Juego",
    descripcion: ".",
    imagen: "/miniProyectos/pumpItUp/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/miniProyectos/pumpItUp/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Ruta Turística",
    descripcion: "",
    imagen: "/Proyectos/rutaTuristica/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/Proyectos/rutaTuristica/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Filtro Web",
    descripcion: "",
    imagen: "/Proyectos/filtroWeb/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/Proyectos/filtroWeb/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Restaurante",
    descripcion: "",
    imagen: "/Proyectos/CakeWorld/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/Proyectos/CakeWorld/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Cartelera",
    descripcion: "",
    imagen: "/Proyectos/cartelera/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/Proyectos/cartelera/index.html", // Enlace a la página del proyecto
  },
  // Agrega más cartas según sea necesario
];

// Función para renderizar cartas
function renderCartas(filterTag = "todos") {
  const contenedorCartas = document.getElementById("cartas");
  contenedorCartas.innerHTML = ""; // Limpiar el contenedor

  // Filtrar cartas según la etiqueta
  const cartasFiltradas = filterTag === "todos"
    ? cartas // Mostrar todas las cartas
    : cartas.filter((carta) => carta.tag === filterTag); // Filtrar por etiqueta

  // Generar el HTML de las cartas filtradas
  cartasFiltradas.forEach((carta) => {
    const cartaHTML = `
      <a href="${carta.enlace}" class="carta">
        <div class="contenedor-imagen">
          <img src="${carta.imagen}" alt="${carta.titulo}">
        </div>
        <div class="contenido">
          <h2>${carta.titulo}</h2>
          <p>${carta.descripcion}</p>
        </div>
      </a>
    `;
    contenedorCartas.innerHTML += cartaHTML;
  });
}
// Eventos para los botones de filtro
document.querySelectorAll(".boton-filtro").forEach((boton) => {
  boton.addEventListener("click", () => {
    const tag = boton.getAttribute("data-tag"); // Obtener la etiqueta del botón
    renderCartas(tag); // Renderizar cartas con la etiqueta seleccionada
  });
});

// Renderizar todas las cartas al cargar la página
document.addEventListener("DOMContentLoaded", () => renderCartas());
window.onload = generarCartas;
