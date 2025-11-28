// =============================
// Starfield background
// =============================

const canvas = document.getElementById("starfield");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticles() {
  if (!canvas || !ctx) return;
  particles = [];
  const count = Math.floor((width * height) / 28000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.5 + 0.3
    });
  }
}

function drawParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#43ff8a";

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

// =============================
// Smooth scroll to contact
// =============================

function scrollToContact() {
  const contact = document.getElementById("contact");
  if (contact) {
    contact.scrollIntoView({ behavior: "smooth" });
  }
}

// Optional: scroll to projects if a button with this id exists
const scrollProjectsBtn = document.getElementById("scrollProjects");
if (scrollProjectsBtn) {
  scrollProjectsBtn.addEventListener("click", () => {
    const projects = document.getElementById("projects");
    if (projects) {
      projects.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// =============================
// Footer year
// =============================

const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// =============================
// Offline QR generator
// =============================

(function setupQR() {
  const qrInput = document.getElementById("qr-text");
  const qrButton = document.getElementById("qr-generate-btn");
  const qrContainer = document.getElementById("qr-code");

  if (!qrInput || !qrButton || !qrContainer || typeof QRCode === "undefined") {
    return;
  }

  // initial empty QR (so box is ready)
  let qr = new QRCode(qrContainer, {
    text: "",
    width: 200,
    height: 200
  });

  function generateQR() {
    const text = qrInput.value.trim();
    if (!text) {
      qrContainer.innerHTML = "";
      return;
    }

    // clear old code
    qrContainer.innerHTML = "";

    qr = new QRCode(qrContainer, {
      text: text,
      width: 200,
      height: 200
    });
  }

  qrButton.addEventListener("click", generateQR);

  qrInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generateQR();
    }
  });
})();
