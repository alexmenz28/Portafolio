"use client";

import { useTranslations } from "next-intl";
import { AnimatedSectionHeading } from "@/components/AnimatedSectionHeading";
import { Footer } from "@/components/Footer";
import { PanelBody, PanelShell } from "@/components/PanelShell";
import { ScrambleText } from "@/components/ScrambleText";
import { social } from "@/data/links";

export function Contact() {
  const t = useTranslations("Contact");

  return (
    <PanelShell className="md:justify-between">
      <div>
        <AnimatedSectionHeading title={t("title")} subtitle={t("subtitle")} />
        <PanelBody>
          <div className="flex flex-wrap gap-3">
            <a
              href={social.email}
              className="inline-flex items-center rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-background transition duration-300 hover:bg-primary"
            >
              <ScrambleText text={t("email")} duration={360} />
            </a>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-secondary px-5 py-2.5 text-sm font-semibold text-secondary transition duration-300 hover:bg-secondary hover:text-background"
            >
              <ScrambleText text={t("github")} duration={360} />
            </a>
            <a
              href={social.site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-secondary px-5 py-2.5 text-sm font-semibold text-secondary transition duration-300 hover:bg-secondary hover:text-background"
            >
              <ScrambleText text={t("product")} duration={360} />
            </a>
          </div>
        </PanelBody>
      </div>
      <Footer />
    </PanelShell>
  );
}
