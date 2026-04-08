document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupActiveNavLinks();
  setupSmoothScrolling();
  setupContactForm();
});

/* =========================
   MOBILE MENU
========================= */
function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("show");

    const expanded = navLinks.classList.contains("show");
    menuToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (event) {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* =========================
   ACTIVE NAV LINK
========================= */
function setupActiveNavLinks() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navAnchors = document.querySelectorAll(".nav-links a");

  navAnchors.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }

    if (currentPage === "" && linkPage === "index.html") {
      link.classList.add("active");
    }
  });
}

/* =========================
   SMOOTH SCROLLING
========================= */
function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

/* =========================
   CONTACT FORM
========================= */
function setupContactForm() {
  const form = document.querySelector("form");
  if (!form) return;

  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const phoneField = document.querySelector("#phone");
  const serviceField = document.querySelector("#service");
  const messageField = document.querySelector("#message");

  injectFormMessageBox(form);

  form.addEventListener("submit", function (e) {
    clearFieldErrors();
    clearFormMessage();

    const errors = [];

    if (nameField && nameField.value.trim().length < 2) {
      errors.push({
        field: nameField,
        message: "Please enter your full name."
      });
    }

    if (emailField && !isValidEmail(emailField.value.trim())) {
      errors.push({
        field: emailField,
        message: "Please enter a valid email address."
      });
    }

    if (phoneField && phoneField.value.trim() !== "" && !isValidPhone(phoneField.value.trim())) {
      errors.push({
        field: phoneField,
        message: "Please enter a valid phone number."
      });
    }

    if (serviceField && serviceField.value.trim() === "") {
      errors.push({
        field: serviceField,
        message: "Please select a service."
      });
    }

    if (messageField && messageField.value.trim().length < 10) {
      errors.push({
        field: messageField,
        message: "Please enter a message with at least 10 characters."
      });
    }

    if (errors.length > 0) {
      e.preventDefault();
      errors.forEach((error) => showFieldError(error.field, error.message));
      showFormMessage("Please correct the highlighted fields and try again.", "error");
      return;
    }

    const action = form.getAttribute("action");

    /* 
      STATIC / PLACEHOLDER MODE:
      If action is missing or still '#', stop submission
      and show a success-style message so the site doesn't break.
    */
    if (!action || action.trim() === "#" || action.trim() === "") {
      e.preventDefault();

      showFormMessage(
        "Your form is ready, but email delivery is not connected yet. We’ll connect it to Formspree next.",
        "success"
      );

      form.reset();
      return;
    }

    /*
      FORMspree / REAL SUBMISSION MODE:
      If action is set to a real endpoint, allow the form to submit normally.
      You can later change this to AJAX if you want no page refresh.
    */
    showFormMessage("Submitting your request...", "success");
  });
}

/* =========================
   HELPERS
========================= */
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function showFieldError(field, message) {
  if (!field) return;

  field.style.borderColor = "#d64545";
  field.setAttribute("aria-invalid", "true");

  const error = document.createElement("div");
  error.className = "field-error";
  error.textContent = message;
  error.style.color = "#d64545";
  error.style.fontSize = "0.9rem";
  error.style.marginTop = "-10px";
  error.style.marginBottom = "14px";

  field.insertAdjacentElement("afterend", error);
}

function clearFieldErrors() {
  const errors = document.querySelectorAll(".field-error");
  errors.forEach((error) => error.remove());

  const fields = document.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.style.borderColor = "";
    field.removeAttribute("aria-invalid");
  });
}

function injectFormMessageBox(form) {
  let formMessage = document.querySelector(".form-message");

  if (!formMessage) {
    formMessage = document.createElement("div");
    formMessage.className = "form-message";
    formMessage.style.marginBottom = "18px";
    formMessage.style.padding = "14px 16px";
    formMessage.style.borderRadius = "12px";
    formMessage.style.fontWeight = "600";
    formMessage.style.display = "none";

    form.insertAdjacentElement("beforebegin", formMessage);
  }
}

function showFormMessage(message, type) {
  const formMessage = document.querySelector(".form-message");
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.style.display = "block";

  if (type === "error") {
    formMessage.style.backgroundColor = "#fdeaea";
    formMessage.style.color = "#a12626";
    formMessage.style.border = "1px solid #f3b5b5";
  } else {
    formMessage.style.backgroundColor = "#e9f8f4";
    formMessage.style.color = "#146c5a";
    formMessage.style.border = "1px solid #b8eadc";
  }
}

function clearFormMessage() {
  const formMessage = document.querySelector(".form-message");
  if (!formMessage) return;

  formMessage.textContent = "";
  formMessage.style.display = "none";
}
