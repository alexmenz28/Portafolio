"use client";

import { useEffect, useRef, useState } from "react";
import { ScrambleText } from "@/components/ScrambleText";

type Props = {
  title: string;
  subtitle: string;
};

export function AnimatedSectionHeading({ title, subtitle }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.45, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`section-ink max-w-2xl ${inView ? "section-ink--in" : ""}`}
    >
      <ScrambleText
        text={title}
        as="h2"
        className="font-display text-[1.65rem] tracking-[-0.015em] text-foreground sm:text-2xl md:text-[1.7rem]"
        duration={520}
        revealOnView
      />
      <ScrambleText
        text={subtitle}
        as="p"
        className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/68 md:mt-1.5 md:text-[0.9rem]"
        duration={560}
        revealOnView
      />
    </div>
  );
}
