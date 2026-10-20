"use client";

import { useTranslations } from "next-intl";
import { GitHubIcon, GlobeIcon, MailIcon } from "@/components/Icons";
import { ScrambleText } from "@/components/ScrambleText";
import { usePageNavigation } from "@/contexts/PageNavigationContext";
import { social } from "@/data/links";

export function HeroContent() {
  const t = useTranslations("Hero");
  const { goTo } = usePageNavigation();

  return (
    <div className="flex flex-col">
      <ScrambleText
        text={t("location")}
        className="text-sm text-secondary/90"
        as="p"
        scrambleOnMount
      />
      <ScrambleText
        text={t("tagline")}
        className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-foreground/78 sm:mt-5 sm:text-base md:text-lg"
        as="p"
        duration={600}
        scrambleOnMount
      />
      <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
        <button
          type="button"
          onClick={() => goTo("projects")}
          className="inline-flex items-center justify-center rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold tracking-wide text-background transition duration-300 hover:bg-primary"
        >
          <ScrambleText text={t("ctaProjects")} />
        </button>
        <button
          type="button"
          onClick={() => goTo("contact")}
          className="inline-flex items-center justify-center rounded-md border border-secondary/70 px-5 py-2.5 text-sm font-semibold tracking-wide text-secondary transition duration-300 hover:border-secondary hover:bg-secondary hover:text-background"
        >
          <ScrambleText text={t("ctaContact")} />
        </button>
      </div>
      <div className="mt-7 flex gap-5 text-secondary/85 sm:mt-8">
        <a
          href={social.email}
          className="transition hover:text-primary"
          aria-label="Email"
        >
          <MailIcon size={22} />
        </a>
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-primary"
          aria-label="GitHub"
        >
          <GitHubIcon size={22} />
        </a>
        <a
          href={social.site}
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-primary"
          aria-label="Personal Memories"
        >
          <GlobeIcon size={22} />
        </a>
      </div>
    </div>
  );
}
