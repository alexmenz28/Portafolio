"use client";

import { useTranslations } from "next-intl";
import { ScrambleText } from "@/components/ScrambleText";

export function AboutBody() {
  const t = useTranslations("About");

  return (
    <ScrambleText
      text={t("body")}
      as="p"
      className="text-base text-foreground/85 md:text-lg"
      duration={560}
    />
  );
}
