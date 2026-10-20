"use client";

import { useTranslations } from "next-intl";
import {
  Children,
  isValidElement,
  useEffect,
  type ReactNode,
} from "react";
import { usePageNavigation } from "@/contexts/PageNavigationContext";
import { PAGE_SECTIONS } from "@/data/sections";

type Props = {
  children: ReactNode;
};

export function VerticalPage({ children }: Props) {
  const t = useTranslations("Nav");
  const { setActiveIndex } = usePageNavigation();
  const panels = Children.toArray(children).filter(isValidElement);

  useEffect(() => {
    const sections = PAGE_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((node): node is HTMLElement => Boolean(node));

    if (sections.length === 0) return;

    const syncActive = () => {
      const vh = window.innerHeight || 1;
      const hero = sections[0];
      const heroRect = hero?.getBoundingClientRect();

      // While the hero still owns most of the viewport → Inicio.
      if (
        window.scrollY <= vh * 0.12 ||
        (heroRect && heroRect.top <= 8 && heroRect.bottom >= vh * 0.55)
      ) {
        setActiveIndex(0);
        return;
      }

      const marker = vh * 0.32;
      let active = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= marker) {
          active = index;
        }
      });

      setActiveIndex(active);
    };

    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);

    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, [setActiveIndex, panels.length]);

  return (
    <main
      className="vertical-page"
      itemScope
      itemType="https://schema.org/ProfilePage"
    >
      {panels.map((child, index) => {
        const section = PAGE_SECTIONS[index];
        if (!section) return null;

        return (
          <section
            key={section.id}
            id={section.id}
            data-section={section.id}
            aria-label={t(section.navKey)}
            className={`vertical-section ${section.id === "hero" ? "vertical-section--hero" : ""}`}
          >
            {child}
          </section>
        );
      })}
    </main>
  );
}
