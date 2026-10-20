export type GraphChild = {
  targetId: string;
  labelKey: string;
};

export type GraphSection = {
  id: "hero" | "projects" | "experience" | "skills" | "education" | "about" | "contact";
  navKey: string;
  children: readonly GraphChild[];
};

export const PAGE_SECTIONS: readonly GraphSection[] = [
  { id: "hero", navKey: "hero", children: [] },
  {
    id: "projects",
    navKey: "projects",
    children: [
      { targetId: "project-memories", labelKey: "memories" },
      { targetId: "project-kolki", labelKey: "kolki" },
      { targetId: "project-fastfood", labelKey: "fastfood" },
    ],
  },
  {
    id: "experience",
    navKey: "experience",
    children: [{ targetId: "experience-utepsa", labelKey: "utepsa" }],
  },
  {
    id: "skills",
    navKey: "skills",
    children: [
      { targetId: "skill-web", labelKey: "web" },
      { targetId: "skill-languages", labelKey: "languages" },
      { targetId: "skill-tools", labelKey: "tools" },
      { targetId: "skill-dotnet", labelKey: "dotnet" },
    ],
  },
  {
    id: "education",
    navKey: "education",
    children: [
      { targetId: "education-school", labelKey: "school" },
      { targetId: "education-icpc", labelKey: "icpc" },
    ],
  },
  {
    id: "about",
    navKey: "about",
    children: [{ targetId: "about", labelKey: "availability" }],
  },
  {
    id: "contact",
    navKey: "contact",
    children: [
      { targetId: "contact-links", labelKey: "links" },
      { targetId: "contact-kolki", labelKey: "kolki" },
    ],
  },
] as const;

export type PageSectionId = (typeof PAGE_SECTIONS)[number]["id"];
