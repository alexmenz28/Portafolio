"use client";

import { useEffect, useRef, useState } from "react";

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789·/&";

/** Default scramble duration (ms) — locale / copy transitions */
export const SCRAMBLE_DURATION = 720;

/** Shorter scramble for compact UI (buttons, tags) */
export const SCRAMBLE_DURATION_SHORT = 560;

function scrambleFrame(from: string, to: string, progress: number) {
  const length = Math.max(from.length, to.length);
  let out = "";

  for (let i = 0; i < length; i += 1) {
    const targetChar = to[i] ?? "";
    const revealAt = i / length;

    if (progress >= revealAt) {
      out += targetChar;
      continue;
    }

    if (targetChar === " " || targetChar === "\n") {
      out += targetChar;
      continue;
    }

    const sourceChar = from[i];
    if (sourceChar && progress < revealAt * 0.35) {
      out += sourceChar;
      continue;
    }

    out +=
      CHARSET[Math.floor(Math.random() * CHARSET.length)] ??
      targetChar;
  }

  return out;
}

export function useScrambleText(text: string, duration = SCRAMBLE_DURATION) {
  const [display, setDisplay] = useState(text);
  const displayRef = useRef(text);
  const targetRef = useRef(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (text === targetRef.current) return;

    const from = displayRef.current;
    targetRef.current = text;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 2.2;
      const nextDisplay = scrambleFrame(from, text, eased);
      displayRef.current = nextDisplay;
      setDisplay(nextDisplay);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        displayRef.current = text;
        setDisplay(text);
        frameRef.current = null;
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [text, duration]);

  return display;
}
