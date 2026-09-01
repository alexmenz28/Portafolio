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

/** Map touch X on the nav bar to a section index (0 … maxIndex). */
export function resolveWheelIndexFromPointer(
  pointerX: number,
  navLeft: number,
  navWidth: number,
  maxIndex: number,
) {
  if (navWidth <= 0 || maxIndex <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, (pointerX - navLeft) / navWidth));
  return Math.round(ratio * maxIndex);
}
