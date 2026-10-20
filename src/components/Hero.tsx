"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroContent } from "@/components/HeroContent";
import { PanelShell } from "@/components/PanelShell";
import { ScrambleText } from "@/components/ScrambleText";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <PanelShell className="min-h-[100dvh] justify-center py-10 md:py-12">
      <div className="flex w-full max-w-3xl flex-col gap-7 sm:gap-8 md:gap-9">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="hero-avatar relative h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-full border border-secondary/35 bg-card sm:h-24 sm:w-24 md:h-[6.5rem] md:w-[6.5rem]">
            <Image
              src="/images/profile.webp"
              alt={t("photoAlt")}
              fill
              priority
              sizes="(max-width: 640px) 76px, (max-width: 768px) 96px, 104px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <div className="min-w-0">
            <ScrambleText
              text={t("role")}
              className="text-[0.68rem] font-medium tracking-[0.18em] text-secondary uppercase sm:text-[0.7rem] sm:tracking-[0.2em] md:text-xs"
              as="p"
              scrambleOnMount
            />
            <ScrambleText
              text="Alexander Mendoza Cholima"
              className="mt-1.5 text-balance font-display text-[1.85rem] leading-[1.1] tracking-[-0.02em] text-foreground sm:mt-2 sm:text-4xl md:text-[2.75rem] lg:text-[3.1rem]"
              as="h1"
              duration={560}
              scrambleOnMount
            />
          </div>
        </div>

        <HeroContent />
      </div>
    </PanelShell>
  );
}
