// =============================
// Background "neural field"
// =============================

const canvas = document.getElementById("starfield");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];
let width = 0;
let height = 0;

let mouse = {
  x: null,
  y: null,
  radius: 90
};

let activationScore = 0;
let hudEl = null;

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
      alpha: Math.random() * 0.5 + 0.3,
      activated: false,
      activationFade: 0
    });
  }
}

function drawParticles() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, width, height);

  // subtle connection lines
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "#43ff8a";
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;

  particles.forEach((p) => {
    // move
    p.x += p.vx;
    p.y += p.vy;

    // wrap
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // interaction (window coordinates)
    if (mouse.x !== null && mouse.y !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 0.02;
        p.vy += Math.sin(angle) * force * 0.02;

        if (!p.activated) {
          p.activated = true;
          activationScore++;
          updateHud();
          p.activationFade = 1;
        }
      } else {
        p.activated = false;
      }
    } else {
      p.activated = false;
    }

    // glow fade
    if (p.activationFade > 0) {
      p.activationFade -= 0.02;
      if (p.activationFade < 0) p.activationFade = 0;
    }

    const baseAlpha = p.alpha;
    const glowBoost = p.activationFade * 0.7;
    ctx.globalAlpha = Math.min(baseAlpha + glowBoost, 1);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size + p.activationFade * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = "#43ff8a";
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

// HUD for activation score
function createHud() {
  if (hudEl) return;
  hudEl = document.createElement("div");
  hudEl.id = "neural-hud";
  hudEl.style.position = "fixed";
  hudEl.style.top = "1.2rem";
  hudEl.style.right = "1.4rem";
  hudEl.style.zIndex = "20";
  hudEl.style.padding = "0.6rem 0.9rem";
  hudEl.style.borderRadius = "999px";
  hudEl.style.border = "1px solid rgba(67, 255, 138, 0.35)";
  hudEl.style.background = "rgba(5, 8, 15, 0.82)";
  hudEl.style.backdropFilter = "blur(8px)";
  hudEl.style.fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
  hudEl.style.fontSize = "0.78rem";
  hudEl.style.letterSpacing = "0.04em";
  hudEl.style.textTransform = "uppercase";
  hudEl.style.display = "flex";
  hudEl.style.alignItems = "center";
  hudEl.style.gap = "0.6rem";
  hudEl.style.color = "#d5ffe7";
  hudEl.style.pointerEvents = "none";

  const dot = document.createElement("span");
  dot.style.display = "inline-block";
  dot.style.width = "8px";
  dot.style.height = "8px";
  dot.style.borderRadius = "999px";
  dot.style.boxShadow = "0 0 8px #43ff8a";
  dot.style.background = "#43ff8a";

  const text = document.createElement("span");
  text.id = "neural-hud-text";

  hudEl.appendChild(dot);
  hudEl.appendChild(text);
  document.body.appendChild(hudEl);

  updateHud();
}

function updateHud() {
  const text = document.getElementById("neural-hud-text");
  if (!text) return;
  text.textContent = `Activation Score: ${activationScore}`;
}

// mouse/touch listeners on window
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  mouse.x = touch.clientX;
  mouse.y = touch.clientY;
});

window.addEventListener("touchend", () => {
  mouse.x = null;
  mouse.y = null;
});

// init background
resizeCanvas();
createParticles();
createHud();
drawParticles();
window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

// =============================
// Scroll reveal
// =============================
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });
} else {
  document
    .querySelectorAll(".reveal-on-scroll")
    .forEach((el) => el.classList.add("is-visible"));
}

// =============================
// Footer year + scrollToContact
// =============================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

function scrollToContact() {
  const section = document.getElementById("contact");
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth" });
}
window.scrollToContact = scrollToContact;

// =============================
// Text-to-QR generator
// =============================
(function setupQR() {
  const input = document.getElementById("qr-text");
  const btn = document.getElementById("qr-generate-btn");
  const container = document.getElementById("qr-code");

  if (!input || !btn || !container) return;

  // If the library didn't load, show a friendly message.
  if (typeof QRCode === "undefined") {
    container.innerHTML =
      '<p style="font-size:0.8rem;color:#f8b4b4;">QR engine not loaded. Check the QRCode script tag.</p>';
    return;
  }

  // Create a QRCode instance attached to the container
  let qr = new QRCode(container, {
    text: "",
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  function generate(value) {
    const text = (value || input.value || window.location.href).trim();
    if (!text) return;

    qr.clear();
    qr.makeCode(text);
  }

  // Initial QR for your site
  generate("https://pratyushrjena.co");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    generate();
  });

  // Realtime-ish: update as they type, once there is some text
  input.addEventListener("input", () => {
    if (input.value.trim().length > 0) {
      generate();
    }
  });

  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      generate();
    }
  });
})();
