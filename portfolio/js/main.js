(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
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
            <p>${entry.details}</p>
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

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:menghong@aeu.edu.kh?subject=${subject}&body=${body}`;

    formStatus.textContent = "Opening your email client to send the message…";
    formStatus.className = "form-status success";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
