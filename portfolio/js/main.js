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
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => navLinks.classList.remove("open"))
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

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
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
  document.getElementById("hero-eyebrow").textContent = HERO.eyebrow;
  document.getElementById("hero-name").textContent = HERO.name;
  document.getElementById("hero-lead").textContent = HERO.lead;
  document.getElementById("hero-stats").innerHTML = HERO.stats
    .map((stat) => `<li><strong>${stat.value}</strong><span>${stat.label}</span></li>`)
    .join("");
  document.getElementById("footer-name").textContent = HERO.name;

  document.getElementById("about-text").innerHTML = ABOUT.paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("");

  document.getElementById("contact-intro").textContent = CONTACT.intro;
  document.getElementById("contact-links").innerHTML = CONTACT.links
    .map((link) => {
      const isMail = link.href.startsWith("mailto:");
      return `<li>${link.icon} <a href="${link.href}"${
        isMail ? "" : ' target="_blank" rel="noopener"'
      }>${link.label}</a></li>`;
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
        <div class="skill-bar"><div class="skill-fill" style="width:${skill.level}%"></div></div>
      </li>`
  ).join("");
  document.querySelectorAll("#skills-list .reveal").forEach((el) => revealObserver.observe(el));

  const projectsGrid = document.getElementById("projects-grid");
  function renderProjects(filter) {
    const items = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
    projectsGrid.innerHTML = items
      .map(
        (project) => `
        <article class="project-card reveal">
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
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

  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in every field before sending.";
      formStatus.className = "form-status error";
      return;
    }
    if (!emailPattern.test(email)) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.className = "form-status error";
      return;
    }

    const mailLink = CONTACT.links.find((link) => link.href.startsWith("mailto:"));
    const contactEmail = mailLink ? mailLink.href.replace("mailto:", "").split("?")[0] : "";
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    formStatus.textContent = "Opening your email client to send the message…";
    formStatus.className = "form-status success";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const backToTop = document.getElementById("back-to-top");
  const scrollProgress = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
