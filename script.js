// Mobile nav toggle
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("nav-links--open");
  });

  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("nav-links--open");
    }
  });
})();

// Scroll progress
(function () {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? scrollTop / height : 0;
    bar.style.width = `${ratio * 100}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Scroll reveal
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

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

  items.forEach((el) => observer.observe(el));
})();

// Stats counter
(function () {
  const stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;

  const animateStat = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    let current = 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      current = Math.floor(target * progress);
      el.textContent = current.toString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toString();
      }
    };

    requestAnimationFrame(step);
  };

  // Trigger when hero is visible
  const hero = document.getElementById("hero");
  if (!hero) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stats.forEach(animateStat);
          io.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(hero);
})();

// Lens toggle
(function () {
  const buttons = document.querySelectorAll(".lens-btn");
  const textEl = document.getElementById("lens-text");
  if (!buttons.length || !textEl) return;

  const texts = {
    nature:
      "Under the nature lens, a drone is just another animal learning how to survive in a noisy world.",
    systems:
      "Under the computer lens, a drone is a control loop wrapped around sensors, failure modes, and constraints."
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const lens = btn.dataset.lens || "nature";
      textEl.textContent = texts[lens] || texts.nature;
    });
  });
})();

// Systems grid + log simulation
(function () {
  const grid = document.getElementById("signal-grid");
  const log = document.getElementById("log-stream");
  if (!grid || !log) return;

  const ROWS = 6;
  const COLS = 8;
  const cells = [];

  // Build grid
  for (let i = 0; i < ROWS * COLS; i++) {
    const cell = document.createElement("div");
    cell.className = "signal-cell";
    grid.appendChild(cell);
    cells.push(cell);
  }

  const logLines = [
    "Crazyflie::optical_flow spike, adjusting hover.",
    "Hexacopter::LiDAR range drop, switching posture.",
    "LLM::unsafe pattern detected, sanitizing prompt.",
    "Vision::cap color mismatch, re-evaluating frame.",
    "Telemetry::packet delay, widening tolerance window.",
    "Planner::search radius expanded, spiral step +1.",
    "Safety::fallback engaged, holding position.",
    "Sensor::baseline recalibration in progress."
  ];

  const appendLog = () => {
    const line = document.createElement("div");
    line.className = "log-line";
    const now = new Date();
    const t =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0");
    const msg = logLines[Math.floor(Math.random() * logLines.length)];
    line.innerHTML = `<span>[${t}]</span> ${msg}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
    // Limit log length
    if (log.children.length > 40) {
      log.removeChild(log.firstChild);
    }
  };

  const tick = () => {
    // Reset some cells
    cells.forEach((c) => {
      if (Math.random() < 0.25) c.classList.remove("active");
    });
    // Activate a few random cells
    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * cells.length);
      cells[idx].classList.add("active");
    }

    if (Math.random() < 0.7) appendLog();
  };

  const start = () => setInterval(tick, 900);
  start();
})();

// Parallax dots follow mouse slightly
(function () {
  const dots = document.querySelectorAll(".parallax-dot");
  if (!dots.length) return;

  document.addEventListener("pointermove", (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const xNorm = (e.clientX / w - 0.5) * 2;
    const yNorm = (e.clientY / h - 0.5) * 2;

    dots.forEach((dot, idx) => {
      const intensity = (idx + 1) * 4;
      dot.style.transform = `translate3d(${xNorm * intensity}px, ${
        yNorm * intensity
      }px, 0)`;
    });
  });
})();

// Footer year
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
