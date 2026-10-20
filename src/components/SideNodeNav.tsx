"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import { usePageNavigation } from "@/contexts/PageNavigationContext";
import { PAGE_SECTIONS, type PageSectionId } from "@/data/sections";

type Phase = "idle" | "expanded" | "closing";
type Dock = "bottom" | "left" | "right" | "top";
/**
 * Physics mode:
 * - rest: fan homes
 * - hubDrag: slack leash + repel
 * - dockTravel: ease toward new homes while shell slides (no teleport)
 */
type OrbitMode = "rest" | "hubDrag" | "dockTravel";
type Point = { x: number; y: number };

const LABEL_FADE_MS = 50;
const CONTRACT_MS = 480;
/** Even snappier collapse on touch — feels instant without a hard cut. */
const CONTRACT_MS_COMPACT = 320;
const LEAVE_CLOSE_MS = 90;
const DRAG_CLICK_SLOP = 8;
/** Looser tap slop on touch — fingers always jitter a few px. */
const TAP_CLICK_SLOP = 28;
const REPEL_MIN = 72;
const HUB_ID: PageSectionId = "hero";
const DOCK_KEY = "portfolio-orbit-dock";
/** Drag this far from rest (px) to arm a dock — no need to reach the screen edge. */
const DOCK_ARM_PX = 96;
/** How quickly satellites chase targets (0–1 per frame @60fps). */
const FOLLOW = 0.18;
const FOLLOW_COMPACT = 0.28;
/** Snappier once a sat's leash is taut. */
const LEASH_FOLLOW = 0.22;
/** Creamy ease into the new fan while the shell slides. */
const FAN_SETTLE = 0.12;
const SETTLE = 0.22;
/** Faster ease when collapsing deployed nodes into the hub. */
const CONTRACT = 0.34;
const CONTRACT_COMPACT = 0.48;
/** Fallback if `transitionend` on `.orbit-anchor` does not fire. */
const DOCK_SETTLE_MS = 750;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useCompactLayout() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return compact;
}

function readDock(): Dock {
  try {
    const value = sessionStorage.getItem(DOCK_KEY);
    if (
      value === "bottom" ||
      value === "left" ||
      value === "right" ||
      value === "top"
    ) {
      return value;
    }
  } catch {
    /* private mode */
  }
  return "bottom";
}

function writeDock(dock: Dock) {
  try {
    sessionStorage.setItem(DOCK_KEY, dock);
  } catch {
    /* private mode */
  }
}

function satelliteSlots(count: number, radius: number, dock: Dock): Point[] {
  if (count <= 0) return [];

  let start = Math.PI * 0.92;
  let end = Math.PI * 0.08;
  if (dock === "top") {
    start = Math.PI * 1.08;
    end = Math.PI * 1.92;
  } else if (dock === "left") {
    start = -Math.PI * 0.42;
    end = Math.PI * 0.42;
  } else if (dock === "right") {
    start = Math.PI * 0.58;
    end = Math.PI * 1.42;
  }

  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const angle = start + (end - start) * t;
    const r = radius * (0.92 + (index % 2) * 0.08);
    return {
      x: Math.cos(angle) * r,
      y: -Math.sin(angle) * r,
    };
  });
}

/** Dock from drag offset relative to the hub rest point (comfortable short gesture). */
function dockFromOffset(offset: Point, current: Dock): Dock | null {
  const ax = Math.abs(offset.x);
  const ay = Math.abs(offset.y);
  if (ax < DOCK_ARM_PX && ay < DOCK_ARM_PX) return null;

  let next: Dock;
  if (ax >= ay * 1.05) {
    next = offset.x > 0 ? "right" : "left";
  } else {
    next = offset.y < 0 ? "top" : "bottom";
  }

  return next === current ? null : next;
}

/** Always left+top so dock changes can CSS-transition (no left↔right teleport). */
function dockPointStyle(dock: Dock): CSSProperties {
  switch (dock) {
    case "top":
      return {
        "--orbit-dock-x": "50%",
        "--orbit-dock-y": "max(2.5rem, env(safe-area-inset-top, 0px))",
      } as CSSProperties;
    case "left":
      return {
        "--orbit-dock-x": "max(2.5rem, env(safe-area-inset-left, 0px))",
        "--orbit-dock-y": "50%",
      } as CSSProperties;
    case "right":
      return {
        "--orbit-dock-x":
          "calc(100% - max(2.5rem, env(safe-area-inset-right, 0px)))",
        "--orbit-dock-y": "50%",
      } as CSSProperties;
    default:
      return {
        "--orbit-dock-x": "50%",
        "--orbit-dock-y":
          "calc(100% - max(2.5rem, env(safe-area-inset-bottom, 0px)))",
      } as CSSProperties;
  }
}

function emptyPositions(ids: PageSectionId[]): Record<PageSectionId, Point> {
  const map = {} as Record<PageSectionId, Point>;
  for (const id of ids) map[id] = { x: 0, y: 0 };
  return map;
}

function applyRepulsion(
  positions: Record<PageSectionId, Point>,
  pinnedId: PageSectionId | null,
): Record<PageSectionId, Point> {
  const ids = Object.keys(positions) as PageSectionId[];
  const out = {} as Record<PageSectionId, Point>;
  for (const id of ids) out[id] = { ...positions[id] };

  for (let iter = 0; iter < 5; iter++) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        const dx = out[b].x - out[a].x;
        const dy = out[b].y - out[a].y;
        const dist = Math.hypot(dx, dy) || 0.01;
        if (dist >= REPEL_MIN) continue;
        const push = (REPEL_MIN - dist) * 0.65;
        const nx = dx / dist;
        const ny = dy / dist;
        if (a !== pinnedId) {
          out[a] = { x: out[a].x - nx * push, y: out[a].y - ny * push };
        }
        if (b !== pinnedId) {
          out[b] = { x: out[b].x + nx * push, y: out[b].y + ny * push };
        }
      }
    }
  }
  return out;
}

/** Clamp sats that stretched beyond their rest leash length (no compress). */
function clampLeash(
  targets: Record<PageSectionId, Point>,
  hub: Point,
  sats: { id: PageSectionId }[],
  slotList: Point[],
  tautIds: Set<PageSectionId>,
) {
  sats.forEach((section, index) => {
    if (!tautIds.has(section.id)) return;
    const home = slotList[index] ?? { x: 0, y: 0 };
    const restLen = Math.hypot(home.x, home.y) || 1;
    const p = targets[section.id];
    const dx = p.x - hub.x;
    const dy = p.y - hub.y;
    const dist = Math.hypot(dx, dy) || 0.01;
    if (dist <= restLen) return;
    targets[section.id] = {
      x: hub.x + (dx / dist) * restLen,
      y: hub.y + (dy / dist) * restLen,
    };
  });
}

/**
 * Touch hit-test by geometry: labels sit outside the orb box and stack under
 * later siblings, so the DOM target is often the wrong node. Prefer the
 * closest label/orb rect under the finger.
 */
function pickOrbitIdAt(
  clientX: number,
  clientY: number,
  ids: PageSectionId[],
): PageSectionId | null {
  const pad = 10;
  let best: PageSectionId | null = null;
  let bestDist = Infinity;

  for (const id of ids) {
    const root = document.querySelector<HTMLElement>(
      `[data-orbit-id="${id}"]`,
    );
    if (!root) continue;

    const label = root.querySelector<HTMLElement>(".orbit-label");
    const orb = root.querySelector<HTMLElement>(".orbit-orb");
    const parts = [label, orb].filter(Boolean) as HTMLElement[];

    for (const part of parts) {
      const r = part.getBoundingClientRect();
      if (
        clientX < r.left - pad ||
        clientX > r.right + pad ||
        clientY < r.top - pad ||
        clientY > r.bottom + pad
      ) {
        continue;
      }
      const cx = (r.left + r.right) / 2;
      const cy = (r.top + r.bottom) / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);
      // Prefer labels slightly over orbs when both match.
      const score = dist + (part.classList.contains("orbit-label") ? -4 : 0);
      if (score < bestDist) {
        bestDist = score;
        best = id;
      }
    }
  }

  return best;
}

function OrbitNodeButton({
  id,
  label,
  active,
  hub,
  collapsed,
  hot,
  dragging,
  hideLabel,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onMouseEnter,
  onMouseLeave,
}: {
  id: PageSectionId;
  label: string;
  active?: boolean;
  hub?: boolean;
  collapsed?: boolean;
  hot?: boolean;
  dragging?: boolean;
  hideLabel?: boolean;
  style?: CSSProperties;
  onPointerDown?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerCancel?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <button
      type="button"
      data-orbit-id={id}
      className={`orbit-node ${hub ? "orbit-node--hub" : ""} ${collapsed ? "orbit-node--collapsed" : ""} ${active ? "orbit-node--active" : ""} ${hot ? "orbit-node--hot" : ""} ${dragging ? "orbit-node--dragging" : ""} ${hideLabel ? "orbit-node--hide-label" : ""}`}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-current={active ? "true" : undefined}
    >
      <span className="orbit-float">
        <span className="orbit-label">{label}</span>
        <span className="orbit-orb" aria-hidden />
      </span>
    </button>
  );
}

export function SideNodeNav() {
  const t = useTranslations("Nav");
  const compact = useCompactLayout();
  const { activeId, goTo } = usePageNavigation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [spread, setSpread] = useState(false);
  const [displayId, setDisplayId] = useState<PageSectionId>(activeId);
  const [dragId, setDragId] = useState<PageSectionId | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<PageSectionId | null>(null);
  /** Single dock — CSS shell and fan slots always match. */
  const [dock, setDock] = useState<Dock>("bottom");
  const [dockHint, setDockHint] = useState<Dock | null>(null);
  const [labelsHidden, setLabelsHidden] = useState(false);
  const [renderPos, setRenderPos] = useState<Record<PageSectionId, Point>>(
    () => emptyPositions([HUB_ID]),
  );

  const pointerStart = useRef<Point | null>(null);
  const dragDistance = useRef(0);
  const closeTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const dragIdRef = useRef<PageSectionId | null>(null);
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const phaseRef = useRef<Phase>(phase);
  const spreadRef = useRef(spread);
  const dockRef = useRef(dock);
  const pointerInside = useRef(false);
  const skipReopen = useRef(false);
  const displayRef = useRef<Record<PageSectionId, Point>>(
    emptyPositions([HUB_ID]),
  );
  const orbitModeRef = useRef<OrbitMode>("rest");
  const dockTravelTimer = useRef<number | null>(null);
  const compactRef = useRef(compact);
  /** Resolved target for the active compact tap (geometry hit-test). */
  const tapTargetRef = useRef<PageSectionId | null>(null);

  const radius = compact ? 140 : 172;
  const hitPad = 96;
  const hitSize = (radius + hitPad) * 2;
  const satellites = useMemo(
    () => PAGE_SECTIONS.filter((section) => section.id !== HUB_ID),
    [],
  );
  const allIds = useMemo(
    () => [HUB_ID, ...satellites.map((s) => s.id)] as PageSectionId[],
    [satellites],
  );
  const slots = useMemo(
    () => satelliteSlots(satellites.length, radius, dock),
    [satellites.length, radius, dock],
  );
  const slotsRef = useRef(slots);
  const satellitesRef = useRef(satellites);

  const clearDockTravel = useCallback(() => {
    if (dockTravelTimer.current) {
      window.clearTimeout(dockTravelTimer.current);
      dockTravelTimer.current = null;
    }
    orbitModeRef.current = "rest";
  }, []);

  const finishDockTravel = useCallback(() => {
    if (orbitModeRef.current !== "dockTravel") return;
    clearDockTravel();
  }, [clearDockTravel]);

  useEffect(() => {
    setDock(readDock());
  }, []);

  useEffect(() => {
    dragIdRef.current = dragId;
  }, [dragId]);

  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    spreadRef.current = spread;
  }, [spread]);

  useEffect(() => {
    dockRef.current = dock;
  }, [dock]);

  useEffect(() => {
    compactRef.current = compact;
  }, [compact]);

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(() => {
    satellitesRef.current = satellites;
  }, [satellites]);

  useEffect(() => {
    if (phase === "idle") setDisplayId(activeId);
  }, [activeId, phase]);

  useEffect(() => {
    if (phase !== "expanded") return;
    setLabelsHidden(false);
    // Start collapsed at the hub so the fan springs outward.
    for (const id of allIds) {
      displayRef.current[id] = { x: 0, y: 0 };
    }
    setRenderPos(emptyPositions(allIds));
    setSpread(false);
    orbitModeRef.current = "rest";
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setSpread(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [phase, allIds]);

  // Single animation loop: nodes + edges share the same positions always.
  useEffect(() => {
    let raf = 0;
    const reduced = prefersReducedMotion();

    const tick = (now: number) => {
      const sats = satellitesRef.current;
      const slotList = slotsRef.current;
      const spreadOn = spreadRef.current;
      const drag = dragIdRef.current;
      const pull = dragOffsetRef.current;
      const phaseNow = phaseRef.current;
      const mode = orbitModeRef.current;

      const targets = emptyPositions([
        HUB_ID,
        ...sats.map((s) => s.id),
      ]);

      const tautIds = new Set<PageSectionId>();

      if (spreadOn && phaseNow === "expanded") {
        // --- Hub target ---
        if (mode === "hubDrag" && drag === HUB_ID) {
          targets[HUB_ID] = { x: pull.x, y: pull.y };
        } else {
          targets[HUB_ID] = { x: 0, y: 0 };
        }

        const hub = targets[HUB_ID];

        // --- Satellite targets by mode ---
        sats.forEach((section, index) => {
          const home = slotList[index] ?? { x: 0, y: 0 };

          if (drag === section.id) {
            targets[section.id] = {
              x: home.x + pull.x,
              y: home.y + pull.y,
            };
            return;
          }

          if (mode === "hubDrag" && drag === HUB_ID) {
            // Slack leash: hold until hub passes rest length, then follow.
            const restLen = Math.hypot(home.x, home.y) || 1;
            const cur = displayRef.current[section.id] ?? home;
            const dx = cur.x - hub.x;
            const dy = cur.y - hub.y;
            const dist = Math.hypot(dx, dy) || 0.01;
            if (dist > restLen + 1) {
              tautIds.add(section.id);
              targets[section.id] = {
                x: hub.x + (dx / dist) * restLen,
                y: hub.y + (dy / dist) * restLen,
              };
            } else {
              targets[section.id] = { x: cur.x, y: cur.y };
            }
            return;
          }

          // rest + dockTravel: ease toward homes of the current dock.
          // dockTravel starts as soon as setDock runs (CSS+slots match),
          // so this lerps during the shell slide — no freeze then cut.
          targets[section.id] = { x: home.x, y: home.y };
        });

        // Repulsion while dragging or settling into a new fan.
        if (mode === "hubDrag" || mode === "dockTravel" || (drag && drag !== HUB_ID)) {
          const pin =
            drag && drag !== HUB_ID
              ? drag
              : mode === "hubDrag" || mode === "dockTravel"
                ? HUB_ID
                : drag;
          const repelled = applyRepulsion(targets, pin);
          for (const id of Object.keys(repelled) as PageSectionId[]) {
            if (id === pin) continue;
            targets[id] = repelled[id];
          }

          if (mode === "hubDrag" && drag === HUB_ID) {
            clampLeash(targets, hub, sats, slotList, tautIds);
          }
        }
      }

      let dirty = false;
      const next = { ...displayRef.current };
      const contracting = phaseNow === "closing" || !spreadOn;
      const snappy = compactRef.current;
      const followRate = snappy ? FOLLOW_COMPACT : FOLLOW;
      const contractRate = snappy ? CONTRACT_COMPACT : CONTRACT;

      sats.forEach((section, index) => {
        const id = section.id;
        if (!next[id]) next[id] = { x: 0, y: 0 };
        const target = targets[id] ?? { x: 0, y: 0 };
        const cur = next[id];
        const snap = reduced || id === drag;
        const rate = snap
          ? 1
          : contracting
            ? contractRate + index * 0.02
            : mode === "hubDrag" && tautIds.has(id)
              ? LEASH_FOLLOW
              : mode === "dockTravel"
                ? FAN_SETTLE + index * 0.01
                : followRate;
        const x = cur.x + (target.x - cur.x) * rate;
        const y = cur.y + (target.y - cur.y) * rate;
        if (Math.abs(x - cur.x) > 0.05 || Math.abs(y - cur.y) > 0.05) {
          dirty = true;
        }
        next[id] = {
          x: Math.abs(target.x - x) < 0.05 ? target.x : x,
          y: Math.abs(target.y - y) < 0.05 ? target.y : y,
        };
      });

      {
        const id = HUB_ID;
        if (!next[id]) next[id] = { x: 0, y: 0 };
        const target = targets[id] ?? { x: 0, y: 0 };
        const cur = next[id];
        const snap = reduced || id === drag;
        const rate = snap ? 1 : contracting ? contractRate : SETTLE;
        const x = cur.x + (target.x - cur.x) * rate;
        const y = cur.y + (target.y - cur.y) * rate;
        if (Math.abs(x - cur.x) > 0.05 || Math.abs(y - cur.y) > 0.05) {
          dirty = true;
        }
        next[id] = {
          x: Math.abs(target.x - x) < 0.05 ? target.x : x,
          y: Math.abs(target.y - y) < 0.05 ? target.y : y,
        };
      }

      // Soft float on every node except the one being dragged.
      const live = { ...next };
      if (!reduced && phaseNow === "expanded" && spreadOn) {
        const tSec = now / 1000;
        sats.forEach((section, index) => {
          if (section.id === drag) return;
          const base = next[section.id];
          live[section.id] = {
            x: base.x + Math.sin(tSec * 1.15 + index * 1.7) * 1.6,
            y: base.y + Math.cos(tSec * 0.95 + index * 1.3) * 2.4,
          };
        });
        if (drag !== HUB_ID && mode !== "hubDrag") {
          const hubPos = next[HUB_ID];
          live[HUB_ID] = {
            x: hubPos.x + Math.sin(tSec * 0.8) * 0.8,
            y: hubPos.y + Math.cos(tSec * 0.7) * 1.1,
          };
        }
        dirty = true;
      }

      displayRef.current = next;
      if (dirty || phaseNow !== "idle") {
        setRenderPos(live);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
      if (dockTravelTimer.current) window.clearTimeout(dockTravelTimer.current);
    };
  }, []);

  const clearCloseTimers = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    closeTimer.current = null;
    leaveTimer.current = null;
  }, []);

  const openGraph = useCallback(() => {
    clearCloseTimers();
    // Hover-intent only on desktop; mobile stays tap + backdrop.
    if (!compactRef.current) pointerInside.current = true;
    if (phaseRef.current === "closing") {
      setLabelsHidden(false);
      setSpread(true);
      setPhase("expanded");
      return;
    }
    if (phaseRef.current === "idle") {
      setPhase("expanded");
    }
  }, [clearCloseTimers]);

  const runCloseSequence = useCallback(
    (opts?: { fromSelect?: boolean }) => {
      if (phaseRef.current !== "expanded") return;

      clearCloseTimers();
      clearDockTravel();
      setHoveredId(null);
      setDragId(null);
      dragIdRef.current = null;
      setDragOffset({ x: 0, y: 0 });
      dragOffsetRef.current = { x: 0, y: 0 };
      setDockHint(null);
      if (opts?.fromSelect) {
        pointerInside.current = false;
        skipReopen.current = true;
      }

      if (prefersReducedMotion()) {
        setSpread(false);
        setLabelsHidden(false);
        setPhase("idle");
        return;
      }

      setPhase("closing");
      setLabelsHidden(true);
      setSpread(false);
      spreadRef.current = false;

      const contractMs = compactRef.current
        ? CONTRACT_MS_COMPACT
        : CONTRACT_MS;
      closeTimer.current = window.setTimeout(() => {
        setPhase("idle");
        setLabelsHidden(false);
      }, LABEL_FADE_MS + contractMs);
    },
    [clearCloseTimers, clearDockTravel],
  );

  useEffect(() => {
    if (phase !== "expanded") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        pointerInside.current = false;
        skipReopen.current = true;
        dragIdRef.current = null;
        runCloseSequence();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, runCloseSequence]);

  const selectAndContract = useCallback(
    (id: PageSectionId) => {
      if (phaseRef.current === "closing") return;

      dragIdRef.current = null;
      setDragId(null);
      setDragOffset({ x: 0, y: 0 });
      dragOffsetRef.current = { x: 0, y: 0 };
      setHoveredId(null);
      setDockHint(null);
      setDisplayId(id);
      goTo(id);
      runCloseSequence({ fromSelect: true });
    },
    [goTo, runCloseSequence],
  );

  useEffect(() => {
    if (phase !== "idle") return;
    if (skipReopen.current) {
      skipReopen.current = false;
      return;
    }
    if (pointerInside.current) openGraph();
  }, [phase, openGraph]);

  const beginDockTravel = useCallback(
    (nextDock: Dock) => {
      // No rebase/teleport — keep current local positions and let the rAF
      // ease hub→0 and sats→new homes while the shell CSS-transitions.
      orbitModeRef.current = "dockTravel";
      setDock(nextDock);
      writeDock(nextDock);

      if (dockTravelTimer.current) window.clearTimeout(dockTravelTimer.current);
      dockTravelTimer.current = window.setTimeout(() => {
        finishDockTravel();
      }, DOCK_SETTLE_MS);
    },
    [finishDockTravel],
  );

  const onAnchorTransitionEnd = (
    event: ReactTransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "left" && event.propertyName !== "top") return;
    if (orbitModeRef.current !== "dockTravel") return;
    finishDockTravel();
  };

  const onPointerDownNode = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: PageSectionId,
  ) => {
    if (phase === "idle") {
      // Open only — the same touch's pointerup must not count as a select
      // (phase may already be "expanded" by then on mobile).
      openGraph();
      pointerStart.current = null;
      dragDistance.current = 0;
      tapTargetRef.current = null;
      return;
    }
    if (phase !== "expanded") return;
    if (orbitModeRef.current === "dockTravel") return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragDistance.current = 0;
    setDockHint(null);

    // Mobile / compact: tap only — resolve by label/orb geometry so a tap
    // on "Educación" is not stolen by a sibling orb stacked on top.
    if (compactRef.current) {
      const picked =
        pickOrbitIdAt(event.clientX, event.clientY, allIds) ?? id;
      tapTargetRef.current = picked;
      dragIdRef.current = picked;
      setDragId(picked);
      return;
    }

    tapTargetRef.current = null;
    dragIdRef.current = id;
    setDragId(id);
    setDragOffset({ x: 0, y: 0 });
    dragOffsetRef.current = { x: 0, y: 0 };
    if (id === HUB_ID) {
      orbitModeRef.current = "hubDrag";
    }
  };

  const onPointerMoveNode = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerStart.current) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    dragDistance.current = Math.hypot(dx, dy);

    // Compact: track slop only (ignore drag offsets / dock hints).
    if (compactRef.current) return;
    if (!dragId) return;

    const next = { x: dx, y: dy };
    dragOffsetRef.current = next;
    setDragOffset(next);
    if (dragId === HUB_ID) {
      setDockHint(dockFromOffset(next, dock));
    }
  };

  const onPointerUpNode = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: PageSectionId,
  ) => {
    if (phase === "idle") return;
    if (phase !== "expanded") return;

    // No expanded-phase pointerdown on this gesture (e.g. the tap that
    // just opened the graph) — ignore, or we instantly select+close.
    const hadGesture = pointerStart.current !== null;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }

    const tapOnly = compactRef.current;
    const slop = tapOnly ? TAP_CLICK_SLOP : DRAG_CLICK_SLOP;
    const moved = dragDistance.current > slop;
    const offset = { ...dragOffsetRef.current };
    const hint = id === HUB_ID ? dockFromOffset(offset, dock) : null;
    const tapTarget = tapTargetRef.current;
    pointerStart.current = null;
    dragDistance.current = 0;
    dragIdRef.current = null;
    tapTargetRef.current = null;
    setDragId(null);
    setDragOffset({ x: 0, y: 0 });
    dragOffsetRef.current = { x: 0, y: 0 };
    setDockHint(null);

    if (!hadGesture) return;

    if (tapOnly) {
      orbitModeRef.current = "rest";
      if (moved) return;
      // Re-pick at lift in case the finger settled on a neighbor label.
      const picked =
        pickOrbitIdAt(event.clientX, event.clientY, allIds) ??
        tapTarget ??
        id;
      selectAndContract(picked);
      return;
    }

    if (!moved) {
      orbitModeRef.current = "rest";
      selectAndContract(id);
      return;
    }

    if (id === HUB_ID && hint) {
      beginDockTravel(hint);
      return;
    }

    orbitModeRef.current = "rest";
  };

  const graphOpen = phase === "expanded" || phase === "closing";
  const dragging = Boolean(dragId);

  const collapsedLabel = t(
    PAGE_SECTIONS.find((section) => section.id === displayId)?.navKey ?? "hero",
  );
  // Only while fully open show "Inicio"; during close keep the section title
  // on the hub so it never fades out and pops back in.
  const hubLabel = phase === "expanded" ? t("hero") : collapsedLabel;
  const edgePad = 64;
  const hubPos = renderPos[HUB_ID] ?? { x: 0, y: 0 };

  useEffect(() => {
    displayRef.current = {
      ...emptyPositions(allIds),
      ...displayRef.current,
    };
  }, [allIds]);

  const onZoneEnter = () => {
    if (compactRef.current) return;
    pointerInside.current = true;
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    openGraph();
  };

  const onZoneLeave = () => {
    if (compactRef.current) return;
    pointerInside.current = false;
    if (dragIdRef.current) return;
    if (orbitModeRef.current === "dockTravel") return;
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      if (pointerInside.current || dragIdRef.current) return;
      if (orbitModeRef.current === "dockTravel") return;
      runCloseSequence();
    }, LEAVE_CLOSE_MS);
  };

  const pointStyle = dockPointStyle(dock);

  return (
    <>
      {graphOpen ? (
        <button
          type="button"
          className={`orbit-backdrop ${phase === "closing" ? "orbit-backdrop--out" : ""}`}
          style={pointStyle}
          aria-label={t("collapse")}
          onClick={() => {
            pointerInside.current = false;
            skipReopen.current = true;
            dragIdRef.current = null;
            runCloseSequence();
          }}
        />
      ) : null}

      {!compact && dragId === HUB_ID ? (
        <div className="orbit-dock-guides" aria-hidden>
          {(["left", "right", "top", "bottom"] as const).map((side) =>
            side === dock ? null : (
              <span
                key={side}
                className={`orbit-dock-guide orbit-dock-guide--${side} ${dockHint === side ? "orbit-dock-guide--hot" : ""}`}
              />
            ),
          )}
        </div>
      ) : null}

      <nav
        aria-label={t("timeline")}
        className={`orbit-nav orbit-nav--dock-${dock} ${graphOpen ? "orbit-nav--expanded" : ""} ${phase === "closing" ? "orbit-nav--closing" : ""} ${dragging ? "orbit-nav--dragging" : ""} ${compact ? "orbit-nav--compact" : ""}`}
        style={pointStyle}
      >
        <div className="orbit-anchor" onTransitionEnd={onAnchorTransitionEnd}>
          <div
            className="orbit-origin"
            onPointerEnter={
              !compact && graphOpen ? onZoneEnter : undefined
            }
            onPointerLeave={
              !compact && graphOpen ? onZoneLeave : undefined
            }
          >
            {phase === "idle" ? (
              <div
                className="orbit-hit"
                onPointerEnter={compact ? undefined : onZoneEnter}
                onClick={openGraph}
                aria-hidden
              />
            ) : null}

            {graphOpen ? (
              <div
                className="orbit-bloom-hit"
                style={{ width: hitSize, height: hitSize }}
                aria-hidden
              />
            ) : null}

            <svg
              className="orbit-edges"
              width={(radius + edgePad) * 2}
              height={(radius + edgePad) * 2}
              viewBox={`${-(radius + edgePad)} ${-(radius + edgePad)} ${(radius + edgePad) * 2} ${(radius + edgePad) * 2}`}
              style={{
                left: -(radius + edgePad),
                top: -(radius + edgePad),
              }}
              aria-hidden
            >
              {graphOpen
                ? satellites.map((section) => {
                    const tip = renderPos[section.id] ?? { x: 0, y: 0 };
                    const toActive = activeId === section.id;
                    return (
                      <line
                        key={section.id}
                        className={`orbit-edge ${toActive ? "orbit-edge--active" : ""} ${(spread && !labelsHidden) || phase === "closing" ? "orbit-edge--visible" : ""}`}
                        x1={hubPos.x}
                        y1={hubPos.y}
                        x2={tip.x}
                        y2={tip.y}
                      />
                    );
                  })
                : null}
            </svg>

            <OrbitNodeButton
              id={HUB_ID}
              label={hubLabel}
              hub
              collapsed={phase === "idle"}
              active={phase === "idle" ? true : activeId === HUB_ID}
              hot={hoveredId === HUB_ID || dragId === HUB_ID}
              dragging={!compact && dragId === HUB_ID}
              hideLabel={false}
              style={
                {
                  "--orbit-x": `${hubPos.x}px`,
                  "--orbit-y": `${hubPos.y}px`,
                } as CSSProperties
              }
              onPointerDown={(event) => onPointerDownNode(event, HUB_ID)}
              onPointerMove={onPointerMoveNode}
              onPointerUp={(event) => onPointerUpNode(event, HUB_ID)}
              onPointerCancel={(event) => onPointerUpNode(event, HUB_ID)}
              onMouseEnter={
                compact ? undefined : () => setHoveredId(HUB_ID)
              }
              onMouseLeave={
                compact ? undefined : () => setHoveredId(null)
              }
            />

            {graphOpen
              ? satellites.map((section) => {
                  const pos = renderPos[section.id] ?? { x: 0, y: 0 };
                  return (
                    <OrbitNodeButton
                      key={section.id}
                      id={section.id}
                      label={t(section.navKey)}
                      active={activeId === section.id}
                      hot={
                        hoveredId === section.id || dragId === section.id
                      }
                      dragging={!compact && dragId === section.id}
                      hideLabel={labelsHidden}
                      style={
                        {
                          "--orbit-x": `${pos.x}px`,
                          "--orbit-y": `${pos.y}px`,
                          // Outer nodes paint above so their labels aren't
                          // buried under a sibling orb box on touch.
                          zIndex: 2 + Math.round(Math.hypot(pos.x, pos.y) / 24),
                        } as CSSProperties
                      }
                      onPointerDown={(event) =>
                        onPointerDownNode(event, section.id)
                      }
                      onPointerMove={onPointerMoveNode}
                      onPointerUp={(event) =>
                        onPointerUpNode(event, section.id)
                      }
                      onPointerCancel={(event) =>
                        onPointerUpNode(event, section.id)
                      }
                      onMouseEnter={
                        compact
                          ? undefined
                          : () => setHoveredId(section.id)
                      }
                      onMouseLeave={
                        compact ? undefined : () => setHoveredId(null)
                      }
                    />
                  );
                })
              : null}
          </div>
        </div>
      </nav>
    </>
  );
}
