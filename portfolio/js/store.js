(function (global) {
  const STORAGE_KEY = "portfolioAdminData";

  const originalDefaults = JSON.parse(
    JSON.stringify({
      HERO: global.HERO,
      ABOUT: global.ABOUT,
      CONTACT: global.CONTACT,
      SKILLS: global.SKILLS,
      PROJECTS: global.PROJECTS,
      RESUME: global.RESUME,
    })
  );

  function applyOverrides() {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return;
    }
    if (!raw) return;

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return;
    }

    if (data.HERO) Object.assign(global.HERO, data.HERO);
    if (data.ABOUT) Object.assign(global.ABOUT, data.ABOUT);
    if (data.CONTACT) Object.assign(global.CONTACT, data.CONTACT);
    if (Array.isArray(data.SKILLS)) global.SKILLS.splice(0, global.SKILLS.length, ...data.SKILLS);
    if (Array.isArray(data.PROJECTS)) global.PROJECTS.splice(0, global.PROJECTS.length, ...data.PROJECTS);
    if (data.RESUME) {
      if (Array.isArray(data.RESUME.education)) global.RESUME.education = data.RESUME.education;
      if (Array.isArray(data.RESUME.experience)) global.RESUME.experience = data.RESUME.experience;
    }
  }

  function saveOverrides(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clearOverrides() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function hasOverrides() {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return false;
    }
  }

  applyOverrides();

  global.PortfolioStore = {
    STORAGE_KEY,
    saveOverrides,
    clearOverrides,
    hasOverrides,
    getOriginalDefaults: () => JSON.parse(JSON.stringify(originalDefaults)),
  };
})(window);
