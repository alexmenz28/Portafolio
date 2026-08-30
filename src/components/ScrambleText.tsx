"use client";

import { useScrambleText } from "@/hooks/useScrambleText";

type Props = {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  duration?: number;
};

export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  duration,
}: Props) {
  const display = useScrambleText(text, duration);
  return <Tag className={className}>{display}</Tag>;
}
