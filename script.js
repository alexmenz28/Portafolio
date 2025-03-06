document.addEventListener("DOMContentLoaded", function() {
    /* MENÚ HAMBURGUESA */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    
    menuToggle.addEventListener("click", function() {
      menuToggle.classList.toggle("active");
      nav.classList.toggle("active");
    });
    
    /* SMOOTH SCROLL PARA NAVEGACIÓN */
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        document.querySelector(targetId).scrollIntoView({
          behavior: "smooth"
        });
        // Cerrar menú en móviles tras seleccionar opción
        if (nav.classList.contains("active")) {
          nav.classList.remove("active");
          menuToggle.classList.remove("active");
        }
      });
    });
    
    /* ANIMAR BARRAS DE PROGRESO AL HACER SCROLL A LA SECCIÓN DE HABILIDADES */
    const progressElements = document.querySelectorAll(".progress");
    
    const animateProgressBars = () => {
      progressElements.forEach(el => {
        const progress = el.getAttribute("data-progress");
        el.style.width = progress + "%";
      });
    };
    
    // Usamos IntersectionObserver para detectar cuando la sección skills es visible
    const skillsSection = document.querySelector("#skills");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateProgressBars();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(skillsSection);
    } else {
      // Fallback si IntersectionObserver no está disponible
      animateProgressBars();
    }
    
    /* MODAL PARA PROYECTOS */
    const modal = document.getElementById("project-modal");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const closeModal = document.querySelector(".close-modal");
    
    // Abrir modal al hacer clic en "Ver más" en cada tarjeta de proyecto
    const projectButtons = document.querySelectorAll(".open-modal");
    projectButtons.forEach(button => {
      button.addEventListener("click", function() {
        const projectCard = this.parentElement;
        const title = projectCard.getAttribute("data-title");
        const description = projectCard.getAttribute("data-description");
        const image = projectCard.getAttribute("data-image");
        
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalImage.src = image;
        
        modal.style.display = "flex";
      });
    });
    
    // Cerrar modal al hacer clic en el botón de cerrar
    closeModal.addEventListener("click", function() {
      modal.style.display = "none";
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", function(e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  