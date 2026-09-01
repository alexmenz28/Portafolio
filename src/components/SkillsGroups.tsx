"use client";

import { useTranslations } from "next-intl";
import { ScrambleText } from "@/components/ScrambleText";

const GROUP_KEYS = ["web", "languages", "tools", "dotnet"] as const;

export function SkillsGroups() {
  const t = useTranslations("Skills");

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:gap-5">
      {GROUP_KEYS.map((key) => (
        <div
          key={key}
          className="border-l-2 border-secondary/50 py-0.5 pl-4 md:pl-3.5"
        >
          <ScrambleText
            text={t(`groups.${key}.label`)}
            as="h3"
            className="text-sm font-semibold tracking-wide text-secondary uppercase"
            duration={420}
          />
          <ScrambleText
            text={t(`groups.${key}.items`)}
            as="p"
            className="mt-2 text-sm leading-relaxed text-foreground/90 md:mt-1.5 md:text-[0.9rem]"
            duration={480}
          />
        </div>
      ))}
    </div>
  );
}
