"use client";

import { useEffect } from "react";
import { useLocaleSwitch } from "@/contexts/LocaleContext";
import { useTheme } from "@/components/ThemeProvider";

const THEME_SHORTCUT = "t";
const LANGUAGE_SHORTCUT = "l";

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return Boolean(el?.closest("input, textarea, select, [contenteditable]"));
}

export function useToolbarShortcuts() {
  const { toggleTheme } = useTheme();
  const { toggleLocale } = useLocaleSwitch();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();

      if (key === THEME_SHORTCUT) {
        event.preventDefault();
        toggleTheme();
        return;
      }

      if (key === LANGUAGE_SHORTCUT) {
        event.preventDefault();
        void toggleLocale();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleLocale, toggleTheme]);
}

export const TOOLBAR_SHORTCUTS = {
  theme: "T",
  language: "L",
} as const;
