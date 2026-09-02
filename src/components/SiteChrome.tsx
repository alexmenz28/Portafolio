"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FloatingToolbar } from "@/components/FloatingToolbar";
import { usePageNavigation } from "@/contexts/PageNavigationContext";
import { PAGE_SECTIONS } from "@/data/sections";
import { ScrambleText } from "@/components/ScrambleText";
import {
  applyWheelFriction,
  clampWheelTranslate,
  computeTouchVelocity,
  findCenteredStepIndex,
  NAV_WHEEL_DRAG_GAIN,
  NAV_WHEEL_FLING_BOOST,
  NAV_WHEEL_VELOCITY_STOP,
  translateToCenterStep,
  type TouchSample,
} from "@/lib/page-navigation";
import {
  animateTimelinePeek,
  hasSeenSwipeOnboarding,
  markSwipeOnboardingSeen,
  prefersReducedMotion,
  TIMELINE_SWIPE_HINT_EVENT,
} from "@/lib/swipe-onboarding";

const WHEEL_INTENT_THRESHOLD = 8;

export function SiteChrome() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const wheelTranslateRef = useRef(0);
  const centeredIndexRef = useRef(0);
  const onboardingRunning = useRef(false);
  const wheelTouch = useRef<{ startX: number; startTranslate: number } | null>(
    null,
  );
  const wheelIntent = useRef<"none" | "horizontal">("none");
  const wheelInertiaRef = useRef(false);
  const momentumFrameRef = useRef<number | null>(null);
  const touchSamplesRef = useRef<TouchSample[]>([]);
  const [wheelMode, setWheelMode] = useState(false);
  const [wheelDragging, setWheelDragging] = useState(false);
  const { activeIndex, goTo, goToIndex } = usePageNavigation();
  const [rail, setRail] = useState({ left: 0, width: 0 });
  const [progress, setProgress] = useState({ left: 0, width: 0 });

  activeIndexRef.current = activeIndex;

  const getTranslateBounds = useCallback(() => {
    const scroll = scrollRef.current;
    const first = stepRefs.current[0];
    const last = stepRefs.current[PAGE_SECTIONS.length - 1];
    if (!scroll || !first || !last) {
      return { min: 0, max: 0 };
    }

    const max = translateToCenterStep(
      scroll.clientWidth,
      first.offsetLeft,
      first.offsetWidth,
    );
    const min = translateToCenterStep(
      scroll.clientWidth,
      last.offsetLeft,
      last.offsetWidth,
    );

    return { min, max };
  }, []);

  const getTranslateForIndex = useCallback((index: number) => {
    const scroll = scrollRef.current;
    const step = stepRefs.current[index];
    if (!scroll || !step) return 0;

    return translateToCenterStep(
      scroll.clientWidth,
      step.offsetLeft,
      step.offsetWidth,
    );
  }, []);

  const applyWheelTranslate = useCallback(
    (translate: number, animated: boolean) => {
      const track = trackRef.current;
      if (!track || !wheelMode) return;

      wheelTranslateRef.current = translate;
      track.style.transition = animated ? "" : "none";
      track.classList.toggle("timeline-h-track--dragging", !animated);
      track.style.transform = `translateX(${translate}px)`;
    },
    [wheelMode],
  );

  const syncCenteredSection = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const centered = findCenteredStepIndex(scroll, stepRefs.current);
    centeredIndexRef.current = centered;

    if (centered !== activeIndexRef.current) {
      goToIndex(centered);
    }
  }, [goToIndex]);

  const syncProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const steps = track.querySelectorAll<HTMLElement>(".timeline-h-step");
    const activeStep = steps[activeIndexRef.current];
    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];

    if (!activeStep || !firstStep || !lastStep) return;

    const firstNode = firstStep.querySelector(".timeline-node");
    const activeNode = activeStep.querySelector(".timeline-node");
    const lastNode = lastStep.querySelector(".timeline-node");
    if (!firstNode || !activeNode || !lastNode) return;

    const trackRect = track.getBoundingClientRect();
    const nodeCenterX = (rect: DOMRect) => rect.left + rect.width / 2;

    const firstX = nodeCenterX(firstNode.getBoundingClientRect());
    const activeX = nodeCenterX(activeNode.getBoundingClientRect());
    const lastX = nodeCenterX(lastNode.getBoundingClientRect());

    const railLeft = firstX - trackRect.left;
    const railWidth = lastX - firstX;

    setRail({ left: railLeft, width: Math.max(0, railWidth) });
    setProgress({
      left: railLeft,
      width: Math.max(0, activeX - firstX),
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const syncMode = () => {
      const mobile = mq.matches;
      setWheelMode(mobile);
      scrollRef.current?.classList.toggle("timeline-h-scroll--wheel", mobile);
      trackRef.current?.classList.toggle("timeline-h-track--wheel", mobile);
      if (!mobile) {
        trackRef.current?.style.removeProperty("transform");
        trackRef.current?.classList.remove("timeline-h-track--dragging");
      } else {
        const translate = getTranslateForIndex(activeIndexRef.current);
        applyWheelTranslate(translate, false);
      }
    };

    syncMode();
    mq.addEventListener("change", syncMode);
    return () => mq.removeEventListener("change", syncMode);
  }, [applyWheelTranslate, getTranslateForIndex]);

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
    if (wheelMode && !wheelDragging && !wheelInertiaRef.current) {
      const translate = getTranslateForIndex(activeIndex);
      applyWheelTranslate(translate, true);
      centeredIndexRef.current = activeIndex;
    }
  }, [
    activeIndex,
    applyWheelTranslate,
    getTranslateForIndex,
    syncProgress,
    wheelDragging,
    wheelMode,
  ]);

  useEffect(() => {
    const nav = scrollRef.current;
    if (!nav || !wheelMode) return;

    const pushTouchSample = (x: number) => {
      const t = performance.now();
      touchSamplesRef.current.push({ x, t });
      const cutoff = t - 100;
      touchSamplesRef.current = touchSamplesRef.current.filter(
        (sample) => sample.t >= cutoff,
      );
    };

    const stopMomentum = () => {
      if (momentumFrameRef.current !== null) {
        cancelAnimationFrame(momentumFrameRef.current);
        momentumFrameRef.current = null;
      }
      wheelInertiaRef.current = false;
    };

    const snapToCentered = (animated: boolean) => {
      const centered = findCenteredStepIndex(nav, stepRefs.current);
      centeredIndexRef.current = centered;
      applyWheelTranslate(getTranslateForIndex(centered), animated);

      if (centered !== activeIndexRef.current) {
        goToIndex(centered);
      }

      syncProgress();
    };

    const startMomentum = (velocityTranslate: number) => {
      if (
        prefersReducedMotion() ||
        Math.abs(velocityTranslate) < NAV_WHEEL_VELOCITY_STOP
      ) {
        snapToCentered(true);
        return;
      }

      wheelInertiaRef.current = true;
      let velocity = velocityTranslate;
      let lastT = performance.now();

      const tick = (now: number) => {
        const dt = Math.min(32, now - lastT);
        lastT = now;

        velocity = applyWheelFriction(velocity, dt);

        const { min, max } = getTranslateBounds();
        let next = wheelTranslateRef.current + velocity * dt;

        if (next > max) {
          next = max;
          velocity = 0;
        } else if (next < min) {
          next = min;
          velocity = 0;
        }

        applyWheelTranslate(next, false);
        syncCenteredSection();
        syncProgress();

        if (Math.abs(velocity) < NAV_WHEEL_VELOCITY_STOP) {
          stopMomentum();
          snapToCentered(true);
          return;
        }

        momentumFrameRef.current = requestAnimationFrame(tick);
      };

      momentumFrameRef.current = requestAnimationFrame(tick);
    };

    const resetWheelTouch = () => {
      wheelTouch.current = null;
      wheelIntent.current = "none";
      touchSamplesRef.current = [];
      setWheelDragging(false);
    };

    const onTouchStart = (event: TouchEvent) => {
      stopMomentum();

      const touch = event.touches[0];
      if (!touch) return;

      wheelTouch.current = {
        startX: touch.clientX,
        startTranslate: wheelTranslateRef.current,
      };
      wheelIntent.current = "none";
      pushTouchSample(touch.clientX);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!wheelTouch.current) return;

      const touch = event.touches[0];
      if (!touch) return;

      pushTouchSample(touch.clientX);

      const dx = touch.clientX - wheelTouch.current.startX;

      if (wheelIntent.current === "none") {
        if (Math.abs(dx) < WHEEL_INTENT_THRESHOLD) return;
        wheelIntent.current = "horizontal";
        setWheelDragging(true);
      }

      if (wheelIntent.current !== "horizontal") return;

      event.preventDefault();

      const { min, max } = getTranslateBounds();
      const nextTranslate = clampWheelTranslate(
        wheelTouch.current.startTranslate + dx * NAV_WHEEL_DRAG_GAIN,
        min,
        max,
      );

      applyWheelTranslate(nextTranslate, false);
      syncCenteredSection();
      syncProgress();
    };

    const onTouchEnd = () => {
      if (!wheelTouch.current) {
        resetWheelTouch();
        return;
      }

      const intent = wheelIntent.current;
      const fingerVelocity = computeTouchVelocity(touchSamplesRef.current);
      resetWheelTouch();

      if (intent !== "horizontal") return;

      const velocityTranslate =
        fingerVelocity * NAV_WHEEL_DRAG_GAIN * NAV_WHEEL_FLING_BOOST;
      startMomentum(velocityTranslate);
    };

    const onTouchCancel = () => {
      stopMomentum();
      resetWheelTouch();
      snapToCentered(true);
    };

    nav.addEventListener("touchstart", onTouchStart, { passive: true });
    nav.addEventListener("touchmove", onTouchMove, { passive: false });
    nav.addEventListener("touchend", onTouchEnd, { passive: true });
    nav.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      stopMomentum();
      nav.removeEventListener("touchstart", onTouchStart);
      nav.removeEventListener("touchmove", onTouchMove);
      nav.removeEventListener("touchend", onTouchEnd);
      nav.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [
    applyWheelTranslate,
    getTranslateBounds,
    getTranslateForIndex,
    goToIndex,
    syncCenteredSection,
    syncProgress,
    wheelMode,
  ]);

  useEffect(() => {
    const onTimelineHint = async () => {
      const track = trackRef.current;
      if (!track || !wheelMode || hasSeenSwipeOnboarding()) return;
      if (prefersReducedMotion()) {
        markSwipeOnboardingSeen();
        return;
      }

      onboardingRunning.current = true;
      const base = wheelTranslateRef.current;
      await animateTimelinePeek(track, (dragPx) => base + dragPx);
      applyWheelTranslate(getTranslateForIndex(activeIndexRef.current), true);
      markSwipeOnboardingSeen();
      onboardingRunning.current = false;
    };

    window.addEventListener(TIMELINE_SWIPE_HINT_EVENT, onTimelineHint);
    return () => window.removeEventListener(TIMELINE_SWIPE_HINT_EVENT, onTimelineHint);
  }, [applyWheelTranslate, getTranslateForIndex, wheelMode]);

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
        className="site-chrome theme-surface fixed right-0 left-0 z-40 border-secondary/18 md:top-0 md:bottom-auto md:border-b bottom-0 border-t"
      >
        <nav
          ref={scrollRef}
          aria-label={t("timeline")}
          className="timeline-h-scroll"
        >
          <div ref={trackRef} className="timeline-h-track">
            <div
              aria-hidden
              className="timeline-h-rail"
              style={{
                left: `${rail.left}px`,
                width: `${rail.width}px`,
              }}
            />
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
