export const PAGE_SECTIONS = [
  { id: "hero", navKey: "hero" },
  { id: "projects", navKey: "projects" },
  { id: "experience", navKey: "experience" },
  { id: "skills", navKey: "skills" },
  { id: "education", navKey: "education" },
  { id: "about", navKey: "about" },
  { id: "contact", navKey: "contact" },
] as const;

export type PageSectionId = (typeof PAGE_SECTIONS)[number]["id"];
