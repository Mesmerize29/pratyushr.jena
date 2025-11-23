// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// IntersectionObserver for fade-in sections
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18
  }
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

/* HERO GAME: SYSTEM STABILITY SIMULATION */

(function setupHeroGame() {
  const canvas = document.getElementById("hero-game");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const statusEl = document.getElementById("hero-game-status");
  const scoreEl = document.getElementById("hero-game-score");

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  let nodes = [];
  let mouse = { x: null, y: null, active: false };
  let stabilizedCount = 0;
  let initialized = false;

  const labels = [
    "AI",
    "Robotics",
    "Security",
    "Perception",
    "Control",
    "Dialogue",
    "Trust",
    "Risk"
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createNodes();
  }

  function createNodes() {
    nodes = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.28;
    const count = labels.length;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      nodes.push({
        x,
        y,
        baseRadius: 9,
        radius: 9,
        unstable: false,
        pulsePhase: Math.random() * Math.PI * 2,
        label: labels[i],
        coolDown: 0
      });
    }
  }

  function randomUnstableNode() {
    if (!initialized) return;
    const candidates = nodes.filter((n) => !n.unstable && n.coolDown <= 0);
    if (candidates.length === 0) return;
    const node = candidates[Math.floor(Math.random() * candidates.length)];
    node.unstable = true;
  }

  function drawBackground() {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      width * 0.2,
      height * 0.1,
      0,
      width * 0.5,
      height * 0.9,
      Math.max(width, height) * 0.9
    );
    gradient.addColorStop(0, "rgba(15, 23, 42, 1)");
    gradient.addColorStop(1, "rgba(15, 23, 42, 0.9)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(15, 118, 178, 0.65)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 8]);
    ctx.beginPath();
    nodes.forEach((node, index) => {
      const next = nodes[(index + 1) % nodes.length];
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(next.x, next.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawNodes(time) {
    nodes.forEach((node) => {
      const t = time / 1000;
      const pulse = Math.sin(t * 3 + node.pulsePhase) * 1.4;

      if (node.unstable) {
        node.radius = node.baseRadius + 2.4 + pulse;
      } else {
        node.radius = node.baseRadius + 0.6 + pulse * 0.4;
      }

      if (node.coolDown > 0) {
        node.coolDown -= 0.016;
      }

      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        node.radius * 2.2
      );

      if (node.unstable) {
        gradient.addColorStop(0, "rgba(248, 113, 113, 0.9)");
        gradient.addColorStop(1, "rgba(127, 29, 29, 0.0)");
      } else {
        gradient.addColorStop(0, "rgba(56, 189, 248, 0.9)");
        gradient.addColorStop(1, "rgba(8, 47, 73, 0.0)");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 1.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.unstable ? "rgba(248, 113, 113, 1)" : "rgba(56, 189, 248, 1)";
      ctx.fill();

      ctx.font = "10px 'Space Grotesk', system-ui, sans-serif";
      ctx.fillStyle = "rgba(226, 232, 240, 0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.label, node.x, node.y + node.radius + 4);
    });
  }

  function handleMouseInteraction() {
    if (!mouse.active) return;
    nodes.forEach((node) => {
      if (!node.unstable) return;
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius * 1.7) {
        node.unstable = false;
        node.coolDown = 1.2;
        stabilizedCount += 1;
        if (scoreEl) {
          scoreEl.textContent = "Stabilized nodes: " + stabilizedCount;
        }
        if (statusEl) {
          statusEl.textContent = "Stable";
        }
      }
    });
  }

  function animate(time) {
    drawBackground();
    drawNodes(time);
    handleMouseInteraction();
    requestAnimationFrame(animate);
  }

  function updateMousePosition(evt) {
    const rect = canvas.getBoundingClientRect();
    if (evt.touches && evt.touches.length > 0) {
      const touch = evt.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      mouse.active = true;
    } else {
      mouse.x = evt.clientX - rect.left;
      mouse.y = evt.clientY - rect.top;
      mouse.active = true;
    }
    if (!initialized) {
      initialized = true;
      if (statusEl) {
        statusEl.textContent = "Live";
      }
    }
  }

  function clearMouse() {
    mouse.active = false;
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(animate);
  setInterval(randomUnstableNode, 1400);

  canvas.addEventListener("mousemove", updateMousePosition);
  canvas.addEventListener("mouseleave", clearMouse);
  canvas.addEventListener("touchstart", updateMousePosition, { passive: true });
  canvas.addEventListener("touchmove", updateMousePosition, { passive: true });
  canvas.addEventListener("touchend", clearMouse);
})();

/* SYSTEM MODAL CONTENT */

(function setupSystemModal() {
  const modalBackdrop = document.getElementById("system-modal-backdrop");
  const modalClose = document.getElementById("system-modal-close");
  const titleEl = document.getElementById("system-modal-title");
  const whatEl = document.getElementById("system-modal-what");
  const whyEl = document.getElementById("system-modal-why");
  const howEl = document.getElementById("system-modal-how");

  if (!modalBackdrop || !modalClose || !titleEl || !whatEl || !whyEl || !howEl) return;

  const content = {
    crazyflie: {
      title: "Crazyflie Flow and Multi-Ranger Pipelines",
      what: "A micro-drone stack using flow sensors and multi-ranger modules to perform hover, search, avoidance, and line-following behaviors.",
      why: "Micro-scale autonomous systems reveal how perception and control behave under strict resource limits. They are ideal testbeds for safety logic in constrained environments.",
      how: "Configured and tested flow and multi-ranger decks, designed navigation routines, debugged unstable flight behavior, and extracted stable patterns from noisy sensor data."
    },
    hexacopter: {
      title: "Hexacopter Architecture",
      what: "A Navio2 and Raspberry Pi based hexacopter platform that runs semi-autonomous missions with lidar supported stability and telemetry.",
      why: "It connects hardware, control loops, sensing, and mission planning into one coherent system, similar to what real deployment grade platforms must handle.",
      how: "Worked from frame and wiring up to configuration and tuning, integrated lidar data, and used Mission Planner to validate real-world flight behavior."
    },
    ugv: {
      title: "LiDAR-based UGV Mode",
      what: "Ground mode logic that uses lidar readings and control rules to keep a platform aware of its surroundings while moving at lower altitude or on the ground.",
      why: "Helps bridge aerial autonomy and ground-based navigation, which is key when platforms move between flight, landing, and rolling states.",
      how: "Explored and implemented lidar based proximity checks, avoidance rules, and mode switching logic that can transfer to ground environments."
    },
    "optical-flow": {
      title: "Optical Flow Reasoning",
      what: "Perception logic that interprets optical flow patterns and turns them into meaningful movement, drift, and trajectory cues.",
      why: "Optical flow is a powerful, lightweight signal for navigation when full 3D mapping is not available or too expensive.",
      how: "Tested and tuned optical flow based stability and navigation, studied how the system responded under different surfaces and lighting, and used that insight to refine control strategies."
    },
    "dialogue-safety": {
      title: "Dialogue-level AI Safety Pipeline",
      what: "A conceptual and practical pipeline that watches how conversations evolve, detects adversarial intent, and applies layered responses.",
      why: "Most attacks on LLMs do not happen in a single prompt. They unfold over a dialogue, which means safety must be conversation aware, not only input aware.",
      how: "Mapped attack patterns, defined phases in conversation risk, and aligned controls at each stage to reduce the chance of unsafe outputs while keeping the system useful."
    },
    "defense-metrics": {
      title: "Cybersecurity Defense Models",
      what: "A set of metrics such as PISR, ILVI, DCR, and UTCE that describe how well defenses perform under attack and how resilient the system feels to real users.",
      why: "Without clear metrics, safety becomes a vague promise. With defined metrics, teams can track real improvements, compare configurations, and align on risk.",
      how: "Proposed and refined metric definitions, linked them to attack families, and framed them so they are useful for both research discussion and practical decision making."
    }
  };

  function openModal(key) {
    const data = content[key];
    if (!data) return;
    titleEl.textContent = data.title;
    whatEl.textContent = data.what;
    whyEl.textContent = data.why;
    howEl.textContent = data.how;
    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modalBackdrop.classList.remove("open");
    modalBackdrop.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll(".system-card").forEach((card) => {
    const key = card.getAttribute("data-system");
    const btn = card.querySelector(".system-btn");
    if (!btn || !key) return;
    btn.addEventListener("click", () => openModal(key));
  });

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (evt) => {
    if (evt.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape") {
      closeModal();
    }
  });
})();
