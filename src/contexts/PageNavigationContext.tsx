"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PAGE_SECTIONS, type PageSectionId } from "@/data/sections";

type PageNavigationValue = {
  activeIndex: number;
  activeId: PageSectionId;
  goTo: (id: PageSectionId) => void;
  goToTarget: (targetId: string) => void;
  setActiveIndex: (index: number) => void;
};

const PageNavigationContext = createContext<PageNavigationValue | null>(null);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

export function PageNavigationProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((id: PageSectionId) => {
    scrollToId(id);
  }, []);

  const goToTarget = useCallback((targetId: string) => {
    scrollToId(targetId);
  }, []);

  const value = useMemo(
    () => ({
      activeIndex,
      activeId: PAGE_SECTIONS[activeIndex].id,
      goTo,
      goToTarget,
      setActiveIndex,
    }),
    [activeIndex, goTo, goToTarget],
  );

  return (
    <PageNavigationContext.Provider value={value}>
      {children}
    </PageNavigationContext.Provider>
  );
}

export function usePageNavigation() {
  const ctx = useContext(PageNavigationContext);
  if (!ctx) {
    throw new Error("usePageNavigation must be used within PageNavigationProvider");
  }
  return ctx;
}
