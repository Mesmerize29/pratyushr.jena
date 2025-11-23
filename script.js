// === Hero star magnet field ===
(function () {
  const hero = document.querySelector(".hero");
  const container = document.querySelector(".hero-particles");
  if (!hero || !container) return;

  const NUM_PARTICLES = 80;       // how many stars
  const particles = [];
  const mouse = { x: 0, y: 0, inside: false };

  function resetParticles() {
    const rect = hero.getBoundingClientRect();

    // make sure we have enough <span> elements
    while (container.children.length < NUM_PARTICLES) {
      container.appendChild(document.createElement("span"));
    }

    const spans = Array.from(container.querySelectorAll("span")).slice(
      0,
      NUM_PARTICLES
    );

    spans.forEach((el, index) => {
      const baseX = Math.random() * rect.width;
      const baseY = Math.random() * rect.height;

      const size = 2 + Math.random() * 3;
      el.style.width = size + "px";
      el.style.height = size + "px";

      particles[index] = {
        el,
        baseX,
        baseY,
        floatAmp: 15 + Math.random() * 20,      // how far it bobs up and down
        floatSpeed: 0.4 + Math.random() * 0.8,  // how fast it bobs
        floatPhase: Math.random() * Math.PI * 2,
        sizeBase: size
      };
    });
  }

  // track mouse position inside hero
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.inside = true;
  });

  hero.addEventListener("mouseenter", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.inside = true;
  });

  hero.addEventListener("mouseleave", () => {
    mouse.inside = false;
  });

  window.addEventListener("resize", resetParticles);

  function animate(time) {
    const t = time / 1000;
    const rect = hero.getBoundingClientRect();
    const attractRadius = 260; // how far the cursor pulls stars
    const minRadius = 60;      // hollow bubble around the cursor

    particles.forEach((p) => {
      // base floating motion
      const floatY =
        p.floatAmp * Math.sin(t * p.floatSpeed + p.floatPhase);

      let finalX = p.baseX;
      let finalY = p.baseY + floatY;

      if (mouse.inside) {
        // vector from star's base position to mouse
        const dx0 = mouse.x - p.baseX;
        const dy0 = mouse.y - (p.baseY + floatY);
        const dist0 = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 0.001;

        // 0 near mouse, 1 far
        const tNorm = Math.min(dist0 / attractRadius, 1);

        // stronger pull when close, almost none far away
        const strength = 0.25 * (1 - tNorm);

        let offsetX = dx0 * strength;
        let offsetY = dy0 * strength;

        finalX = p.baseX + offsetX;
        finalY = p.baseY + floatY + offsetY;

        // keep a hollow zone around the cursor so stars never sit on it
        const dx2 = mouse.x - finalX;
        const dy2 = mouse.y - finalY;
        const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 0.001;

        if (d2 < minRadius) {
          const ratio = minRadius / d2;
          finalX = mouse.x - dx2 * ratio;
          finalY = mouse.y - dy2 * ratio;
        }
      }

      // clamp to hero bounds
      if (finalX < 0) finalX = 0;
      if (finalX > rect.width) finalX = rect.width;
      if (finalY < 0) finalY = 0;
      if (finalY > rect.height) finalY = rect.height;

      // size: closer to mouse = smaller, farther = slightly bigger
      const distToMouse = Math.sqrt(
        (mouse.x - finalX) * (mouse.x - finalX) +
        (mouse.y - finalY) * (mouse.y - finalY)
      ) || attractRadius;

      const dNorm2 = Math.min(distToMouse / attractRadius, 1);
      const scale = 0.4 + 0.9 * dNorm2;

      p.el.style.left = finalX + "px";
      p.el.style.top = finalY + "px";
      p.el.style.transform = `scale(${scale})`;
    });

    requestAnimationFrame(animate);
  }

  resetParticles();
  requestAnimationFrame(animate);
})();

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
