(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const enableHeavyFx = !prefersReducedMotion && canHover && window.innerWidth >= 760;
  if (prefersReducedMotion || !canHover) return;

  const root = document.documentElement;

  /* ---------- Custom cursor (dot + lagging ring) ---------- */
  root.classList.add("fx-cursor");
  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  const cursorRing = document.createElement("div");
  cursorRing.className = "cursor-ring";
  document.body.append(cursorDot, cursorRing);

  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let targetX = ringX;
  let targetY = ringY;

  window.addEventListener("pointermove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "0.5";
    cursorDot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    const interactive = e.target.closest("a, button, .project-card, .filter-btn, input, textarea, .skills-block");
    cursorRing.classList.toggle("is-active", !!interactive);
  });
  document.addEventListener("pointerleave", () => {
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });

  function tickRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tickRing);
  }
  requestAnimationFrame(tickRing);

  if (!enableHeavyFx) return;

  /* ---------- Pointer-tilt + glare ----------
     Delegated on a stable container so it survives innerHTML re-renders
     (project filter clicks rebuild .project-card markup from scratch). */
  function tiltStart(el) {
    el.classList.add("tilt-interactive", "tilt-hovering");
    el.style.transition = "transform 0.12s ease-out";
    // animation-play-state: paused still lets the keyframe's last transform
    // win the cascade over our inline transform, so disable it outright.
    el.style.animation = "none";
  }
  function tiltFrame(el, e, rect, max) {
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px) scale(1.015)`;
    el.style.setProperty("--mx", px.toFixed(3));
    el.style.setProperty("--my", py.toFixed(3));
  }
  function tiltEnd(el) {
    el.classList.remove("tilt-hovering");
    el.style.transform = "";
    el.style.animation = "";
    setTimeout(() => { el.style.transition = ""; }, 150);
  }
  function delegateTilt(container, selector, max) {
    if (!container) return;
    let activeEl = null;
    let rect = null;
    container.addEventListener("pointermove", (e) => {
      const el = e.target.closest(selector);
      if (el !== activeEl) {
        if (activeEl) tiltEnd(activeEl);
        activeEl = el;
        if (activeEl) {
          rect = activeEl.getBoundingClientRect();
          tiltStart(activeEl);
        }
      }
      if (activeEl) tiltFrame(activeEl, e, rect, max);
    });
    container.addEventListener("pointerleave", () => {
      if (activeEl) { tiltEnd(activeEl); activeEl = null; }
    });
  }

  delegateTilt(document.getElementById("projects-grid"), ".project-card", 8);
  delegateTilt(document.getElementById("hero-stats"), "li", 12);
  delegateTilt(document.querySelector(".skills-block"), ".skills-block", 5);
  delegateTilt(document.getElementById("hero-avatar"), "#hero-avatar", 16);

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll(".btn-primary, .btn-secondary, .filter-btn").forEach((btn) => {
    btn.classList.add("magnetic");
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${(mx / rect.width) * 10}px, ${(my / rect.height) * 10}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });

  /* ---------- Hero particle field ----------
     Mouse-reactive constellation: drifting dots, faint links between
     neighbors, and a brighter link reaching toward the cursor. */
  const hero = document.getElementById("home");
  const heroInner = hero && hero.querySelector(".hero-inner");
  if (!hero || !heroInner) return;

  const canvas = document.createElement("canvas");
  canvas.className = "hero-particles";
  canvas.setAttribute("aria-hidden", "true");
  hero.insertBefore(canvas, heroInner);
  const ctx = canvas.getContext("2d");

  let accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#4f46e5";
  document.getElementById("theme-toggle").addEventListener("click", () => {
    accent = getComputedStyle(root).getPropertyValue("--accent").trim() || accent;
  });

  let particles = [];
  let width = 0;
  let height = 0;
  let mouseX = -9999;
  let mouseY = -9999;
  let running = true;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.round((width * height) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      if (distToMouse < 140) {
        ctx.globalAlpha = 0.35 * (1 - distToMouse / 140);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ddx = p.x - q.x;
        const ddy = p.y - q.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < 110) {
          ctx.globalAlpha = 0.12 * (1 - dist / 110);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }

  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  hero.addEventListener("pointerleave", () => {
    mouseX = -9999;
    mouseY = -9999;
  });
  document.addEventListener("visibilitychange", () => {
    const wasRunning = running;
    running = !document.hidden;
    if (running && !wasRunning) requestAnimationFrame(step);
  });
  window.addEventListener("resize", resize);

  resize();
  requestAnimationFrame(step);
})();
