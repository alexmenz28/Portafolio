"use client";

import { useTranslations } from "next-intl";
import { AnimatedSectionHeading } from "@/components/AnimatedSectionHeading";
import { PanelBody, PanelShell } from "@/components/PanelShell";
import { ScrambleText } from "@/components/ScrambleText";

const EXPERIENCE_KEYS = ["utepsa"] as const;

export function Experience() {
  const t = useTranslations("Experience");

  return (
    <PanelShell>
      <AnimatedSectionHeading title={t("title")} subtitle={t("subtitle")} />
      <PanelBody className="space-y-6 md:space-y-4">
        {EXPERIENCE_KEYS.map((key) => {
          const bullets = t.raw(`items.${key}.bullets`) as string[];
          return (
            <article key={key} className="border-t border-secondary/25 pt-5 md:pt-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <ScrambleText
                    text={t(`items.${key}.company`)}
                    as="h3"
                    className="font-display text-xl text-foreground md:text-2xl"
                    duration={460}
                  />
                  <ScrambleText
                    text={t(`items.${key}.role`)}
                    as="p"
                    className="text-secondary"
                    duration={420}
                  />
                </div>
                <div className="text-sm text-foreground/70 md:text-right">
                  <ScrambleText text={t(`items.${key}.period`)} as="p" duration={380} />
                  <ScrambleText text={t(`items.${key}.location`)} as="p" duration={380} />
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-foreground/85 md:mt-3 md:text-[0.9rem]">
                {bullets.map((bullet, index) => (
                  <li key={`${key}-${index}`} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    <ScrambleText text={bullet} duration={500} />
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </PanelBody>
    </PanelShell>
  );
}
