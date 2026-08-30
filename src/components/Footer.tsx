"use client";

import { useTranslations } from "next-intl";
import { ScrambleText } from "@/components/ScrambleText";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary/20 py-6 text-sm text-foreground/70">
      <ScrambleText text={t("rights", { year })} duration={440} />
    </footer>
  );
}
