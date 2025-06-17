// Manejo del cambio de tema
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", function() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    
    // Aplicar transición suave
    html.style.transition = "background-color 0.5s ease, color 0.5s ease";
    
    if(isDark) {
      html.setAttribute("data-theme", "light");
    } else {
      html.setAttribute("data-theme", "dark");
    }
  });
}

// Manejo del cambio de idioma
function initLanguageToggle() {
  const languageToggle = document.getElementById("language-toggle");
  const languageText = languageToggle.querySelector(".floating-buttons__text");
  let currentLang = "es";

  const translations = {
    es: {
      "projects": "Proyectos",
      "project1-title": "Fylo Dark Theme Landing Page",
      "project1-desc": "Este proyecto representa una página de inicio con un diseño oscuro, ideal para practicar habilidades en HTML y CSS, con maquetación responsive.",
      "project2-title": "Huddle Landing Page",
      "project2-desc": "Página de inicio con diseño visualmente atractivo y organizado, secciones curvas y un aspecto moderno. Ideal para practicar maquetación avanzada.",
      "project3-title": "Juego de Rompecabezas",
      "project3-desc": "Desarrollado en JavaScript, con diferentes niveles de dificultad y un registro de puntuaciones. Permite practicar la manipulación del DOM y manejo de eventos.",
      "project4-title": "Reproductor Musical",
      "project4-desc": "Aplicación web que reproduce pistas de audio con una interfaz personalizable, utilizando HTML5 Audio API y un diseño responsivo.",
      "project5-title": "Memorama",
      "project5-desc": "Juego de cartas tipo 'memory' con contadores de tiempo y movimientos, implementado con JavaScript y animaciones en CSS.",
      "skills": "Habilidades",
      "certifications": "Certificaciones",
      "experience": "Experiencia Laboral",
      "contact": "Contacto",
      "name": "Nombre",
      "email": "Correo Electrónico",
      "subject": "Asunto",
      "message": "Mensaje",
      "send": "Enviar Mensaje",
      "exp1-company": "Broisin Solutions",
      "exp1-role": "Frontend Developer (2022 - 2024)",
      "exp1-desc": "En este proyecto realicé mejoras visuales al frontend del sistema de cafetería, además de implementar endpoints desde la lado frontend y optimizar el código de producción.",
      "exp2-company": "OUTRISE Studios",
      "exp2-role": "Videogame Developer (2024 - Presente)",
      "exp2-desc": "Implementé mecánicas de juego innovadoras, colaborando con un equipo multidisciplinario para garantizar una experiencia de juego atractiva y fluida. Además, realicé una auditoría completa del proyecto para optimizar y eliminar componentes innecesarios."
    },
    en: {
      "projects": "Projects",
      "project1-title": "Fylo Dark Theme Landing Page",
      "project1-desc": "This project represents a landing page with a dark design, ideal for practicing HTML and CSS skills, with responsive layout.",
      "project2-title": "Huddle Landing Page",
      "project2-desc": "Landing page with visually appealing and organized design, curved sections and a modern look. Ideal for practicing advanced layout.",
      "project3-title": "Puzzle Game",
      "project3-desc": "Developed in JavaScript, with different difficulty levels and score tracking. Allows practicing DOM manipulation and event handling.",
      "project4-title": "Music Player",
      "project4-desc": "Web application that plays audio tracks with a customizable interface, using HTML5 Audio API and responsive design.",
      "project5-title": "Memory Game",
      "project5-desc": "Card matching game with time and move counters, implemented with JavaScript and CSS animations.",
      "skills": "Skills",
      "certifications": "Certifications",
      "experience": "Work Experience",
      "contact": "Contact",
      "name": "Name",
      "email": "Email",
      "subject": "Subject",
      "message": "Message",
      "send": "Send Message",
      "exp1-company": "Broisin Solutions",
      "exp1-role": "Frontend Developer (2022 - 2024)",
      "exp1-desc": "In this project, I made visual improvements to the cafeteria system's frontend, in addition to implementing frontend endpoints and optimizing production code.",
      "exp2-company": "OUTRISE Studios",
      "exp2-role": "Videogame Developer (2024 - Present)",
      "exp2-desc": "I implemented innovative game mechanics, collaborating with a multidisciplinary team to ensure an engaging and smooth gaming experience. Additionally, I conducted a complete project audit to optimize and remove unnecessary components."
    }
  };

  function updateLanguage(lang) {
    document.querySelectorAll("[data-lang]").forEach(element => {
      const key = element.getAttribute("data-lang");
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    languageText.textContent = lang === "es" ? "EN" : "ES";
    currentLang = lang;
    // Opcional: guardar la preferencia de idioma en localStorage
    // localStorage.setItem('preferredLang', lang);
  }

  // Opcional: cargar la preferencia de idioma al cargar la página
  // const savedLang = localStorage.getItem('preferredLang');
  // if (savedLang) {
  //   updateLanguage(savedLang);
  // } else {
  //   updateLanguage(currentLang); // Establecer idioma por defecto (ES)
  // }
    updateLanguage(currentLang); // Establecer idioma por defecto (ES)

  languageToggle.addEventListener("click", function() {
    const newLang = currentLang === "es" ? "en" : "es";
    updateLanguage(newLang);
  });
}

// Manejo del formulario de contacto
function initContactForm() {
  const contactFormElement = document.getElementById("contact-form");
  
  contactFormElement.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const formData = {
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    };
    
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log("Datos del formulario:", formData);
    
    // Mostrar mensaje de éxito
    alert("¡Gracias por tu mensaje! Te responderé pronto.");
    
    // Limpiar el formulario
    contactFormElement.reset();
  });
}

// Animaciones al hacer scroll
function initScrollAnimations() {
  const header = document.querySelector("header");
  const sections = document.querySelectorAll("section");
  const projectCards = document.querySelectorAll(".projects__card");
  const skillTags = document.querySelectorAll(".skills__tag");
  const experienceItems = document.querySelectorAll(".experience__item");
  const certificationItems = document.querySelectorAll(".certifications__item");
  // Obtener los elementos del formulario dentro de la sección de contacto
  const contactSection = document.getElementById("contact");
  const contactForm = contactSection ? contactSection.querySelector(".contact-form") : null;
  const formGroups = contactForm ? contactForm.querySelectorAll(".contact-form__group") : [];
  const submitBtn = contactForm ? contactForm.querySelector(".contact-form__submit") : null;
  
  const footer = document.querySelector("footer");

  // Configurar índices para las animaciones escalonadas
  projectCards.forEach((card, index) => {
    card.style.setProperty('--card-index', index);
  });

  skillTags.forEach((tag, index) => {
    tag.style.setProperty('--tag-index', index);
  });

  experienceItems.forEach((item, index) => {
    item.style.setProperty('--exp-index', index);
  });

  formGroups.forEach((group, index) => {
    group.style.setProperty('--form-group-index', index);
  });

  certificationItems.forEach((item, index) => {
    item.style.setProperty('--cert-index', index);
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        // Animar la sección/header/footer principal
        if (entry.target.tagName === 'HEADER') {
          entry.target.classList.add('hero--visible');
        } else if (entry.target.tagName === 'FOOTER') {
          entry.target.classList.add('footer--visible');
        } else if (entry.target.tagName === 'SECTION') {
           entry.target.classList.add('section--visible');
        }

        // Animar elementos hijos si existen y si la sección padre es visible
        if(entry.target.id === 'projects') {
          projectCards.forEach(card => card.classList.add('projects__card--visible'));
        } else if(entry.target.id === 'skills') {
          skillTags.forEach(tag => tag.classList.add('skills__tag--visible'));
        } else if(entry.target.id === 'experience') {
          experienceItems.forEach(item => item.classList.add('experience__item--visible'));
        } else if(entry.target.id === 'certifications') {
          certificationItems.forEach(item => item.classList.add('certifications__item--visible'));
        } else if(entry.target.id === 'contact') {
          // Asegurarse de que los elementos del formulario existen antes de añadir la clase
          if (contactForm) {
             contactForm.classList.add('contact-form--visible');
             formGroups.forEach(group => group.classList.add('contact-form__group--visible'));
             if (submitBtn) {
                submitBtn.classList.add('contact-form__submit--visible');
             }
          }
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
  observer.observe(header);
  observer.observe(footer);
}

// Inicializar todo cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {
  initThemeToggle();
  initLanguageToggle();
  initContactForm();
  initScrollAnimations();
});
