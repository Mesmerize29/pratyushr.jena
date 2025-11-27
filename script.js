// background particles
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticles() {
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

resizeCanvas();
createParticles();
drawParticles();
window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

// smooth scroll to projects
document.getElementById("scrollProjects")?.addEventListener("click", () => {
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
});

// footer year
document.getElementById("year").textContent = new Date().getFullYear();

// modal logic
const pitchModal = document.getElementById("pitchModal");
const openPitchModal = document.getElementById("openPitchModal");
const topPitchBtn = document.getElementById("topPitchBtn");
const closeModal = document.getElementById("closeModal");

function showModal() {
  pitchModal.classList.add("show");
}

function hideModal() {
  pitchModal.classList.remove("show");
}

openPitchModal?.addEventListener("click", showModal);
topPitchBtn?.addEventListener("click", showModal);
closeModal?.addEventListener("click", hideModal);
pitchModal?.addEventListener("click", (e) => {
  if (e.target === pitchModal.querySelector(".modal-backdrop")) {
    hideModal();
  }
});

// helper: open mailto with structured body
function openMail({ name, email, idea }) {
  const to = "pratyushr.jena@gmail.com";
  const subject = encodeURIComponent("Collaboration Pitch via Portfolio");
  const bodyLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Collaboration idea:",
    idea,
    "",
    "---",
    "Sent from pratyushrjena.com"
  ];
  const body = encodeURIComponent(bodyLines.join("\n"));
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// bottom form
document.getElementById("collabForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const idea = document.getElementById("idea").value.trim();
  if (!name || !email || !idea) return;
  openMail({ name, email, idea });
});

// modal form
document.getElementById("modalForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("modalName").value.trim();
  const email = document.getElementById("modalEmail").value.trim();
  const idea = document.getElementById("modalIdea").value.trim();
  if (!name || !email || !idea) return;
  hideModal();
  openMail({ name, email, idea });
});
