export function clampPageDrag(
  index: number,
  maxIndex: number,
  dx: number,
) {
  if (index === 0 && dx > 0) return dx * 0.32;
  if (index === maxIndex && dx < 0) return dx * 0.32;
  return dx;
}

export function translateToCenterStep(
  scrollWidth: number,
  stepOffsetLeft: number,
  stepWidth: number,
) {
  const center = scrollWidth / 2;
  const stepCenter = stepOffsetLeft + stepWidth / 2;
  return center - stepCenter;
}

export function findCenteredStepIndex(
  scrollEl: HTMLElement,
  steps: readonly (HTMLElement | null)[],
) {
  const centerX =
    scrollEl.getBoundingClientRect().left + scrollEl.clientWidth / 2;

  let closest = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  steps.forEach((step, index) => {
    if (!step) return;
    const rect = step.getBoundingClientRect();
    const stepCenter = rect.left + rect.width / 2;
    const distance = Math.abs(stepCenter - centerX);
    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  return closest;
}

/** Nav wheel: finger travel multiplier (higher = less drag needed). */
export const NAV_WHEEL_DRAG_GAIN = 2.45;

/** Extra impulse on fast flicks (translate space). */
export const NAV_WHEEL_FLING_BOOST = 1.35;

/** Stop momentum below this translate velocity (px/ms). */
export const NAV_WHEEL_VELOCITY_STOP = 0.035;

/** Exponential decay per ms for fling velocity. */
export const NAV_WHEEL_FRICTION = 0.0032;

export type TouchSample = { x: number; t: number };

export function computeTouchVelocity(samples: readonly TouchSample[]) {
  if (samples.length < 2) return 0;

  const first = samples[0];
  const last = samples[samples.length - 1];
  const dt = last.t - first.t;
  if (dt < 8) return 0;

  return (last.x - first.x) / dt;
}

export function applyWheelFriction(velocity: number, dtMs: number) {
  return velocity * Math.exp(-NAV_WHEEL_FRICTION * dtMs);
}

export function clampWheelTranslate(
  translate: number,
  minTranslate: number,
  maxTranslate: number,
) {
  if (translate > maxTranslate) {
    return maxTranslate + (translate - maxTranslate) * 0.28;
  }
  if (translate < minTranslate) {
    return minTranslate + (translate - minTranslate) * 0.28;
  }
  return translate;
}
