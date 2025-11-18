  // =========================
// Contadores animados
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");
  const options = {
    root: null,
    threshold: 0.3,
  };

  const animateCounter = (entry) => {
    const counter = entry.target;
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = target / 100;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 30);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry);
        obs.unobserve(entry.target);
      }
    });
  }, options);

  counters.forEach((counter) => observer.observe(counter));
});

// =========================
// Navbar oculta al hacer scroll hacia abajo
// =========================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scroll hacia abajo -> ocultar navbar
    navbar.classList.add('navbar-hidden');
  } else {
    // Scroll hacia arriba -> mostrar navbar
    navbar.classList.remove('navbar-hidden');
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // evitar negativos
});

// =========================
// Modal abrir/cerrar
// =========================
function abrirModal() {
  document.getElementById('modal-rin').classList.add('open');
}

function cerrarModal() {
  document.getElementById('modal-rin').classList.remove('open');
}

// =========================
// Cambiar imagen principal desde miniaturas
// =========================
function changeMainImage(thumbnail) {
  const mainImage = document.getElementById('mainImage');
  mainImage.src = thumbnail.src;
}

// =========================
// ScrollReveal animaciones
// =========================
ScrollReveal().reveal('.contenedor-rines', {
  distance: '20px',
  duration: 1000,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  origin: 'bottom',
  opacity: 0,
  interval: 100,
  reset: false
});

ScrollReveal().reveal('.seccion-rines-premium h2', {
  distance: '40px',
  duration: 1000,
  origin: 'top',
  delay: 200,
  reset: false
});

ScrollReveal().reveal('.descripcion-rines', {
  distance: '40px',
  duration: 1000,
  origin: 'bottom',
  delay: 400,
  reset: false
});

ScrollReveal().reveal('.boton-cta', {
  distance: '30px',
  duration: 1000,
  origin: 'bottom',
  delay: 600,
  reset: false
});


document.addEventListener("DOMContentLoaded", function() {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector("#navbarNav");
  const overlay = document.querySelector("#menuOverlay");
  const rinesLink = document.querySelector("#rinesDropdown");
  const rinesMenu = rinesLink?.nextElementSibling;
  const navbar = document.querySelector(".navbar");

  // Toggle menú principal (hamburguesa)
  navbarToggler.addEventListener("click", function() {
    const isOpen = menu.classList.toggle("show");
    overlay.classList.toggle("active");
    this.classList.toggle("open", isOpen);
    this.setAttribute("aria-expanded", isOpen);
  });

  // Cerrar menú al hacer click en overlay
  overlay.addEventListener("click", function() {
    menu.classList.remove("show");
    overlay.classList.remove("active");
    navbarToggler.classList.remove("open");
    navbarToggler.setAttribute("aria-expanded", "false");

    // También cerramos dropdown "Rines" si está abierto
    if (rinesMenu.classList.contains("show")) {
      rinesMenu.classList.remove("show");
      rinesLink.setAttribute("aria-expanded", "false");
    }
  });

  // Control de dropdown "Rines" en móvil (toggle al hacer click)
  rinesLink.addEventListener("click", function(e) {
    if (window.innerWidth <= 991) {
      e.preventDefault();
      const isDropdownOpen = rinesMenu.classList.toggle("show");
      rinesLink.setAttribute("aria-expanded", isDropdownOpen);
    }
  });

  // En escritorio, cerrar dropdown y menú si cambias tamaño desde móvil
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) {
      // Quitar clases y estados de menú y dropdown
      menu.classList.remove("show");
      overlay.classList.remove("active");
      navbarToggler.classList.remove("open");
      navbarToggler.setAttribute("aria-expanded", "false");
      rinesMenu.classList.remove("show");
      rinesLink.setAttribute("aria-expanded", "false");
    }
  });

  // Efecto ocultar navbar al hacer scroll
  let lastScrollTop = 0;
  window.addEventListener("scroll", function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
      // Scroll hacia abajo → ocultar
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Scroll hacia arriba → mostrar
      navbar.style.transform = "translateY(0)";
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});

// Abrir modal
function abrirModal() {
  document.getElementById("modal-rin").classList.add("open");
}

// Cerrar modal
function cerrarModal() {
  document.getElementById("modal-rin").classList.remove("open");
}

// Cerrar si se da click fuera del contenido
window.addEventListener("click", function(e) {
  const modal = document.getElementById("modal-rin");
  if (e.target === modal) {
    cerrarModal();
  }
});

// Cerrar con tecla ESC
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    cerrarModal();
  }
});

