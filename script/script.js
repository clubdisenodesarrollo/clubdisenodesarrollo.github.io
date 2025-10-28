// Sidebar navegación móvil
document.addEventListener('DOMContentLoaded', function () {
  const btnHamburguesa = document.getElementById('btn-hamburguesa');
  const sidebar = document.getElementById('sidebar-nav');
  const closeSidebar = document.getElementById('close-sidebar');

  if (btnHamburguesa && sidebar && closeSidebar) {
    // Abrir sidebar
    btnHamburguesa.addEventListener('click', function (e) {
      e.stopPropagation(); // Evitar que el evento se propague
      sidebar.classList.add('open');
      btnHamburguesa.classList.add('hide');
    });

    // Cerrar sidebar
    closeSidebar.addEventListener('click', function (e) {
      e.stopPropagation(); // Evitar que el evento se propague
      sidebar.classList.remove('open');
      btnHamburguesa.classList.remove('hide');
    });

    // Cerrar sidebar al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== btnHamburguesa
      ) {
        sidebar.classList.remove('open');
        btnHamburguesa.classList.remove('hide');
      }
    });

    // Evitar que el clic dentro del sidebar lo cierre
    sidebar.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }
});
// Carrusel tipo slide horizontal automático
document.addEventListener('DOMContentLoaded', function () {
  const carrusel = document.getElementById('carrusel');
  if (!carrusel) return;
  const imagenes = carrusel.querySelectorAll('.carrusel-img');
  const contenedor = carrusel.querySelector('.carrusel-imagenes');
  let actual = 0;
  let intervalo;
  const total = imagenes.length;

  function moverCarrusel(idx) {
    contenedor.style.transform = `translateX(-${idx * 100}%)`;
  }

  function siguiente() {
    actual = (actual + 1) % total;
    moverCarrusel(actual);
  }

  function autoPlay() {
    intervalo = setInterval(() => {
      siguiente();
    }, 4000);
  }

  contenedor.style.transform = 'translateX(0)';
  autoPlay();
});
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.pageYOffset > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});








// Array de cartas
const cartas = [
  {
    titulo: "Disgrafia",
    descripcion: "",
    imagen: "/proyectos/disgrafia/fondo_1.png",
    tag: "prototipos", // Etiqueta para filtrar
    enlace: "/proyectos/disgrafia/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Memory",
    descripcion: "",
    imagen: "/proyectos/memory/fondo_1.png",
    tag: "prototipos", // Etiqueta para filtrar
    enlace: "/proyectos/memory/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Mate Monstruos",
    descripcion: "",
    imagen: "/proyectos/mate/fondo_1.png",
    tag: "prototipos", // Etiqueta para filtrar
    enlace: "/proyectos/mate/index.html", // Enlace a la página del proyecto
  },
   {
    titulo: "Mochila",
    descripcion: "",
    imagen: "/proyectos/mochila/fondo_1.png",
    tag: "prototipos", // Etiqueta para filtrar
    enlace: "/proyectos/mochila/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Avatar Tech Portada",
    descripcion: "",
    imagen: "/img/proyectos/avatartech.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/proyectos/observatorioEspacial/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Observatorio",
    descripcion: "",
    imagen: "/proyectos/observatorioEspacial/fondo.png",
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
    imagen: "/proyectos/rutaTuristica/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/proyectos/rutaTuristica/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Filtro Web",
    descripcion: "",
    imagen: "/proyectos/filtroWeb/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/proyectos/filtroWeb/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Restaurante",
    descripcion: "",
    imagen: "/proyectos/CakeWorld/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/proyectos/CakeWorld/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Cartelera",
    descripcion: "",
    imagen: "/proyectos/cartelera/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/proyectos/cartelera/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Particulas - Imágenes",
    descripcion: "",
    imagen: "/proyectos/ParticulasTerminado/fondo.png",
    tag: "proyectos", // Etiqueta para filtrar
    enlace: "/proyectos/ParticulasTerminado/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Avatar, El último maestro del aire",
    descripcion: "",
    imagen: "/miniProyectos/avatar/fondo.png",
    tag: "otros", // Etiqueta para filtrar
    enlace: "/miniProyectos/avatar/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Carrusel de Imágenes",
    descripcion: "",
    imagen: "/miniProyectos/carrucel3D/fondo.png",
    tag: "otros", // Etiqueta para filtrar
    enlace: "/miniProyectos/carrucel3D/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación de Circulos",
    descripcion: "",
    imagen: "/miniProyectos/circulo/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/circulo/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación de Cuadrados",
    descripcion: "",
    imagen: "/miniProyectos/cuadrados/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/cuadrados/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Efecto luces",
    descripcion: "",
    imagen: "/miniProyectos/efectoLuz/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/efectoLuz/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Efecto Olas",
    descripcion: "",
    imagen: "/miniProyectos/efectoOlas/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/efectoOlas/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Galería de Imágenes",
    descripcion: "",
    imagen: "/miniProyectos/galeriaEA/fondo.png",
    tag: "otros", // Etiqueta para filtrar
    enlace: "/miniProyectos/galeriaEA/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Atrapar el objetivo - Juego",
    descripcion: "",
    imagen: "/miniProyectos/juegoAtraparObjetivo/fondo.png",
    tag: "juegos", // Etiqueta para filtrar
    enlace: "/miniProyectos/juegoAtraparObjetivo/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Buscar los pares - Juego",
    descripcion: "",
    imagen: "/miniProyectos/juegoBusquedaPares/fondo.png",
    tag: "juegos", // Etiqueta para filtrar
    enlace: "/miniProyectos/juegoBusquedaPares/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Letras",
    descripcion: "",
    imagen: "/miniProyectos/letras/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/letras/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Loading",
    descripcion: "",
    imagen: "/miniProyectos/loading/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/loading/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Mosaico Círculos",
    descripcion: "",
    imagen: "/miniProyectos/mosaicoCirculos/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/mosaicoCirculos/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Netflix",
    descripcion: "",
    imagen: "/miniProyectos/netflix/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/netflix/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Orbitas",
    descripcion: "",
    imagen: "/miniProyectos/orbitas/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/orbitas/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Pájaros",
    descripcion: "",
    imagen: "/miniProyectos/pajaro/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/pajaro/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Animación Patrones de Líneas",
    descripcion: "",
    imagen: "/miniProyectos/patronesLineas/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/patronesLineas/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Piano - Juego",
    descripcion: "",
    imagen: "/miniProyectos/piano/fondo.png",
    tag: "juegos", // Etiqueta para filtrar
    enlace: "/miniProyectos/piano/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "San Valentín",
    descripcion: "",
    imagen: "/miniProyectos/sanValentin/fondo.png",
    tag: "juegos", // Etiqueta para filtrar
    enlace: "/miniProyectos/sanValentin/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Serpiente - Juego",
    descripcion: "",
    imagen: "/miniProyectos/serpiente/fondo.png",
    tag: "juegos", // Etiqueta para filtrar
    enlace: "/miniProyectos/serpiente/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "Super Héroes",
    descripcion: "",
    imagen: "/miniProyectos/super heroes/fondo.png",
    tag: "otros", // Etiqueta para filtrar
    enlace: "/miniProyectos/super heroes/index.html", // Enlace a la página del proyecto
  },
  {
    titulo: "To do List",
    descripcion: "",
    imagen: "/miniProyectos/toDoList/fondo.png",
    tag: "otros", // Etiqueta para filtrar
    enlace: "/miniProyectos/toDoList/index.html", // Enlace a la página del proyecto
  },
    {
    titulo: "Animación Efecto Matrix",
    descripcion: "",
    imagen: "/miniProyectos/Matrix/fondo.png",
    tag: "animaciones", // Etiqueta para filtrar
    enlace: "/miniProyectos/Matrix/index.html", // Enlace a la página del proyecto
  },
  // Agrega más cartas según sea necesario
];
// Función para renderizar cartas
function renderCartas(filterTag = "todos") {
  const contenedorCartas = document.getElementById("cartas");
  if (!contenedorCartas) return;
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
if (document.querySelectorAll(".boton-filtro").length > 0) {
  document.querySelectorAll(".boton-filtro").forEach((boton) => {
    boton.addEventListener("click", () => {
      const tag = boton.getAttribute("data-tag"); // Obtener la etiqueta del botón
      renderCartas(tag); // Renderizar cartas con la etiqueta seleccionada
    });
  });
}

// Renderizar todas las cartas al cargar la página
document.addEventListener("DOMContentLoaded", () => renderCartas());
// Eliminar llamada a generarCartas inexistente
