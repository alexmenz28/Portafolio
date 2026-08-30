export type ProjectLinks = {
  id: "memories" | "joyeria" | "fastfood";
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
    id: "fastfood",
    repo: "https://github.com/alexmenz28/fast-food",
  },
];

export const social = {
  email: "mailto:alexander.mendoza.cholima2248@gmail.com",
  github: "https://github.com/alexmenz28",
  site: "https://personal-memories.com",
} as const;
