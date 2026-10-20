"use client";

import { useEffect, useRef, useState } from "react";

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789·/&";

/** Default scramble duration (ms) — locale / copy transitions */
export const SCRAMBLE_DURATION = 720;

/** Shorter scramble for compact UI (buttons, tags) */
export const SCRAMBLE_DURATION_SHORT = 560;

function randomGlyph() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? "·";
}

function scrambleFrame(from: string, to: string, eased: number) {
  const fromLen = from.length;
  const toLen = to.length;
  const visibleLength = Math.max(
    0,
    Math.round(fromLen + (toLen - fromLen) * eased),
  );

  if (visibleLength === 0) return "";

  let out = "";

  for (let i = 0; i < visibleLength; i += 1) {
    const hasTarget = i < toLen;
    const hasSource = i < fromLen;
    const targetChar = hasTarget ? to[i]! : "";
    const sourceChar = hasSource ? from[i]! : "";
    const revealAt = i / visibleLength;

    if (hasTarget && eased >= revealAt) {
      out += targetChar;
      continue;
    }

    if (targetChar === " " || targetChar === "\n") {
      out += targetChar;
      continue;
    }

    if (hasSource && eased < revealAt * 0.35) {
      out += sourceChar;
      continue;
    }

    out += hasTarget ? randomGlyph() : hasSource ? randomGlyph() : "";
  }

  return out;
}

/** Longer string in a locale pair — keeps layout width stable while scrambling. */
export function reserveScrambleWidth(from: string, to: string) {
  return from.length >= to.length ? from : to;
}

/**
 * Glyph scramble. When `active` is false, display stays empty.
 * Flipping `active` to true (or changing `text` while active) runs the reveal.
 */
export function useScrambleText(
  text: string,
  duration = SCRAMBLE_DURATION,
  active = true,
) {
  const [display, setDisplay] = useState(() => (active ? text : ""));
  const [reserveText, setReserveText] = useState(text);
  const displayRef = useRef(active ? text : "");
  const targetRef = useRef(active ? text : "");
  const frameRef = useRef<number | null>(null);
  const wasActiveRef = useRef(active);

  useEffect(() => {
    if (!active) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      displayRef.current = "";
      targetRef.current = "";
      wasActiveRef.current = false;
      setDisplay("");
      setReserveText(text);
      return;
    }

    const becameActive = !wasActiveRef.current;
    wasActiveRef.current = true;

    if (!becameActive && text === targetRef.current) return;

    const from = becameActive ? "" : displayRef.current;
    targetRef.current = text;
    setReserveText(reserveScrambleWidth(from || text, text));
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
        frameRef.current = null;
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [text, duration, active]);

  return { display, reserveText };
}
