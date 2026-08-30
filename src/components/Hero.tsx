"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroContent } from "@/components/HeroContent";
import { PanelShell } from "@/components/PanelShell";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <PanelShell>
      <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-6">
        <HeroContent />
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden md:mx-0 md:max-w-[220px]">
          <div className="absolute inset-0 bg-accent" />
          <Image
            src="/images/profile.png"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(max-width: 768px) 80vw, 220px"
            className="object-cover object-top opacity-95"
          />
        </div>
      </div>
    </PanelShell>
  );
}
