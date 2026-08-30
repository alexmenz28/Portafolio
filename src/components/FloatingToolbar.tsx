"use client";

import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { ScrambleText } from "@/components/ScrambleText";
import { useTheme } from "@/components/ThemeProvider";
import { useLocaleSwitch } from "@/contexts/LocaleContext";
import { SCRAMBLE_DURATION_SHORT } from "@/hooks/useScrambleText";
import { TOOLBAR_SHORTCUTS, useToolbarShortcuts } from "@/hooks/useToolbarShortcuts";

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  if (theme === "dark") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function FloatingToolbar() {
  const t = useTranslations("Nav");
  const { theme, toggleTheme } = useTheme();
  const locale = useLocale();
  const { toggleLocale } = useLocaleSwitch();
  const nextLocale = locale === "en" ? "es" : "en";

  useToolbarShortcuts();

  const onThemeClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <nav className="floating-toolbar" aria-label={t("controls")}>
      <div className="chrome-control-group">
        <button
          type="button"
          onClick={onThemeClick}
          aria-label={`${theme === "dark" ? t("themeLight") : t("themeDark")} (${t("shortcut", { key: TOOLBAR_SHORTCUTS.theme })})`}
          className="chrome-control-btn"
        >
          <ThemeIcon theme={theme} />
        </button>
        <span className="chrome-control-shortcut" aria-hidden>
          {TOOLBAR_SHORTCUTS.theme}
        </span>
      </div>
      <div className="chrome-control-group">
        <button
          type="button"
          onClick={() => void toggleLocale()}
          aria-label={`${t("language")} (${t("shortcut", { key: TOOLBAR_SHORTCUTS.language })})`}
          className="chrome-control-btn chrome-control-btn--text"
        >
          <ScrambleText text={nextLocale.toUpperCase()} duration={SCRAMBLE_DURATION_SHORT} />
        </button>
        <span className="chrome-control-shortcut" aria-hidden>
          {TOOLBAR_SHORTCUTS.language}
        </span>
      </div>
    </nav>
  );
}
