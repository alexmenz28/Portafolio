"use client";

// import Image from "next/image";
// import { useTranslations } from "next-intl";
import { HeroContent } from "@/components/HeroContent";
import { PanelShell } from "@/components/PanelShell";

export function Hero() {
  // const t = useTranslations("Hero");

  return (
    <PanelShell className="justify-center">
      {/* Sin foto: una sola composición. Con foto: md:grid-cols-[1.15fr_0.85fr] md:items-center */}
      <div className="w-full max-w-3xl">
        <HeroContent />
        {/* Foto temporalmente oculta — descomentar para restaurar (+ grid-cols en el wrapper)
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-secondary/20 bg-card shadow-[0_1px_0_color-mix(in_srgb,var(--fg)_4%,transparent)] md:max-w-[240px] md:justify-self-end">
          <Image
            src="/images/profile.png"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-cover object-top"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_35%,transparent)] via-transparent to-transparent"
          />
        </div>
        */}
      </div>
    </PanelShell>
  );
}
