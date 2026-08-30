"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FloatingToolbar } from "@/components/FloatingToolbar";
import { usePageNavigation } from "@/contexts/PageNavigationContext";
import { PAGE_SECTIONS } from "@/data/sections";
import { ScrambleText } from "@/components/ScrambleText";
import {
  animateTimelinePeek,
  hasSeenSwipeOnboarding,
  isMobileViewport,
  markSwipeOnboardingSeen,
  prefersReducedMotion,
  TIMELINE_SWIPE_HINT_EVENT,
} from "@/lib/swipe-onboarding";

export function SiteChrome() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onboardingRunning = useRef(false);
  const { activeIndex, goTo } = usePageNavigation();
  const [progress, setProgress] = useState({ left: 0, width: 0 });

  const syncProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const rail = track.querySelector(".timeline-h-rail");
    const steps = track.querySelectorAll<HTMLElement>(".timeline-h-step");
    const activeStep = steps[activeIndex];
    const firstStep = steps[0];

    if (!rail || !activeStep || !firstStep) return;

    const railRect = rail.getBoundingClientRect();
    const firstNode = firstStep.querySelector(".timeline-node");
    const activeNode = activeStep.querySelector(".timeline-node");
    if (!firstNode || !activeNode) return;

    const firstRect = firstNode.getBoundingClientRect();
    const activeRect = activeNode.getBoundingClientRect();
    const start = firstRect.left + firstRect.width / 2 - railRect.left;
    const end = activeRect.left + activeRect.width / 2 - railRect.left;

    setProgress({ left: start, width: Math.max(0, end - start) });
  }, [activeIndex]);

  const scrollActiveStepIntoView = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      if (!isMobileViewport()) return;

      const scroll = scrollRef.current;
      const step = stepRefs.current[activeIndex];
      if (!scroll || !step) return;

      const scrollRect = scroll.getBoundingClientRect();
      const stepRect = step.getBoundingClientRect();
      const target =
        scroll.scrollLeft +
        (stepRect.left + stepRect.width / 2 - (scrollRect.left + scrollRect.width / 2));

      scroll.scrollTo({
        left: Math.max(0, target),
        behavior,
      });
    },
    [activeIndex],
  );

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--site-chrome-height",
        `${node.getBoundingClientRect().height}px`,
      );
      syncProgress();
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(node);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [syncProgress]);

  useLayoutEffect(() => {
    syncProgress();
    if (!onboardingRunning.current) {
      scrollActiveStepIntoView("smooth");
    }
  }, [activeIndex, scrollActiveStepIntoView, syncProgress]);

  useEffect(() => {
    const onTimelineHint = async () => {
      const scroll = scrollRef.current;
      if (!scroll || hasSeenSwipeOnboarding()) return;
      if (prefersReducedMotion()) {
        markSwipeOnboardingSeen();
        return;
      }

      onboardingRunning.current = true;
      await animateTimelinePeek(scroll);
      scrollActiveStepIntoView("smooth");
      markSwipeOnboardingSeen();
      onboardingRunning.current = false;
    };

    window.addEventListener(TIMELINE_SWIPE_HINT_EVENT, onTimelineHint);
    return () => window.removeEventListener(TIMELINE_SWIPE_HINT_EVENT, onTimelineHint);
  }, [scrollActiveStepIntoView]);

  const isLabPage =
    pathname === "/ui" ||
    pathname === "/motion" ||
    pathname.endsWith("/ui") ||
    pathname.endsWith("/motion");

  if (isLabPage) return null;

  return (
    <>
      <FloatingToolbar />

      <header
        ref={headerRef}
        className="site-chrome theme-surface fixed right-0 left-0 z-40 border-secondary/25 md:top-0 md:bottom-auto md:border-b bottom-0 border-t"
      >
        <nav
          ref={scrollRef}
          aria-label={t("timeline")}
          className="timeline-h-scroll"
        >
          <div ref={trackRef} className="timeline-h-track">
            <div aria-hidden className="timeline-h-rail" />
            <div
              aria-hidden
              className="timeline-h-progress"
              style={{
                left: `${progress.left}px`,
                width: `${progress.width}px`,
              }}
            />

            {PAGE_SECTIONS.map((section, index) => {
              const isActive = activeIndex === index;
              const isPast = activeIndex > index;

              return (
                <button
                  key={section.id}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  type="button"
                  onClick={() => goTo(section.id)}
                  aria-current={isActive ? "step" : undefined}
                  className="timeline-h-step group"
                >
                  <span
                    className={`timeline-node ${isActive ? "timeline-node--active" : ""} ${isPast ? "timeline-node--past" : ""}`}
                    aria-hidden
                  >
                    {isActive ? <span className="timeline-node-core" /> : null}
                  </span>
                  <ScrambleText
                    text={t(section.navKey)}
                    className={`timeline-h-label ${isActive ? "timeline-h-label--active" : ""} ${isPast ? "timeline-h-label--past" : ""}`}
                  />
                </button>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}
