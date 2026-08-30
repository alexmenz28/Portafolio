"use client";

import { useTranslations } from "next-intl";
import { AboutBody } from "@/components/AboutBody";
import { AnimatedSectionHeading } from "@/components/AnimatedSectionHeading";
import { PanelBody, PanelShell } from "@/components/PanelShell";

export function About() {
  const t = useTranslations("About");

  return (
    <PanelShell>
      <AnimatedSectionHeading title={t("title")} subtitle={t("availability")} />
      <PanelBody className="max-w-3xl">
        <AboutBody />
      </PanelBody>
    </PanelShell>
  );
}
