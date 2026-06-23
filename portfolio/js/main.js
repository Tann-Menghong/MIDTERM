(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  function syncThemeIcon() {
    const isDark = root.getAttribute("data-theme") === "dark";
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
  syncThemeIcon();

  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncThemeIcon();
  });

  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navBackdrop = document.getElementById("nav-backdrop");
  function setNavOpen(open) {
    navLinks.classList.toggle("open", open);
    navBackdrop.classList.toggle("visible", open);
  }
  navToggle.addEventListener("click", () => setNavOpen(!navLinks.classList.contains("open")));
  navBackdrop.addEventListener("click", () => setNavOpen(false));
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => setNavOpen(false))
  );

  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll("#nav-links a");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  function animateCount(el) {
    const target = +el.dataset.countTarget;
    if (Number.isNaN(target)) return;
    const suffix = el.dataset.countSuffix || "";
    const valueEl = el.querySelector("strong");
    if (!valueEl) return;
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      valueEl.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.dataset.countTarget) animateCount(entry.target);
          const fill = entry.target.querySelector("[data-fill-target]");
          if (fill) requestAnimationFrame(() => { fill.style.width = `${fill.dataset.fillTarget}%`; });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const heroAvatar = document.getElementById("hero-avatar");
  heroAvatar.innerHTML = HERO.avatarPhoto
    ? `<img src="${HERO.avatarPhoto}" alt="${HERO.name}" />`
    : HERO.avatarInitials;
  const availabilityBadge = document.getElementById("availability-badge");
  if (HERO.availability && HERO.availability.label) {
    availabilityBadge.classList.toggle("open", !!HERO.availability.open);
    availabilityBadge.innerHTML = `<span class="availability-dot"></span>${HERO.availability.label}`;
  } else {
    availabilityBadge.remove();
  }
  document.getElementById("hero-eyebrow").textContent = HERO.eyebrow;
  document.getElementById("hero-name").textContent = HERO.name;
  document.getElementById("hero-lead").textContent = HERO.lead;
  document.getElementById("hero-stats").innerHTML = HERO.stats
    .map((stat) => {
      const match = /^(\d+)(.*)$/.exec(stat.value);
      const countAttrs = match ? ` data-count-target="${match[1]}" data-count-suffix="${match[2]}"` : "";
      const display = match ? `0${match[2]}` : stat.value;
      return `<li class="reveal"${countAttrs}><strong>${display}</strong><span>${stat.label}</span></li>`;
    })
    .join("");
  document.querySelectorAll("#hero-stats li").forEach((el) => revealObserver.observe(el));
  document.getElementById("footer-name").textContent = HERO.name;

  document.getElementById("about-text").innerHTML = ABOUT.paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("");

  document.getElementById("contact-intro").textContent = CONTACT.intro;
  document.getElementById("contact-links").innerHTML = CONTACT.links
    .map((link) => {
      const isMail = link.href.startsWith("mailto:");
      const copyBtn = isMail
        ? `<button type="button" class="copy-btn" data-copy-value="${link.href.replace("mailto:", "").split("?")[0]}" aria-label="Copy email address">⧉</button>`
        : "";
      return `<li>${link.icon} <a href="${link.href}"${
        isMail ? "" : ' target="_blank" rel="noopener"'
      }>${link.label}</a>${copyBtn}</li>`;
    })
    .join("");
  document.getElementById("contact-links").addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const value = btn.dataset.copyValue;
    const done = () => {
      showToast("Email address copied to clipboard.", "success");
      btn.classList.add("copied");
      setTimeout(() => btn.classList.remove("copied"), 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(done);
    } else {
      done();
    }
  });
  document.getElementById("footer-social").innerHTML = CONTACT.links
    .map((link) => {
      const isMail = link.href.startsWith("mailto:");
      return `<li><a href="${link.href}" aria-label="${link.label}"${
        isMail ? "" : ' target="_blank" rel="noopener"'
      }>${link.icon}</a></li>`;
    })
    .join("");

  const skillsList = document.getElementById("skills-list");
  skillsList.innerHTML = SKILLS.map(
    (skill) => `
      <li class="skill reveal">
        <div class="skill-head">
          <span>${skill.name}</span>
          <span>${skill.level}%</span>
        </div>
        <div class="skill-bar"><div class="skill-fill" data-fill-target="${skill.level}" style="width:0%"></div></div>
      </li>`
  ).join("");
  document.querySelectorAll("#skills-list .reveal").forEach((el) => revealObserver.observe(el));

  const projectsGrid = document.getElementById("projects-grid");
  function renderProjects(filter) {
    const items = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
    projectsGrid.innerHTML = items
      .map(
        (project, i) => `
        <article class="project-card reveal" style="--stagger:${(i % 6) * 70}ms">
          <img src="${project.image}" alt="${project.title}" loading="lazy" data-lightbox-trigger />
          <button type="button" class="project-zoom" aria-label="View ${project.title} larger">⤢</button>
          <div class="project-body">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <ul class="tech-tags">
              ${project.tech.map((t) => `<li>${t}</li>`).join("")}
            </ul>
          </div>
        </article>`
      )
      .join("");
    document.querySelectorAll("#projects-grid .reveal").forEach((el) => revealObserver.observe(el));
  }
  renderProjects("all");

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjects(btn.dataset.filter);
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
  projectsGrid.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-lightbox-trigger], .project-zoom");
    if (!trigger) return;
    const img = trigger.closest(".project-card").querySelector("img");
    openLightbox(img.src, img.alt);
  });
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.classList.contains("hidden")) closeLightbox();
  });

  const timeline = document.getElementById("resume-timeline");
  function timelineGroup(label, entries) {
    return `
      <h3 class="timeline-label">${label}</h3>
      ${entries
        .map(
          (entry) => `
        <div class="timeline-item reveal">
          <div class="timeline-period">${entry.period}</div>
          <div class="timeline-content">
            <h4>${entry.title}</h4>
            <span class="timeline-org">${entry.org}</span>
            ${
              Array.isArray(entry.details)
                ? `<ul class="timeline-details">${entry.details
                    .map((point) => `<li>${point}</li>`)
                    .join("")}</ul>`
                : `<p>${entry.details}</p>`
            }
          </div>
        </div>`
        )
        .join("")}`;
  }
  timeline.innerHTML =
    timelineGroup("Education", RESUME.education) + timelineGroup("Experience", RESUME.experience);
  document.querySelectorAll("#resume-timeline .reveal").forEach((el) => revealObserver.observe(el));

  document.getElementById("print-resume").addEventListener("click", () => window.print());

  const toastContainer = document.getElementById("toast-container");
  function showToast(message, kind) {
    const toast = document.createElement("div");
    toast.className = `toast${kind ? " " + kind : ""}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  function setFormStatus(text, kind) {
    formStatus.textContent = text;
    formStatus.className = `form-status ${kind}`;
    showToast(text, kind);
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      setFormStatus("Please fill in every field before sending.", "error");
      return;
    }
    if (!emailPattern.test(email)) {
      setFormStatus("Please enter a valid email address.", "error");
      return;
    }

    const mailLink = CONTACT.links.find((link) => link.href.startsWith("mailto:"));
    const contactEmail = mailLink ? mailLink.href.replace("mailto:", "").split("?")[0] : "";
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    setFormStatus("Opening your email client to send the message…", "success");
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const backToTop = document.getElementById("back-to-top");
  const scrollProgress = document.getElementById("scroll-progress");
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
    navbar.classList.toggle("scrolled", window.scrollY > 10);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
    backToTop.style.setProperty("--btt-progress", pct);
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
