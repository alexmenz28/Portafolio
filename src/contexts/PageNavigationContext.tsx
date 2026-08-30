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

export type SlideDirection = 1 | -1;

type PageNavigationValue = {
  activeIndex: number;
  activeId: PageSectionId;
  direction: SlideDirection;
  goTo: (id: PageSectionId) => void;
  goToIndex: (index: number) => void;
};

const PageNavigationContext = createContext<PageNavigationValue | null>(null);

export function PageNavigationProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>(1);

  const goToIndex = useCallback((index: number) => {
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      setDirection(index > prev ? 1 : -1);
      return index;
    });
  }, []);

  const goTo = useCallback(
    (id: PageSectionId) => {
      const index = PAGE_SECTIONS.findIndex((s) => s.id === id);
      if (index >= 0) goToIndex(index);
    },
    [goToIndex],
  );

  const value = useMemo(
    () => ({
      activeIndex,
      activeId: PAGE_SECTIONS[activeIndex].id,
      direction,
      goTo,
      goToIndex,
    }),
    [activeIndex, direction, goTo, goToIndex],
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
