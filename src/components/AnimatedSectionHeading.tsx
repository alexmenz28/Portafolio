"use client";

import { ScrambleText } from "@/components/ScrambleText";

type Props = {
  title: string;
  subtitle: string;
};

export function AnimatedSectionHeading({ title, subtitle }: Props) {
  return (
    <div className="max-w-2xl">
      <ScrambleText
        text={title}
        as="h2"
        className="font-display text-2xl tracking-tight text-foreground md:text-[1.65rem]"
        duration={480}
      />
      <ScrambleText
        text={subtitle}
        as="p"
        className="mt-2 text-sm text-foreground/75 md:mt-1.5 md:text-[0.9rem]"
        duration={520}
      />
    </div>
  );
}
