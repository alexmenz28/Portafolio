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
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-secondary/25 bg-card md:max-w-[220px] md:justify-self-end">
          <Image
            src="/images/profile.png"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 220px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </PanelShell>
  );
}
