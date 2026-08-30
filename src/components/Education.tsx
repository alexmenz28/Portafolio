"use client";

import { useTranslations } from "next-intl";
import { AnimatedSectionHeading } from "@/components/AnimatedSectionHeading";
import { PanelBody, PanelShell } from "@/components/PanelShell";
import { ScrambleText } from "@/components/ScrambleText";

export function Education() {
  const t = useTranslations("Education");
  const bullets = t.raw("bullets") as string[];

  return (
    <PanelShell>
      <AnimatedSectionHeading title={t("title")} subtitle={t("subtitle")} />
      <PanelBody>
        <article className="border-t border-secondary/25 pt-5 md:pt-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <div>
              <ScrambleText
                text={t("school")}
                as="h3"
                className="font-display text-xl text-foreground md:text-2xl"
                duration={460}
              />
              <ScrambleText
                text={t("degree")}
                as="p"
                className="text-secondary"
                duration={420}
              />
            </div>
            <div className="text-sm text-foreground/70 md:text-right">
              <ScrambleText text={t("period")} as="p" duration={380} />
              <ScrambleText text={t("location")} as="p" duration={380} />
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/85 md:mt-3 md:text-[0.9rem]">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <ScrambleText text={bullet} duration={500} />
              </li>
            ))}
          </ul>
        </article>
      </PanelBody>
    </PanelShell>
  );
}
