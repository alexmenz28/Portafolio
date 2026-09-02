"use client";

import { useTranslations } from "next-intl";
import { usePageNavigation } from "@/contexts/PageNavigationContext";
import { ScrambleText } from "@/components/ScrambleText";
import { social } from "@/data/links";

export function HeroContent() {
  const t = useTranslations("Hero");
  const { goTo } = usePageNavigation();

  return (
    <div className="flex flex-col">
      <ScrambleText
        text={t("role")}
        className="text-[0.68rem] font-medium tracking-[0.18em] text-secondary uppercase sm:text-[0.7rem] sm:tracking-[0.2em] md:text-xs"
        as="p"
      />
      <ScrambleText
        text="Alexander Mendoza Cholima"
        className="mt-3 text-balance font-display text-[2.15rem] leading-[1.1] tracking-[-0.02em] text-foreground sm:mt-4 sm:text-4xl md:text-5xl lg:text-[3.35rem]"
        as="h1"
        duration={520}
      />
      <ScrambleText
        text={t("location")}
        className="mt-2.5 text-sm text-secondary/90 sm:mt-3"
        as="p"
      />
      <ScrambleText
        text={t("tagline")}
        className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-foreground/78 sm:mt-6 sm:text-base md:text-lg"
        as="p"
        duration={560}
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
          <MailIcon />
        </a>
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-primary"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
        <a
          href={social.site}
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-primary"
          aria-label="Personal Memories"
        >
          <GlobeIcon />
        </a>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
