// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// Mobile nav toggle
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// Simple parallax for layers and hero background
const parallaxElements = document.querySelectorAll("[data-parallax-speed]");

function handleParallax() {
  const scrollY = window.scrollY || window.pageYOffset;
  parallaxElements.forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0;
    const translateY = scrollY * speed;
    el.style.transform = `translate3d(0, ${translateY}px, 0)`;
  });
}

window.addEventListener("scroll", handleParallax);
handleParallax();

// Modal logic
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const systemCards = document.querySelectorAll(".system-card");
let activeModal = null;

function openModal(selector) {
  const modal = document.querySelector(selector);
  if (!modal || !modalBackdrop) return;
  activeModal = modal;
  modalBackdrop.classList.add("active");
  modal.style.display = "block";
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("active");
  if (activeModal) {
    activeModal.style.display = "none";
    activeModal = null;
  }
}

systemCards.forEach((card) => {
  card.addEventListener("click", () => {
    const target = card.getAttribute("data-modal-target");
    if (target) {
      openModal(target);
    }
  });
});

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });
}

document.querySelectorAll(".modal-close").forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

// Lite tilt effect for identity cards
const tiltCards = document.querySelectorAll("[data-tilt]");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});
