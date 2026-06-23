const SKILLS = [
  { name: "Graphic Design (Photoshop & Illustrator)", level: 90 },
  { name: "Video Editing & Production", level: 88 },
  { name: "Print & Publication Layout", level: 85 },
  { name: "Event Photography", level: 82 },
  { name: "Branding & Visual Identity", level: 80 },
  { name: "Livestreaming & Event Broadcasting", level: 78 },
  { name: "HTML / CSS / JS", level: 75 },
  { name: "Git & GitHub", level: 70 },
];

const PROJECTS = [
  {
    title: "Child Health Card Manager",
    category: "android",
    description:
      "CRUD application for tracking children's health records, backed by a custom SQLite DatabaseHelper/DatabaseManager layer with add, edit and delete flows.",
    tech: ["Java", "Android SDK", "SQLite"],
    image: "assets/img/baby_document.png",
  },
  {
    title: "Currency Exchange Rate Converter",
    category: "android",
    description:
      "Converts between Cambodian Riel, USD and GBP using a custom spinner adapter and live rate calculation.",
    tech: ["Java", "Android SDK", "Spinner"],
    image: "assets/img/exchange_rate.png",
  },
  {
    title: "Dynamic ListView App",
    category: "android",
    description:
      "Custom ArrayAdapter-driven list view exercise demonstrating efficient view recycling and item binding.",
    tech: ["Java", "Android SDK", "ListView"],
    image: "assets/img/listview.png",
  },
  {
    title: "Event Handler Playground",
    category: "android",
    description:
      "Sandbox activity exploring Android event listeners — clicks, gestures and UI state changes.",
    tech: ["Java", "Android SDK"],
    image: "assets/img/activities.png",
  },
  {
    title: "Personal Portfolio Website",
    category: "web",
    description:
      "This site — a dynamic, dependency-free HTML/CSS/JS portfolio with theme switching, live project filtering and scroll-aware navigation.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "assets/img/activities.png",
  },
];

const RESUME = {
  education: [
    {
      title: "Master of Science in Information Technology (MSIT)",
      org: "American University (AEU)",
      period: "2024 — Present",
      details:
        "Coursework in Android development, software engineering and database systems.",
    },
  ],
  experience: [
    {
      title: "Graphic Designer & Multimedia Officer",
      org: "Asia Euro University (AEU) — Printing & Digital Communications Office",
      period: "Jun 2022 — Present",
      details: [
        "Designed posters, banners and digital graphics for university events, holidays and academic announcements.",
        "Produced booklets, leaflets and brochures for student recruitment and admissions campaigns.",
        "Edited video content and operated livestreaming setups for ceremonies, seminars and conferences.",
        "Covered campus events as event photographer, delivering edited photo sets for university publications.",
        "Designed branding and print collateral, including certificates, ID cards, signage and merchandise.",
        "Produced monthly newsletters and social media graphics for the university's digital communications.",
      ],
    },
  ],
};
