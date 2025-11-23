// ========== SCROLL EFFECTS: PROGRESS, PARALLAX, UNDERSTANDING BAR, AI HUD ==========
(function () {
  const layers = document.querySelectorAll(".parallax-layer");
  const scrollProgressBar = document.getElementById("scroll-progress");
  const aiHudText = document.getElementById("ai-hud-text");
  const understandingBar = document.getElementById("understanding-bar");
  const understandingText = document.getElementById("understanding-text");

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    // Scroll progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress * 100}%`;
    }

    // Parallax layers
    if (layers && layers.length) {
      layers.forEach((layer, index) => {
        const depth = (index + 1) * 12;
        layer.style.transform = `translate3d(0, ${-scrollY / depth}px, 0)`;
      });
    }

    // Understanding bar
    const percent = Math.round(progress * 100);
    if (understandingBar) {
      understandingBar.style.width = `${percent}%`;
    }
    if (understandingText) {
      if (percent < 10) {
        understandingText.textContent = "You are at 0 percent. Keep scrolling.";
      } else if (percent < 40) {
        understandingText.textContent = "You see the surface. Systems are loading in.";
      } else if (percent < 70) {
        understandingText.textContent = "You have seen how I build and how I think.";
      } else if (percent < 95) {
        understandingText.textContent = "You now understand my direction and momentum.";
      } else {
        understandingText.textContent = "You have the full picture. If something clicked, reach out.";
      }
    }

    // AI HUD text
    if (aiHudText) {
      if (progress < 0.2) {
        aiHudText.textContent = "Calibrating to your curiosity...";
      } else if (progress < 0.4) {
        aiHudText.textContent = "Tracking how you move through the system.";
      } else if (progress < 0.6) {
        aiHudText.textContent = "Noting what you focus on and where you pause.";
      } else if (progress < 0.8) {
        aiHudText.textContent = "You are mapping my thinking in real time.";
      } else {
        aiHudText.textContent = "You have enough signal to decide. Build with me if it fits.";
      }
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
})();

// ========== AI ORB FOLLOWING CURSOR (SOFT LAG) ==========
(function () {
  const orb = document.getElementById("ai-orb");
  if (!orb) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX + 40;
    targetY = e.clientY - 40;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    orb.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }

  animate();
})();

// ========== PATH SELECTOR (TECH / RECRUITER / COLLAB) ==========
(function () {
  const pathButtons = document.querySelectorAll(".path-btn");
  const output = document.getElementById("path-output");

  if (!pathButtons.length || !output) return;

  const messages = {
    tech:
      "You care about architectures and tradeoffs. Scroll into the systems and research sections. Focus on how I design pipelines, handle constraints and make things robust under failure.",
    recruiter:
      "You want signal, not slogans. My work combines hands on builds, research mindset and the ability to communicate clearly. The systems, research and timeline sections will show you pattern, not noise.",
    collab:
      "You are hunting for a builder who can pick up ambiguity, design a plan and execute. Look at the systems, live data surface and impact sections. If you see alignment, reach out and we can scope something real."
  };

  pathButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      pathButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const path = btn.getAttribute("data-path");
      output.textContent = messages[path] || "Path not found.";
    });
  });
})();

// ========== LIVE METRICS (FRAMES, RISKS, NODES, UPTIME) ==========
(function () {
  const framesEl = document.querySelector('[data-metric="frames"]');
  const risksEl = document.querySelector('[data-metric="risks"]');
  const nodesEl = document.querySelector('[data-metric="nodes"]');
  const uptimeEl = document.querySelector('[data-metric="uptime"]');

  if (!framesEl || !risksEl || !nodesEl || !uptimeEl) return;

  let frames = 1200;
  let risks = 3;
  let nodes = 42;
  let uptimeSeconds = 0;

  function updateMetrics() {
    frames += Math.floor(Math.random() * 40) + 20;
    if (Math.random() < 0.3) risks += 1;
    if (Math.random() < 0.2) nodes += 1;
    uptimeSeconds += 1;

    framesEl.textContent = frames.toLocaleString();
    risksEl.textContent = risks;
    nodesEl.textContent = nodes;

    const minutes = Math.floor(uptimeSeconds / 60);
    const seconds = uptimeSeconds % 60;
    uptimeEl.textContent = `${minutes}m ${seconds}s`;
  }

  setInterval(updateMetrics, 900);
})();

// ========== LIVE DATA SURFACE (LOG + SIGNAL GRID) ==========
(function () {
  const logStream = document.getElementById("log-stream");
  const signalGrid = document.getElementById("signal-grid");

  if (!logStream || !signalGrid) return;

  // create cells
  const cellCount = 8 * 8;
  const cells = [];
  for (let i = 0; i < cellCount; i++) {
    const div = document.createElement("div");
    div.className = "signal-cell";
    signalGrid.appendChild(div);
    cells.push(div);
  }

  const logMessages = [
    "Optical flow pattern stable. Delta within threshold.",
    "LiDAR sweep complete. Obstacle field updated.",
    "Dialogue risk score computed. No escalation triggered.",
    "ESC sync confirmed. Motor outputs aligned.",
    "Telemetry heartbeat received. Link stable.",
    "Safety layer engaged. Monitoring anomalous prompts.",
    "Sensor fusion pass: no conflicting state detected.",
    "Search spiral mode active. Perimeter expanding.",
    "PID adjustment applied. Vibration reduced.",
    "Context window refreshed. Guardrails in place."
  ];

  function pushLog() {
    const p = document.createElement("p");
    const ts = new Date().toLocaleTimeString();
    const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
    p.textContent = `[${ts}] ${msg}`;
    logStream.appendChild(p);

    while (logStream.children.length > 40) {
      logStream.removeChild(logStream.firstChild);
    }
    logStream.scrollTop = logStream.scrollHeight;
  }

  function pulseSignals() {
    cells.forEach((cell) => {
      const intensity = Math.random();
      const base = 0.08;
      const alpha = base + intensity * 0.5;
      cell.style.background = `rgba(65, 224, 255, ${alpha})`;
    });
  }

  setInterval(pushLog, 1600);
  setInterval(pulseSignals, 550);
})();

// ========== QUOTE REVEAL (SLOW-BURN TEXT) ==========
(function () {
  const lines = document.querySelectorAll(".quote-line");
  if (!lines.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.3 }
    );

    lines.forEach((line, index) => {
      line.style.transitionDelay = `${index * 0.25}s`;
      observer.observe(line);
    });
  } else {
    // Fallback: just show them
    lines.forEach((line) => line.classList.add("revealed"));
  }
})();

// ========== SYSTEM CARD CLICK PLACEHOLDER ==========
(function () {
  const cards = document.querySelectorAll(".system-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent || "System view";
      alert(
        `${title}\n\nThis is a placeholder. Later you can replace this with a modal containing diagrams, architecture and your contribution breakdown.`
      );
    });
  });
})();
