(function () {
  // Not real security — just a deterrent against casual visitors, since this
  // page (and this phrase) is fully readable in the browser's page source.
  const ACCESS_PHRASE = "menghong-admin";
  const UNLOCK_KEY = "portfolioAdminUnlocked";

  const gate = document.getElementById("gate");
  const app = document.getElementById("admin-app");
  const gateForm = document.getElementById("gate-form");
  const gateError = document.getElementById("gate-error");
  const saveStatus = document.getElementById("save-status");
  const unsavedIndicator = document.getElementById("unsaved-indicator");
  const adminPanels = document.querySelector(".admin-panels");

  let model;
  let initialized = false;
  let dirty = false;

  function markDirty() {
    dirty = true;
    unsavedIndicator.classList.remove("hidden");
  }

  function clearDirty() {
    dirty = false;
    unsavedIndicator.classList.add("hidden");
  }

  // Every data-mutating control (text fields, file inputs, add/remove row
  // buttons) lives inside .admin-panels, while tab switches and the
  // save/reset/download/lock buttons live outside it — so this single
  // delegated listener catches edits without false-positiving on navigation.
  adminPanels.addEventListener("input", markDirty);
  adminPanels.addEventListener("change", markDirty);
  adminPanels.addEventListener("click", (e) => {
    if (e.target.closest("button")) markDirty();
  });

  window.addEventListener("beforeunload", (event) => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function readImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = maxDim / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function unlock() {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
    try {
      sessionStorage.setItem(UNLOCK_KEY, "1");
    } catch (err) {
      /* ignore */
    }
    if (!initialized) {
      initialized = true;
      init();
    }
  }

  if ((() => {
    try {
      return sessionStorage.getItem(UNLOCK_KEY) === "1";
    } catch (err) {
      return false;
    }
  })()) {
    unlock();
  }

  gateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = document.getElementById("gate-password").value;
    if (value === ACCESS_PHRASE) {
      gateError.textContent = "";
      unlock();
    } else {
      gateError.textContent = "Incorrect phrase.";
    }
  });

  document.getElementById("lock-btn").addEventListener("click", () => {
    try {
      sessionStorage.removeItem(UNLOCK_KEY);
    } catch (err) {
      /* ignore */
    }
    app.classList.add("hidden");
    gate.classList.remove("hidden");
  });

  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
    });
  });

  function init() {
    model = clone({ HERO, ABOUT, CONTACT, SKILLS, PROJECTS, RESUME });
    renderAll();
  }

  function renderAll() {
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderResume();
    renderContact();
  }

  function setSaveStatus(text, kind) {
    saveStatus.textContent = text;
    saveStatus.className = kind || "";
    if (text) setTimeout(() => { saveStatus.textContent = ""; saveStatus.className = ""; }, 4000);
  }

  // ---------- Hero ----------
  function renderHero() {
    const panel = document.getElementById("panel-hero");
    panel.innerHTML = `
      <h2>Hero</h2>
      <div class="admin-field">
        <label>Eyebrow text</label>
        <input type="text" id="f-hero-eyebrow" value="${escapeHtml(model.HERO.eyebrow)}" />
      </div>
      <div class="admin-field">
        <label>Full name</label>
        <input type="text" id="f-hero-name" value="${escapeHtml(model.HERO.name)}" />
      </div>
      <div class="admin-field">
        <label>Lead paragraph</label>
        <textarea id="f-hero-lead" rows="4">${escapeHtml(model.HERO.lead)}</textarea>
      </div>
      <div class="admin-field">
        <label>Avatar</label>
        <div class="admin-avatar-row">
          <div class="admin-avatar-preview">${
            model.HERO.avatarPhoto
              ? `<img src="${model.HERO.avatarPhoto}" alt="" />`
              : `<span>${escapeHtml(model.HERO.avatarInitials)}</span>`
          }</div>
          <div>
            <input type="text" id="f-hero-initials" placeholder="Initials (shown if no photo)" value="${escapeHtml(model.HERO.avatarInitials)}" />
            <input type="file" id="f-hero-photo" accept="image/*" />
            ${model.HERO.avatarPhoto ? `<button type="button" class="btn btn-secondary" id="remove-avatar-photo">Remove photo</button>` : ""}
          </div>
        </div>
      </div>
      <div class="admin-field">
        <label>Stat cards</label>
        <div id="hero-stats-list" class="admin-repeat"></div>
        <button type="button" class="btn btn-secondary" id="add-stat">+ Add stat</button>
      </div>
      <div class="admin-field">
        <label><input type="checkbox" id="f-hero-availability-open" ${model.HERO.availability.open ? "checked" : ""} /> Show availability badge</label>
        <input type="text" id="f-hero-availability-label" placeholder="Badge text" value="${escapeHtml(model.HERO.availability.label)}" />
      </div>
    `;

    document.getElementById("f-hero-eyebrow").addEventListener("input", (e) => { model.HERO.eyebrow = e.target.value; });
    document.getElementById("f-hero-name").addEventListener("input", (e) => { model.HERO.name = e.target.value; });
    document.getElementById("f-hero-lead").addEventListener("input", (e) => { model.HERO.lead = e.target.value; });
    document.getElementById("f-hero-initials").addEventListener("input", (e) => { model.HERO.avatarInitials = e.target.value; });
    document.getElementById("f-hero-availability-open").addEventListener("change", (e) => { model.HERO.availability.open = e.target.checked; });
    document.getElementById("f-hero-availability-label").addEventListener("input", (e) => { model.HERO.availability.label = e.target.value; });
    document.getElementById("f-hero-photo").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      model.HERO.avatarPhoto = await readImage(file, 600, 0.88);
      renderHero();
    });
    const removeBtn = document.getElementById("remove-avatar-photo");
    if (removeBtn) removeBtn.addEventListener("click", () => { model.HERO.avatarPhoto = ""; renderHero(); });

    renderStatsList();
    document.getElementById("add-stat").addEventListener("click", () => {
      model.HERO.stats.push({ value: "New", label: "Stat label" });
      renderStatsList();
    });
  }

  function renderStatsList() {
    const wrap = document.getElementById("hero-stats-list");
    wrap.innerHTML = model.HERO.stats
      .map(
        (stat, i) => `
        <div class="admin-repeat-row">
          <input type="text" data-stat-value="${i}" placeholder="Value" value="${escapeHtml(stat.value)}" />
          <input type="text" data-stat-label="${i}" placeholder="Label" value="${escapeHtml(stat.label)}" />
          <button type="button" class="icon-btn" data-stat-remove="${i}" aria-label="Remove">✕</button>
        </div>`
      )
      .join("");
    wrap.querySelectorAll("[data-stat-value]").forEach((el) =>
      el.addEventListener("input", (e) => { model.HERO.stats[+e.target.dataset.statValue].value = e.target.value; })
    );
    wrap.querySelectorAll("[data-stat-label]").forEach((el) =>
      el.addEventListener("input", (e) => { model.HERO.stats[+e.target.dataset.statLabel].label = e.target.value; })
    );
    wrap.querySelectorAll("[data-stat-remove]").forEach((el) =>
      el.addEventListener("click", (e) => {
        model.HERO.stats.splice(+e.target.dataset.statRemove, 1);
        renderStatsList();
      })
    );
  }

  // ---------- About ----------
  function renderAbout() {
    const panel = document.getElementById("panel-about");
    panel.innerHTML = `
      <h2>About</h2>
      <div id="about-rows"></div>
      <button type="button" class="btn btn-secondary" id="add-paragraph">+ Add paragraph</button>
    `;
    renderAboutRows();
    document.getElementById("add-paragraph").addEventListener("click", () => {
      model.ABOUT.paragraphs.push("");
      renderAboutRows();
    });
  }

  function renderAboutRows() {
    const wrap = document.getElementById("about-rows");
    wrap.innerHTML = model.ABOUT.paragraphs
      .map(
        (p, i) => `
        <div class="admin-field">
          <label>Paragraph ${i + 1}</label>
          <div class="admin-repeat-row">
            <textarea rows="3" data-about-p="${i}">${escapeHtml(p)}</textarea>
            <button type="button" class="icon-btn" data-about-remove="${i}" aria-label="Remove">✕</button>
          </div>
        </div>`
      )
      .join("");
    wrap.querySelectorAll("[data-about-p]").forEach((el) =>
      el.addEventListener("input", (e) => { model.ABOUT.paragraphs[+e.target.dataset.aboutP] = e.target.value; })
    );
    wrap.querySelectorAll("[data-about-remove]").forEach((el) =>
      el.addEventListener("click", (e) => {
        model.ABOUT.paragraphs.splice(+e.target.dataset.aboutRemove, 1);
        renderAboutRows();
      })
    );
  }

  // ---------- Skills ----------
  function renderSkills() {
    const panel = document.getElementById("panel-skills");
    panel.innerHTML = `
      <h2>Skills</h2>
      <div id="skills-rows" class="admin-repeat"></div>
      <button type="button" class="btn btn-secondary" id="add-skill">+ Add skill</button>
    `;
    renderSkillsRows();
    document.getElementById("add-skill").addEventListener("click", () => {
      model.SKILLS.push({ name: "New skill", level: 50 });
      renderSkillsRows();
    });
  }

  function renderSkillsRows() {
    const wrap = document.getElementById("skills-rows");
    wrap.innerHTML = model.SKILLS.map(
      (skill, i) => `
      <div class="admin-repeat-row admin-skill-row">
        <input type="text" data-skill-name="${i}" value="${escapeHtml(skill.name)}" placeholder="Skill name" />
        <input type="number" min="0" max="100" data-skill-level="${i}" value="${skill.level}" />
        <button type="button" class="icon-btn" data-skill-remove="${i}" aria-label="Remove">✕</button>
      </div>`
    ).join("");
    wrap.querySelectorAll("[data-skill-name]").forEach((el) =>
      el.addEventListener("input", (e) => { model.SKILLS[+e.target.dataset.skillName].name = e.target.value; })
    );
    wrap.querySelectorAll("[data-skill-level]").forEach((el) =>
      el.addEventListener("input", (e) => {
        model.SKILLS[+e.target.dataset.skillLevel].level = Math.max(0, Math.min(100, +e.target.value || 0));
      })
    );
    wrap.querySelectorAll("[data-skill-remove]").forEach((el) =>
      el.addEventListener("click", (e) => {
        model.SKILLS.splice(+e.target.dataset.skillRemove, 1);
        renderSkillsRows();
      })
    );
  }

  // ---------- Projects ----------
  function renderProjects() {
    const panel = document.getElementById("panel-projects");
    panel.innerHTML = `
      <h2>Projects</h2>
      <div id="project-cards"></div>
      <button type="button" class="btn btn-secondary" id="add-project">+ Add project</button>
    `;
    renderProjectCards();
    document.getElementById("add-project").addEventListener("click", () => {
      model.PROJECTS.push({ title: "New project", category: "web", description: "", tech: [], image: "" });
      renderProjectCards();
    });
  }

  function renderProjectCards() {
    const wrap = document.getElementById("project-cards");
    wrap.innerHTML = model.PROJECTS.map(
      (p, i) => `
      <div class="admin-card">
        <div class="admin-card-head">
          <strong>Project ${i + 1}</strong>
          <button type="button" class="icon-btn" data-proj-remove="${i}" aria-label="Remove">✕</button>
        </div>
        <div class="admin-field">
          <label>Title</label>
          <input type="text" data-proj-title="${i}" value="${escapeHtml(p.title)}" />
        </div>
        <div class="admin-field">
          <label>Category (the filter buttons on the site look for: all / android / web)</label>
          <input type="text" data-proj-category="${i}" value="${escapeHtml(p.category)}" />
        </div>
        <div class="admin-field">
          <label>Description</label>
          <textarea rows="3" data-proj-desc="${i}">${escapeHtml(p.description)}</textarea>
        </div>
        <div class="admin-field">
          <label>Tech tags (comma-separated)</label>
          <input type="text" data-proj-tech="${i}" value="${escapeHtml(p.tech.join(", "))}" />
        </div>
        <div class="admin-field">
          <label>Image</label>
          <div class="admin-avatar-row">
            <div class="admin-thumb-preview">${p.image ? `<img src="${p.image}" alt="" />` : `<span>No image</span>`}</div>
            <div>
              <input type="file" accept="image/*" data-proj-image="${i}" />
              ${p.image ? `<button type="button" class="btn btn-secondary" data-proj-image-remove="${i}">Remove image</button>` : ""}
            </div>
          </div>
        </div>
      </div>`
    ).join("");

    wrap.querySelectorAll("[data-proj-title]").forEach((el) =>
      el.addEventListener("input", (e) => { model.PROJECTS[+e.target.dataset.projTitle].title = e.target.value; })
    );
    wrap.querySelectorAll("[data-proj-category]").forEach((el) =>
      el.addEventListener("input", (e) => {
        model.PROJECTS[+e.target.dataset.projCategory].category = e.target.value.trim().toLowerCase();
      })
    );
    wrap.querySelectorAll("[data-proj-desc]").forEach((el) =>
      el.addEventListener("input", (e) => { model.PROJECTS[+e.target.dataset.projDesc].description = e.target.value; })
    );
    wrap.querySelectorAll("[data-proj-tech]").forEach((el) =>
      el.addEventListener("input", (e) => {
        model.PROJECTS[+e.target.dataset.projTech].tech = e.target.value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      })
    );
    wrap.querySelectorAll("[data-proj-image]").forEach((el) =>
      el.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const i = +e.target.dataset.projImage;
        model.PROJECTS[i].image = await readImage(file, 1000, 0.85);
        renderProjectCards();
      })
    );
    wrap.querySelectorAll("[data-proj-image-remove]").forEach((el) =>
      el.addEventListener("click", (e) => {
        model.PROJECTS[+e.target.dataset.projImageRemove].image = "";
        renderProjectCards();
      })
    );
    wrap.querySelectorAll("[data-proj-remove]").forEach((el) =>
      el.addEventListener("click", (e) => {
        model.PROJECTS.splice(+e.target.dataset.projRemove, 1);
        renderProjectCards();
      })
    );
  }

  // ---------- Resume ----------
  function renderResume() {
    const panel = document.getElementById("panel-resume");
    panel.innerHTML = `
      <h2>Resume</h2>
      <h3>Education</h3>
      <div id="education-cards"></div>
      <button type="button" class="btn btn-secondary" id="add-education">+ Add education</button>
      <h3 style="margin-top:32px;">Experience</h3>
      <div id="experience-cards"></div>
      <button type="button" class="btn btn-secondary" id="add-experience">+ Add experience</button>
    `;
    renderEducationCards();
    renderExperienceCards();
    document.getElementById("add-education").addEventListener("click", () => {
      model.RESUME.education.push({ title: "New degree", org: "Institution", period: "Year — Year", details: "" });
      renderEducationCards();
    });
    document.getElementById("add-experience").addEventListener("click", () => {
      model.RESUME.experience.push({ title: "New role", org: "Organization", period: "Year — Year", details: [""] });
      renderExperienceCards();
    });
  }

  function renderEducationCards() {
    const wrap = document.getElementById("education-cards");
    wrap.innerHTML = model.RESUME.education.map(
      (e, i) => `
      <div class="admin-card">
        <div class="admin-card-head"><strong>Education ${i + 1}</strong><button type="button" class="icon-btn" data-edu-remove="${i}" aria-label="Remove">✕</button></div>
        <div class="admin-field"><label>Title</label><input type="text" data-edu-title="${i}" value="${escapeHtml(e.title)}" /></div>
        <div class="admin-field"><label>Organization</label><input type="text" data-edu-org="${i}" value="${escapeHtml(e.org)}" /></div>
        <div class="admin-field"><label>Period</label><input type="text" data-edu-period="${i}" value="${escapeHtml(e.period)}" /></div>
        <div class="admin-field"><label>Details</label><textarea rows="2" data-edu-details="${i}">${escapeHtml(e.details)}</textarea></div>
      </div>`
    ).join("");
    wrap.querySelectorAll("[data-edu-title]").forEach((el) => el.addEventListener("input", (ev) => { model.RESUME.education[+ev.target.dataset.eduTitle].title = ev.target.value; }));
    wrap.querySelectorAll("[data-edu-org]").forEach((el) => el.addEventListener("input", (ev) => { model.RESUME.education[+ev.target.dataset.eduOrg].org = ev.target.value; }));
    wrap.querySelectorAll("[data-edu-period]").forEach((el) => el.addEventListener("input", (ev) => { model.RESUME.education[+ev.target.dataset.eduPeriod].period = ev.target.value; }));
    wrap.querySelectorAll("[data-edu-details]").forEach((el) => el.addEventListener("input", (ev) => { model.RESUME.education[+ev.target.dataset.eduDetails].details = ev.target.value; }));
    wrap.querySelectorAll("[data-edu-remove]").forEach((el) => el.addEventListener("click", (ev) => {
      model.RESUME.education.splice(+ev.target.dataset.eduRemove, 1);
      renderEducationCards();
    }));
  }

  function renderExperienceCards() {
    const wrap = document.getElementById("experience-cards");
    wrap.innerHTML = model.RESUME.experience.map(
      (exp, i) => `
      <div class="admin-card">
        <div class="admin-card-head"><strong>Experience ${i + 1}</strong><button type="button" class="icon-btn" data-exp-remove="${i}" aria-label="Remove">✕</button></div>
        <div class="admin-field"><label>Title</label><input type="text" data-exp-title="${i}" value="${escapeHtml(exp.title)}" /></div>
        <div class="admin-field"><label>Organization</label><input type="text" data-exp-org="${i}" value="${escapeHtml(exp.org)}" /></div>
        <div class="admin-field"><label>Period</label><input type="text" data-exp-period="${i}" value="${escapeHtml(exp.period)}" /></div>
        <div class="admin-field"><label>Highlights (one per line)</label><textarea rows="6" data-exp-details="${i}">${escapeHtml(
          (Array.isArray(exp.details) ? exp.details : [exp.details]).join("\n")
        )}</textarea></div>
      </div>`
    ).join("");
    wrap.querySelectorAll("[data-exp-title]").forEach((el) => el.addEventListener("input", (ev) => { model.RESUME.experience[+ev.target.dataset.expTitle].title = ev.target.value; }));
    wrap.querySelectorAll("[data-exp-org]").forEach((el) => el.addEventListener("input", (ev) => { model.RESUME.experience[+ev.target.dataset.expOrg].org = ev.target.value; }));
    wrap.querySelectorAll("[data-exp-period]").forEach((el) => el.addEventListener("input", (ev) => { model.RESUME.experience[+ev.target.dataset.expPeriod].period = ev.target.value; }));
    wrap.querySelectorAll("[data-exp-details]").forEach((el) => el.addEventListener("input", (ev) => {
      model.RESUME.experience[+ev.target.dataset.expDetails].details = ev.target.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }));
    wrap.querySelectorAll("[data-exp-remove]").forEach((el) => el.addEventListener("click", (ev) => {
      model.RESUME.experience.splice(+ev.target.dataset.expRemove, 1);
      renderExperienceCards();
    }));
  }

  // ---------- Contact ----------
  function renderContact() {
    const panel = document.getElementById("panel-contact");
    panel.innerHTML = `
      <h2>Contact</h2>
      <div class="admin-field">
        <label>Intro text</label>
        <textarea rows="3" id="f-contact-intro">${escapeHtml(model.CONTACT.intro)}</textarea>
      </div>
      <div id="contact-rows"></div>
      <button type="button" class="btn btn-secondary" id="add-contact-link">+ Add link</button>
    `;
    document.getElementById("f-contact-intro").addEventListener("input", (e) => { model.CONTACT.intro = e.target.value; });
    renderContactRows();
    document.getElementById("add-contact-link").addEventListener("click", () => {
      model.CONTACT.links.push({ icon: "🔗", label: "Label", href: "https://" });
      renderContactRows();
    });
  }

  function renderContactRows() {
    const wrap = document.getElementById("contact-rows");
    wrap.innerHTML = model.CONTACT.links.map(
      (l, i) => `
      <div class="admin-card">
        <div class="admin-card-head"><strong>Link ${i + 1}</strong><button type="button" class="icon-btn" data-link-remove="${i}" aria-label="Remove">✕</button></div>
        <div class="admin-field"><label>Icon (emoji)</label><input type="text" data-link-icon="${i}" value="${escapeHtml(l.icon)}" /></div>
        <div class="admin-field"><label>Label</label><input type="text" data-link-label="${i}" value="${escapeHtml(l.label)}" /></div>
        <div class="admin-field"><label>URL (mailto: or https://)</label><input type="text" data-link-href="${i}" value="${escapeHtml(l.href)}" /></div>
      </div>`
    ).join("");
    wrap.querySelectorAll("[data-link-icon]").forEach((el) => el.addEventListener("input", (e) => { model.CONTACT.links[+e.target.dataset.linkIcon].icon = e.target.value; }));
    wrap.querySelectorAll("[data-link-label]").forEach((el) => el.addEventListener("input", (e) => { model.CONTACT.links[+e.target.dataset.linkLabel].label = e.target.value; }));
    wrap.querySelectorAll("[data-link-href]").forEach((el) => el.addEventListener("input", (e) => { model.CONTACT.links[+e.target.dataset.linkHref].href = e.target.value; }));
    wrap.querySelectorAll("[data-link-remove]").forEach((el) => el.addEventListener("click", (e) => {
      model.CONTACT.links.splice(+e.target.dataset.linkRemove, 1);
      renderContactRows();
    }));
  }

  // ---------- Save / Reset / Download ----------
  document.getElementById("save-btn").addEventListener("click", () => {
    try {
      PortfolioStore.saveOverrides(model);
      setSaveStatus("Saved — open or refresh the preview tab to see it.", "success");
      clearDirty();
    } catch (err) {
      setSaveStatus("Couldn't save — your browser storage is full. Try smaller or fewer images.", "error");
    }
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (!confirm("Reset every field back to the site's built-in defaults? This discards your local edits.")) return;
    PortfolioStore.clearOverrides();
    model = PortfolioStore.getOriginalDefaults();
    renderAll();
    setSaveStatus("Reset to defaults.", "success");
    clearDirty();
  });

  document.getElementById("download-btn").addEventListener("click", () => {
    const source = buildDataJsSource(model);
    const blob = new Blob([source], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  function buildDataJsSource(m) {
    const block = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)};\n`;
    return [
      block("HERO", m.HERO),
      block("ABOUT", m.ABOUT),
      block("SKILLS", m.SKILLS),
      block("PROJECTS", m.PROJECTS),
      block("RESUME", m.RESUME),
      block("CONTACT", m.CONTACT),
    ].join("\n");
  }
})();
