"use client";

import { useTranslations } from "next-intl";
import { ScrambleText } from "@/components/ScrambleText";

const GROUP_KEYS = ["web", "languages", "tools", "dotnet"] as const;

function skillTags(items: string) {
  return items
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function SkillsGroups() {
  const t = useTranslations("Skills");

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:gap-5">
      {GROUP_KEYS.map((key) => {
        const tags = skillTags(t(`groups.${key}.items`));
        return (
          <div
            key={key}
            id={`skill-${key}`}
            className="scroll-mt-6 border-l-2 border-secondary/40 py-0.5 pl-4 md:pl-3.5"
          >
            <ScrambleText
              text={t(`groups.${key}.label`)}
              as="h3"
              className="text-sm font-semibold tracking-wide text-secondary uppercase"
              duration={420}
            />
            <ul className="mt-2.5 flex flex-wrap gap-1.5 md:mt-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-secondary/40 px-2.5 py-1 text-xs tracking-wide text-secondary"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
