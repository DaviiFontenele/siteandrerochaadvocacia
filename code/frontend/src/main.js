import { animate } from "motion";

/* ==========================================================================
   DOM ELEMENTS & INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initAnimations();
  initContactForm();
});

/* ==========================================================================
   NAVBAR LOGIC (SCROLL & MOBILE MENU)
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menu-toggle-btn");
  const navMenu = document.getElementById("nav-menu-elem");
  const navLinks = document.querySelectorAll(".tab-item");
  const sections = document.querySelectorAll("section[id]");

  if (!header || !menuToggle || !navMenu) return;

  // Shrunk header on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Active link highlighting
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add("active");
      } else {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Trigger initially

  // Mobile Hamburger toggle
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close menu on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   ANIMATIONS (USING MOTION LIBRARY & INTERSECTION OBSERVER)
   ========================================================================== */
function initAnimations() {
  // 1. Hero Entrance Animations (on load)
  const heroElements = document.querySelectorAll(".animate-on-load");
  heroElements.forEach((el, index) => {
    animate(
      el, 
      { opacity: [0, 1], y: [35, 0] }, 
      { delay: index * 0.15, duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );
  });

  // 2. Slow floating loops for background leaves
  animate(
    ".leaf-1", 
    { y: [0, 15, 0], rotate: [45, 60, 45] }, 
    { duration: 8, repeat: Infinity, easing: "ease-in-out" }
  );
  animate(
    ".leaf-2", 
    { y: [0, -12, 0], rotate: [30, 42, 30] }, 
    { duration: 6, repeat: Infinity, easing: "ease-in-out" }
  );
  animate(
    ".leaf-3", 
    { y: [0, 8, 0], rotate: [50, 38, 50] }, 
    { duration: 9, repeat: Infinity, easing: "ease-in-out" }
  );

  // 3. Scroll Reveal using IntersectionObserver + Motion
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(
          entry.target, 
          { opacity: [0, 1], y: [40, 0] }, 
          { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
        );
        observer.unobserve(entry.target); // Animate once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
  });

  const scrollReveals = document.querySelectorAll(".scroll-reveal");
  scrollReveals.forEach(el => {
    // Initial state set in CSS as opacity 0 and slightly shifted
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & SIMULATED SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nomeInput = document.getElementById("form-nome");
  const whatsappInput = document.getElementById("form-whatsapp");
  const emailInput = document.getElementById("form-email");
  const assuntoSelect = document.getElementById("form-assunto");
  const mensagemTextarea = document.getElementById("form-mensagem");
  
  const submitBtn = document.getElementById("btn-submit-form");
  const spinner = document.getElementById("form-spinner");
  const successAlert = document.getElementById("form-success-alert");
  const generalErrorAlert = document.getElementById("form-general-error-alert");

  // Form input masks/behaviors (Simple phone formatting)
  whatsappInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    // Format: (XX) XXXXX-XXXX
    if (value.length > 6) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      e.target.value = `(${value}`;
    }
  });

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    const rawDigits = phone.replace(/\D/g, "");
    return rawDigits.length >= 10 && rawDigits.length <= 11;
  };

  const checkField = (input, condition) => {
    if (condition) {
      input.classList.remove("is-invalid");
      return true;
    } else {
      input.classList.add("is-invalid");
      return false;
    }
  };

  // Real-time error clearance on input
  const inputs = [nomeInput, whatsappInput, emailInput, assuntoSelect, mensagemTextarea];
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
      generalErrorAlert.style.display = "none";
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Clear alerts
    successAlert.style.display = "none";
    generalErrorAlert.style.display = "none";

    // Run validations
    const isNomeValid = checkField(nomeInput, nomeInput.value.trim().length > 2);
    const isPhoneValid = checkField(whatsappInput, validatePhone(whatsappInput.value));
    const isEmailValid = checkField(emailInput, validateEmail(emailInput.value.trim()));
    const isAssuntoValid = checkField(assuntoSelect, assuntoSelect.value !== "");
    const isMensagemValid = checkField(mensagemTextarea, mensagemTextarea.value.trim().length >= 10);

    const isFormValid = isNomeValid && isPhoneValid && isEmailValid && isAssuntoValid && isMensagemValid;

    if (!isFormValid) {
      generalErrorAlert.style.display = "block";
      // Auto-focus the first invalid field
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Form is valid - Submit to n8n webhook
    setSubmitting(true);

    const formData = {
      nome: nomeInput.value.trim(),
      whatsapp: whatsappInput.value.trim(),
      email: emailInput.value.trim(),
      assunto: assuntoSelect.value,
      mensagem: mensagemTextarea.value.trim(),
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await fetch("https://n8n.solucionaimoveis.cloud/webhook/2642f15e-08b0-4ffc-b049-7529678827ab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Webhook submission failed");
      }

      // Success response handling
      successAlert.style.display = "block";
      form.reset();

      // Scroll to alert smoothly
      successAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      generalErrorAlert.textContent = "Houve um erro ao enviar a mensagem. Por favor, tente novamente ou fale diretamente pelo WhatsApp.";
      generalErrorAlert.style.display = "block";
    } finally {
      setSubmitting(false);
    }
  });

  function setSubmitting(isSubmitting) {
    if (isSubmitting) {
      submitBtn.disabled = true;
      spinner.style.display = "inline-block";
      submitBtn.querySelector(".btn-text").textContent = "Enviando...";
    } else {
      submitBtn.disabled = false;
      spinner.style.display = "none";
      submitBtn.querySelector(".btn-text").textContent = "Enviar Mensagem";
    }
  }
}
