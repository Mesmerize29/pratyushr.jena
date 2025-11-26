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
    const height =
      document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? scrollTop / height : 0;
    bar.style.width = `${ratio * 100}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Scroll reveal
(function () {
  const items = document.querySelectorAll(".section, .cta-bar");
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

  items.forEach((el) => el.classList.add("reveal"));
  items.forEach((el) => observer.observe(el));
})();

// Stats counters
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

// Hero particle sim
(function () {
  const canvas = document.getElementById("hero-sim");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let particles = [];
  const count = 45;
  const mouse = { x: null, y: null, active: false };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener("resize", resize);
  resize();

  const createParticles = () => {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 2 + Math.random() * 2
      });
    }
  };
  createParticles();

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "rgba(15,23,42,0.95)");
    grad.addColorStop(1, "rgba(4,7,23,0.9)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 80 * 80) {
          const alpha = 1 - dist2 / (80 * 80);
          ctx.strokeStyle = `rgba(74, 222, 128, ${alpha * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      if (mouse.active && mouse.x != null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 120 * 120) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.vx *= 0.995;
      p.vy *= 0.995;

      const radialGrad = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.r * 3
      );
      radialGrad.addColorStop(0, "rgba(74, 222, 128, 0.9)");
      radialGrad.addColorStop(1, "rgba(34, 197, 94, 0)");
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.1, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };
  draw();

  const updateMouse = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  };

  canvas.addEventListener("pointermove", updateMouse);
  canvas.addEventListener("pointerleave", () => {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
  });
})();

// Collaboration CTA forms
(function () {
  function setupCollabForm(formId, statusId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "Sending...";
      status.classList.remove("cta-status--ok", "cta-status--err");

      const formData = new FormData(form);
      const payload = {
        email: formData.get("email"),
        idea: formData.get("idea"),
        source: formId
      };

      try {
        // Replace with your backend endpoint
        const res = await fetch("/api/collab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("Request failed");
        }

        status.textContent = "Got it. I will read this.";
        status.classList.add("cta-status--ok");
        form.reset();
      } catch (err) {
        console.error(err);
        status.textContent = "Something went wrong. Try again in a bit.";
        status.classList.add("cta-status--err");
      }
    });
  }

  setupCollabForm("collab-form-top", "cta-status-top");
  setupCollabForm("collab-form-bottom", "cta-status-bottom");
})();

// Footer year
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
