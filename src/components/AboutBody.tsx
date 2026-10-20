"use client";

import { useTranslations } from "next-intl";

export function AboutBody() {
  const t = useTranslations("About");

  return (
    <p className="text-base text-foreground/85 md:text-lg">{t("body")}</p>
  );
}
