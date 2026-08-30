"use client";

import { useTranslations } from "next-intl";
import { AnimatedSectionHeading } from "@/components/AnimatedSectionHeading";
import { PanelBody, PanelShell } from "@/components/PanelShell";
import { SkillsGroups } from "./SkillsGroups";

export function Skills() {
  const t = useTranslations("Skills");

  return (
    <PanelShell>
      <AnimatedSectionHeading title={t("title")} subtitle={t("subtitle")} />
      <PanelBody>
        <SkillsGroups />
      </PanelBody>
    </PanelShell>
  );
}
