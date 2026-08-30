"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePageNavigation } from "@/contexts/PageNavigationContext";
import { PAGE_SECTIONS } from "@/data/sections";

type Props = {
  children: ReactNode;
};

const SWIPE_COMMIT_RATIO = 0.22;
const INTENT_THRESHOLD = 10;

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function clampDrag(
  index: number,
  maxIndex: number,
  dx: number,
) {
  if (index === 0 && dx > 0) return dx * 0.32;
  if (index === maxIndex && dx < 0) return dx * 0.32;
  return dx;
}

export function HorizontalPage({ children }: Props) {
  const { activeIndex, direction, goToIndex } = usePageNavigation();
  const panels = Children.toArray(children).filter(isValidElement);
  const viewportRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchIntent = useRef<"none" | "vertical" | "horizontal">("none");
  const dragBaseIndex = useRef(0);
  const isDragging = useRef(false);

  activeIndexRef.current = activeIndex;

  const applyTrackTransform = (
    index: number,
    dragPx: number,
    animated: boolean,
  ) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animated ? "" : "none";
    track.style.transform =
      dragPx === 0
        ? `translateX(-${index * 100}%)`
        : `translateX(calc(-${index * 100}% + ${dragPx}px))`;
    track.classList.toggle("horizontal-track--dragging", !animated);
  };

  useEffect(() => {
    document.documentElement.classList.add("horizontal-shell");
    return () => document.documentElement.classList.remove("horizontal-shell");
  }, []);

  useEffect(() => {
    if (!isDragging.current) {
      applyTrackTransform(activeIndex, 0, true);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!isMobileViewport()) return;
    const inner = document.querySelector(
      ".horizontal-panel--active .horizontal-panel-inner",
    );
    if (inner instanceof HTMLElement) inner.scrollTop = 0;
  }, [activeIndex]);

  useEffect(() => {
    const panelCount = panels.length;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const navigateRelative = (delta: number) => {
      const next = Math.min(
        Math.max(activeIndexRef.current + delta, 0),
        panelCount - 1,
      );
      if (next === activeIndexRef.current) return;
      activeIndexRef.current = next;
      goToIndex(next);
    };

    const getScrollRoot = (target: EventTarget | null) => {
      if (!isMobileViewport()) return null;
      const el = target as HTMLElement | null;
      const panel = el?.closest(".horizontal-panel--active");
      if (!panel) return null;
      return panel.querySelector(".horizontal-panel-inner") as HTMLElement | null;
    };

    const canScrollVertically = (root: HTMLElement, dy: number) => {
      if (root.scrollHeight <= root.clientHeight + 1) return false;
      const atTop = root.scrollTop <= 0;
      const atBottom =
        root.scrollTop + root.clientHeight >= root.scrollHeight - 1;
      if (dy > 0 && !atBottom) return true;
      if (dy < 0 && !atTop) return true;
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (isMobileViewport()) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (target?.closest(".timeline-h-scroll, .site-chrome, .floating-toolbar")) return;

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (Math.abs(delta) < 24) return;

      event.preventDefault();

      if (delta > 0) {
        navigateRelative(1);
      } else {
        navigateRelative(-1);
      }
    };

    const resetTouch = () => {
      touchStart.current = null;
      touchIntent.current = "none";
      isDragging.current = false;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!isMobileViewport()) return;

      const touch = event.touches[0];
      if (!touch) return;

      touchStart.current = { x: touch.clientX, y: touch.clientY };
      touchIntent.current = "none";
      dragBaseIndex.current = activeIndexRef.current;
      isDragging.current = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isMobileViewport() || !touchStart.current) return;

      const touch = event.touches[0];
      if (!touch) return;

      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;

      if (touchIntent.current === "none") {
        if (Math.abs(dx) < INTENT_THRESHOLD && Math.abs(dy) < INTENT_THRESHOLD) {
          return;
        }

        const root = getScrollRoot(event.target);
        if (Math.abs(dy) > Math.abs(dx)) {
          if (root && canScrollVertically(root, dy)) {
            touchIntent.current = "vertical";
          }
          return;
        }

        touchIntent.current = "horizontal";
        dragBaseIndex.current = activeIndexRef.current;
        isDragging.current = true;
      }

      if (touchIntent.current === "vertical") return;

      event.preventDefault();

      const dragPx = clampDrag(
        dragBaseIndex.current,
        panelCount - 1,
        dx,
      );
      applyTrackTransform(dragBaseIndex.current, dragPx, false);
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!isMobileViewport() || !touchStart.current) {
        resetTouch();
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
        resetTouch();
        return;
      }

      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      const intent = touchIntent.current;
      resetTouch();

      if (intent === "vertical") return;

      const root = getScrollRoot(event.target);
      if (
        intent === "none" &&
        root &&
        Math.abs(dy) > Math.abs(dx) &&
        canScrollVertically(root, dy)
      ) {
        return;
      }

      if (intent !== "horizontal") {
        applyTrackTransform(activeIndexRef.current, 0, true);
        return;
      }

      const width = viewport.clientWidth;
      const threshold = width * SWIPE_COMMIT_RATIO;
      let target = dragBaseIndex.current;

      if (dx < -threshold && target < panelCount - 1) {
        target += 1;
      } else if (dx > threshold && target > 0) {
        target -= 1;
      }

      isDragging.current = false;
      applyTrackTransform(target, 0, true);

      if (target !== activeIndexRef.current) {
        activeIndexRef.current = target;
        goToIndex(target);
      }
    };

    const onTouchCancel = () => {
      if (!isMobileViewport()) return;
      const index = activeIndexRef.current;
      resetTouch();
      applyTrackTransform(index, 0, true);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        navigateRelative(1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        navigateRelative(-1);
      }
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", onTouchCancel, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchCancel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goToIndex, panels.length]);

  return (
    <main ref={viewportRef} className="horizontal-viewport">
      <div
        ref={trackRef}
        className="horizontal-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {panels.map((panel, index) => {
          const section = PAGE_SECTIONS[index];
          const isActive = index === activeIndex;

          return (
            <section
              key={section?.id ?? index}
              id={section?.id}
              className={`horizontal-panel ${isActive ? "horizontal-panel--active" : ""}`}
              data-direction={direction}
              aria-hidden={!isActive}
            >
              <div
                className={`horizontal-panel-inner ${isActive ? "horizontal-panel-inner--enter" : ""}`}
                data-direction={isActive ? direction : undefined}
              >
                {panel}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
