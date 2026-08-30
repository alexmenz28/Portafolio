"use client";

import { useTranslations } from "next-intl";
import { AnimatedSectionHeading } from "@/components/AnimatedSectionHeading";
import { PanelBody, PanelShell } from "@/components/PanelShell";
import { ProjectGrid } from "@/components/ProjectGrid";

export function Projects() {
  const t = useTranslations("Projects");

  return (
    <PanelShell>
      <AnimatedSectionHeading title={t("title")} subtitle={t("subtitle")} />
      <PanelBody>
        <ProjectGrid />
      </PanelBody>
    </PanelShell>
  );
}
