const SKILLS = [
  { name: "Java", level: 90 },
  { name: "Android SDK", level: 85 },
  { name: "SQLite", level: 75 },
  { name: "XML Layouts", level: 80 },
  { name: "HTML / CSS / JS", level: 85 },
  { name: "Git & GitHub", level: 80 },
  { name: "Gradle", level: 65 },
  { name: "OOP & MVC", level: 80 },
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
      title: "Android Development Practices",
      org: "MSIT Coursework",
      period: "2024 — Present",
      details:
        "Built a set of Android exercises covering SQLite persistence, custom adapters, list views and event handling.",
    },
  ],
};
