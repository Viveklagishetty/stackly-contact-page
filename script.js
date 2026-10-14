const menuButton = document.getElementById("menuButton");
const navLinks   = document.getElementById("navLinks");
const form       = document.getElementById("contactForm");
const contactView  = document.getElementById("contactView");
const notFoundView = document.getElementById("notFoundView");

menuButton.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.textContent = isOpen ? "✕" : "☰";
});

const rules = {
  name: function (value) {
    return value.trim().length > 1;
  },
  email: function (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  message: function (value) {
    return value.trim().length >= 10;
  }
};

function checkField(id) {
  const input = document.getElementById(id);
  const field = input.closest(".field");
  const isValid = rules[id](input.value);

  field.classList.toggle("has-error", !isValid);
  return isValid;
}

Object.keys(rules).forEach(function (id) {
  document.getElementById(id).addEventListener("blur", function () {
    checkField(id);
  });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const results = Object.keys(rules).map(checkField);

  if (results.includes(false)) {
    document.querySelector(".has-error input, .has-error textarea").focus();
    return;
  }

  showPage("404");
});

function showPage(page) {
  const showNotFound = (page === "404");

  contactView.hidden  = showNotFound;
  notFoundView.hidden = !showNotFound;

  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (!showNotFound && link.dataset.go === "contact") {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.title = showNotFound ? "404 - Page not found" : "Contact us";

  navLinks.classList.remove("open");
  menuButton.textContent = "☰";
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-go]").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    showPage(link.dataset.go);
  });
});

showPage("contact");
