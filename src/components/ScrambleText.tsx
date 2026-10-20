"use client";

import { useEffect, useRef, useState } from "react";
import { useScrambleText } from "@/hooks/useScrambleText";

type Props = {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  duration?: number;
  /** Run glyph reveal once on first paint (hero signature). */
  scrambleOnMount?: boolean;
  /** Run glyph reveal the first time the node enters the viewport. */
  revealOnView?: boolean;
};

const gridLayers =
  "[&>*]:col-start-1 [&>*]:row-start-1 [&>*]:row-end-2 [&>*]:col-end-2";

export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  duration,
  scrambleOnMount = false,
  revealOnView = false,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(
    !scrambleOnMount && !revealOnView,
  );

  useEffect(() => {
    if (scrambleOnMount && !revealOnView) {
      setActive(true);
    }
  }, [scrambleOnMount, revealOnView]);

  useEffect(() => {
    if (!revealOnView || active) return;
    const node = rootRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.45, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [revealOnView, active]);

  const { display, reserveText } = useScrambleText(text, duration, active);
  const gridClass =
    Tag === "span" ? `inline-grid ${gridLayers}` : `grid ${gridLayers}`;

  return (
    <Tag
      ref={rootRef as never}
      className={className ? `${gridClass} ${className}` : gridClass}
    >
      <span aria-hidden className="invisible select-none">
        {reserveText}
      </span>
      <span>{display}</span>
    </Tag>
  );
}
