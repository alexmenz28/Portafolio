import { featuredProjects, social } from "@/data/links";

/** Canonical profile facts for metadata, JSON-LD, and llms.txt — keep in sync with CV. */
export const profile = {
  name: "Alexander Mendoza Cholima",
  givenName: "Alexander",
  familyName: "Mendoza Cholima",
  jobTitle: "Full-Stack TypeScript Developer",
  description:
    "Full-stack TypeScript engineer who ships production web products—Next.js, React, Node, and PostgreSQL—with secondary .NET depth from university systems. Live products: Personal Memories and Kolki. Open to remote roles.",
  url: "https://github.com/alexmenz28",
  email: "alexander.mendoza.cholima2248@gmail.com",
  github: social.github,
  location: {
    city: "Santa Cruz",
    country: "Bolivia",
    countryCode: "BO",
  },
  languages: [
    { name: "Spanish", proficiency: "native" },
    { name: "English", proficiency: "intermediate" },
  ],
  education: {
    institution: "UTEPSA",
    degree: "Systems Engineering",
    status: "Graduate",
    startYear: 2021,
    endYear: 2026,
  },
  experience: [
    {
      company: "UTEPSA",
      role: "Programmer",
      start: "2025-01",
      end: "2025-12",
      stack: ["C#", ".NET", "Blazor Server", "SQL Server", "DevExpress XAF"],
    },
  ],
  skills: {
    primary: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Fastify",
      "PostgreSQL",
      "Prisma",
    ],
    secondary: [
      "ASP.NET Core",
      "Blazor",
      "EF Core",
      "SQL Server",
      "DevExpress XAF",
    ],
    tools: ["Git", "Docker", "Sentry", "Playwright", "Linux", "Cloudflare"],
  },
  projects: featuredProjects.map((project) => {
    if (project.id === "memories") {
      return {
        name: "Personal Memories",
        url: project.live,
        description:
          "Live product for important dates and context—auth, Postgres, and email workflows on Vercel.",
        stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Better Auth"],
      };
    }
    if (project.id === "kolki") {
      return {
        name: "Kolki",
        url: project.live,
        description:
          "Local-first expense PWA with optional cloud sync, multi-currency, and Playwright E2E.",
        stack: ["React", "Vite", "Dexie", "Supabase", "TypeScript"],
      };
    }
    return {
      name: "FAST FOOD S.A.",
      url: project.repo,
      description:
        "Supply and inventory monorepo for a distributor—shared domain packages across API and SPA.",
      stack: ["Fastify", "React", "Prisma", "PostgreSQL", "TypeScript"],
    };
  }),
  sameAs: [social.github, social.linkedin, social.site, social.kolki],
  seeking: "Remote full-stack TypeScript roles (US/EU/LATAM)",
} as const;
