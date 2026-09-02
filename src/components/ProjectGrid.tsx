"use client";

import { useTranslations } from "next-intl";
import { ScrambleText } from "@/components/ScrambleText";
import { featuredProjects } from "@/data/links";

export function ProjectGrid() {
  const t = useTranslations("Projects");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-3">
        {featuredProjects.map((project) => (
          <article
            key={project.id}
            className="group flex flex-col border border-secondary/18 bg-card/90 p-4 transition duration-300 hover:border-secondary/45 hover:bg-card sm:p-4 md:p-3.5"
          >
            <div className="mb-3 h-0.5 w-8 bg-primary transition-all duration-300 group-hover:w-14 md:mb-2" />
            <ScrambleText
              text={t(`items.${project.id}.title`)}
              as="h3"
              className="font-display text-lg tracking-[-0.01em] text-foreground md:text-[1.05rem]"
              duration={460}
            />
            <ScrambleText
              text={t(`items.${project.id}.description`)}
              as="p"
              className="mt-2 flex-1 text-sm leading-relaxed text-foreground/72 md:mt-1.5 md:text-[0.8rem]"
              duration={500}
            />
            <ScrambleText
              text={t(`items.${project.id}.stack`)}
              as="p"
              className="mt-4 text-[0.65rem] tracking-[0.12em] text-secondary uppercase"
              duration={420}
            />
            <div className="mt-5 flex flex-wrap gap-3">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold tracking-wide text-background transition hover:bg-primary"
                >
                  <ScrambleText text={t("live")} duration={320} />
                </a>
              ) : null}
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-secondary/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-secondary transition hover:border-secondary hover:bg-secondary hover:text-background"
                >
                  <ScrambleText text={t("repo")} duration={320} />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-foreground/65 sm:mt-8">
        <a
          href="https://github.com/alexmenz28?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-secondary transition hover:text-primary"
        >
          <ScrambleText text={t("allRepos")} duration={440} />
        </a>
      </p>
    </>
  );
}
