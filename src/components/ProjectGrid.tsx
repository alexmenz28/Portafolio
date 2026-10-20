"use client";

import { useTranslations } from "next-intl";
import { CodeIcon, ExternalLinkIcon, GitHubIcon } from "@/components/Icons";
import { ScrambleText } from "@/components/ScrambleText";
import { featuredProjects } from "@/data/links";

function stackTags(stack: string) {
  return stack
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function ProjectGrid() {
  const t = useTranslations("Projects");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-3">
        {featuredProjects.map((project) => {
          const tags = stackTags(t(`items.${project.id}.stack`));
          return (
            <article
              key={project.id}
              id={`project-${project.id}`}
              className="group flex scroll-mt-6 flex-col border border-secondary/18 bg-card/90 p-4 transition duration-300 hover:border-secondary/45 hover:bg-card sm:p-4 md:p-3.5"
            >
              <div className="mb-3 h-0.5 w-8 bg-primary transition-all duration-300 group-hover:w-14 md:mb-2" />
              <div className="flex flex-wrap items-baseline gap-2">
                <ScrambleText
                  text={t(`items.${project.id}.title`)}
                  as="h3"
                  className="font-display text-lg tracking-[-0.01em] text-foreground md:text-[1.05rem]"
                  duration={460}
                />
                {project.live ? (
                  <span className="rounded-md border border-primary/35 px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-primary uppercase">
                    {t("liveBadge")}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/72 md:mt-1.5 md:text-[0.8rem]">
                {t(`items.${project.id}.description`)}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-secondary/40 px-2 py-0.5 text-[0.65rem] tracking-wide text-secondary"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold tracking-wide text-background transition hover:bg-primary"
                  >
                    <ExternalLinkIcon />
                    <ScrambleText text={t("live")} duration={320} />
                  </a>
                ) : null}
                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-secondary/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-secondary transition hover:border-secondary hover:bg-secondary hover:text-background"
                  >
                    <GitHubIcon size={14} />
                    <ScrambleText text={t("repo")} duration={320} />
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-foreground/65 sm:mt-8">
        <a
          href="https://github.com/alexmenz28?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-secondary transition hover:text-primary"
        >
          <CodeIcon />
          <ScrambleText text={t("allRepos")} duration={440} />
        </a>
      </p>
    </>
  );
}
