"use client";

import { useScrambleText } from "@/hooks/useScrambleText";

type Props = {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  duration?: number;
};

const gridLayers =
  "[&>*]:col-start-1 [&>*]:row-start-1 [&>*]:row-end-2 [&>*]:col-end-2";

export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  duration,
}: Props) {
  const { display, reserveText } = useScrambleText(text, duration);
  const gridClass =
    Tag === "span" ? `inline-grid ${gridLayers}` : `grid ${gridLayers}`;

  return (
    <Tag className={className ? `${gridClass} ${className}` : gridClass}>
      <span aria-hidden className="invisible select-none">
        {reserveText}
      </span>
      <span>{display}</span>
    </Tag>
  );
}
