export type ProjectLinks = {
  id: "memories" | "joyeria" | "minimarket" | "notas";
  live?: string;
  repo?: string;
};

/** Featured projects — recruiter-facing proof (live and/or public repo). */
export const featuredProjects: ProjectLinks[] = [
  {
    id: "memories",
    live: "https://personal-memories.com",
  },
  {
    id: "joyeria",
    repo: "https://github.com/alexmenz28/Joyeria-MARR",
  },
  {
    id: "minimarket",
    repo: "https://github.com/alexmenz28/MinimarketJade",
  },
  {
    id: "notas",
    live: "https://notas-docusaurus.vercel.app",
    repo: "https://github.com/alexmenz28/Notas-Docusaurus",
  },
];

export const social = {
  email: "mailto:alexander.mendoza.cholima2248@gmail.com",
  github: "https://github.com/alexmenz28",
  site: "https://personal-memories.com",
} as const;
