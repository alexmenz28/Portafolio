"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyThemeToDom,
  getStoredTheme,
  getSystemTheme,
  oppositeTheme,
  prefersReducedMotion,
  readDomTheme,
  setRevealOrigin,
  supportsViewTransitions,
  type Theme,
  type ThemeOrigin,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: (origin?: ThemeOrigin) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const themeRef = useRef<Theme>("dark");
  const activeTransitionRef = useRef<ViewTransition | null>(null);

  const applyTheme = useCallback((next: Theme, persist: boolean) => {
    applyThemeToDom(next);
    if (persist) window.localStorage.setItem("theme", next);
    themeRef.current = next;
    setTheme(next);
  }, []);

  useEffect(() => {
    const resolved = readDomTheme() ?? getStoredTheme() ?? getSystemTheme();
    themeRef.current = resolved;
    setTheme(resolved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!getStoredTheme()) applyTheme(getSystemTheme(), false);
    };

    media.addEventListener("change", onSystemChange);
    return () => {
      media.removeEventListener("change", onSystemChange);
      activeTransitionRef.current?.skipTransition();
    };
  }, [applyTheme]);

  const toggleTheme = useCallback(
    (origin?: ThemeOrigin) => {
      setRevealOrigin(origin);

      if (activeTransitionRef.current) {
        activeTransitionRef.current.skipTransition();
        activeTransitionRef.current = null;
      }

      const next = oppositeTheme(themeRef.current);
      const update = () => applyTheme(next, true);

      if (prefersReducedMotion() || !supportsViewTransitions()) {
        update();
        return;
      }

      const transition = document.startViewTransition(update);
      activeTransitionRef.current = transition;

      transition.finished.finally(() => {
        if (activeTransitionRef.current === transition) {
          activeTransitionRef.current = null;
        }
      });
    },
    [applyTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app-shell relative z-10 min-h-full">{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
