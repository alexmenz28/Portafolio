"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { AnimatedSectionHeading } from "@/components/AnimatedSectionHeading";
import { Footer } from "@/components/Footer";
import { GitHubIcon, GlobeIcon, MailIcon } from "@/components/Icons";
import { PanelBody, PanelShell } from "@/components/PanelShell";
import { ScrambleText } from "@/components/ScrambleText";
import { social } from "@/data/links";

type ContactLink = {
  id: string;
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
  primary?: boolean;
  domId?: string;
};

export function Contact() {
  const t = useTranslations("Contact");

  const links: ContactLink[] = [
    {
      id: "email",
      href: social.email,
      label: t("email"),
      icon: <MailIcon size={16} />,
      primary: true,
    },
    {
      id: "github",
      href: social.github,
      label: t("github"),
      icon: <GitHubIcon size={16} />,
      external: true,
    },
    {
      id: "product",
      href: social.site,
      label: t("product"),
      icon: <GlobeIcon size={16} />,
      external: true,
    },
    {
      id: "kolki",
      href: social.kolki,
      label: t("kolki"),
      icon: <GlobeIcon size={16} />,
      external: true,
      domId: "contact-kolki",
    },
  ];

  return (
    <PanelShell className="md:justify-between">
      <div>
        <AnimatedSectionHeading title={t("title")} subtitle={t("subtitle")} />
        <PanelBody>
          <div id="contact-links" className="flex scroll-mt-6 flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.id}
                id={link.domId}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={
                  link.primary
                    ? "inline-flex scroll-mt-6 items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold tracking-wide text-background transition duration-300 hover:bg-primary"
                    : "inline-flex scroll-mt-6 items-center gap-2 rounded-md border border-secondary/70 px-5 py-2.5 text-sm font-semibold tracking-wide text-secondary transition duration-300 hover:border-secondary hover:bg-secondary hover:text-background"
                }
              >
                {link.icon}
                <ScrambleText text={link.label} duration={360} />
              </a>
            ))}
          </div>
        </PanelBody>
      </div>
      <Footer />
    </PanelShell>
  );
}
