const SWIPE_ONBOARDING_KEY = "portfolio-swipe-onboarding";

const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

export const TIMELINE_SWIPE_HINT_EVENT = "portfolio:timeline-swipe-hint";

export function hasSeenSwipeOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(SWIPE_ONBOARDING_KEY) === "1";
  } catch {
    return true;
  }
}

export function markSwipeOnboardingSeen(): void {
  try {
    localStorage.setItem(SWIPE_ONBOARDING_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export async function animateTrackPeek(
  track: HTMLElement,
  index: number,
  viewportWidth: number,
) {
  const peekPx = Math.min(Math.round(viewportWidth * 0.12), 52);

  track.classList.add("horizontal-track--onboarding");
  track.style.transition = `transform 0.5s ${EASING}`;
  track.style.transform = `translateX(calc(-${index * 100}% - ${peekPx}px))`;

  await wait(520);

  track.style.transition = `transform 0.65s ${EASING}`;
  track.style.transform = `translateX(-${index * 100}%)`;

  await wait(680);

  track.classList.remove("horizontal-track--onboarding");
  track.style.transition = "";
}

export async function animateTimelinePeek(
  track: HTMLElement,
  getTranslate: (dragPx: number) => number,
) {
  const peek = 48;

  track.classList.add("timeline-h-track--onboarding");

  track.style.transition = `transform 0.5s ${EASING}`;
  track.style.transform = `translateX(${getTranslate(peek)}px)`;
  await wait(500);

  track.style.transition = `transform 0.55s ${EASING}`;
  track.style.transform = `translateX(${getTranslate(0)}px)`;
  await wait(560);

  track.classList.remove("timeline-h-track--onboarding");
  track.style.transition = "";
}
