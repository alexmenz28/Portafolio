"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LabChrome } from "@/components/LabChrome";

type Verdict = "recommended" | "optional" | "avoid";

function VerdictBadge({ kind, label }: { kind: Verdict; label: string }) {
  const styles =
    kind === "recommended"
      ? "border-primary/40 bg-accent text-primary"
      : kind === "optional"
        ? "border-secondary/30 bg-card text-secondary"
        : "border-foreground/20 text-foreground/55";

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${styles}`}
    >
      {label}
    </span>
  );
}

function MotionCard({
  title,
  verdict,
  verdictLabel,
  note,
  onReplay,
  children,
}: {
  title: string;
  verdict: Verdict;
  verdictLabel: string;
  note: string;
  onReplay: () => void;
  children: React.ReactNode;
}) {
  const t = useTranslations("MotionLab");

  return (
    <div className="border border-secondary/20 bg-card/60 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <VerdictBadge kind={verdict} label={verdictLabel} />
      </div>
      <div className="mb-3 min-h-[88px] rounded-md border border-secondary/15 bg-background/50 p-4">
        {children}
      </div>
      <p className="mb-3 text-xs text-foreground/65">{note}</p>
      <button
        type="button"
        onClick={onReplay}
        className="rounded-md border border-secondary px-3 py-1.5 text-xs font-semibold text-secondary transition hover:bg-secondary hover:text-background"
      >
        {t("replay")}
      </button>
    </div>
  );
}

function useReplay() {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);
  return { key, replay };
}

function ScrollRevealDemo({ replayKey }: { replayKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [replayKey]);

  return (
    <div ref={ref} className="flex h-full items-center justify-center">
      <div
        key={replayKey}
        className={`rounded-md border border-secondary/30 bg-accent px-4 py-3 text-sm text-primary transition-all duration-700 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
      >
        Scroll reveal
      </div>
    </div>
  );
}

export function MotionLab() {
  const t = useTranslations("MotionLab");
  const rec = t("recommended");
  const opt = t("optional");
  const avoid = t("avoid");

  const fadeUp = useReplay();
  const stagger = useReplay();
  const fadeIn = useReplay();
  const slideLeft = useReplay();
  const slideUp = useReplay();
  const scroll = useReplay();
  const hoverCard = useReplay();
  const underline = useReplay();
  const bounce = useReplay();
  const pulse = useReplay();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-20">
      <LabChrome />
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/" className="font-medium text-secondary hover:text-primary">
          ← {t("back")}
        </Link>
        <Link href="/ui" className="font-medium text-secondary hover:text-primary">
          {t("uiLab")}
        </Link>
      </div>

      <header className="mt-6 max-w-2xl">
        <p className="text-sm font-medium tracking-[0.14em] text-secondary uppercase">
          Glacial · internal
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-foreground/80">{t("subtitle")}</p>
      </header>

      <p className="mt-6 max-w-2xl rounded-md border border-primary/30 bg-accent px-4 py-3 text-sm text-primary">
        {t("intent")}
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-foreground">{t("sections.entry")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MotionCard
            title={t("items.fadeUp.title")}
            verdict="recommended"
            verdictLabel={rec}
            note={t("items.fadeUp.note")}
            onReplay={fadeUp.replay}
          >
            <div key={fadeUp.key} className="animate-fade-up text-sm font-medium">
              Fade up — hero headline
            </div>
          </MotionCard>

          <MotionCard
            title={t("items.stagger.title")}
            verdict="recommended"
            verdictLabel={rec}
            note={t("items.stagger.note")}
            onReplay={stagger.replay}
          >
            <div key={stagger.key} className="space-y-2">
              <p className="animate-fade-up text-xs text-secondary uppercase">
                Role line
              </p>
              <p className="animate-fade-up-delay text-sm font-semibold">Your name</p>
              <p className="animate-fade-up-delay-2 text-sm text-foreground/75">
                Tagline copy
              </p>
            </div>
          </MotionCard>

          <MotionCard
            title={t("items.fadeIn.title")}
            verdict="optional"
            verdictLabel={opt}
            note={t("items.fadeIn.note")}
            onReplay={fadeIn.replay}
          >
            <div key={fadeIn.key} className="motion-fade-in text-sm">
              Opacity only — very subtle
            </div>
          </MotionCard>

          <MotionCard
            title={t("items.slideLeft.title")}
            verdict="optional"
            verdictLabel={opt}
            note={t("items.slideLeft.note")}
            onReplay={slideLeft.replay}
          >
            <div key={slideLeft.key} className="motion-slide-left text-sm">
              Slide from left — section titles
            </div>
          </MotionCard>

          <MotionCard
            title={t("items.slideUpSoft.title")}
            verdict="optional"
            verdictLabel={opt}
            note={t("items.slideUpSoft.note")}
            onReplay={slideUp.replay}
          >
            <div key={slideUp.key} className="motion-slide-up-soft text-sm">
              Softer vertical entry
            </div>
          </MotionCard>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-foreground">{t("sections.hover")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MotionCard
            title={t("items.cardHover.title")}
            verdict="recommended"
            verdictLabel={rec}
            note={t("items.cardHover.note")}
            onReplay={hoverCard.replay}
          >
            <article
              key={hoverCard.key}
              className="group border border-secondary/25 bg-card p-4 transition duration-300 hover:border-secondary/60"
            >
              <div className="mb-3 h-1 w-8 bg-primary transition-all duration-300 group-hover:w-14" />
              <p className="text-sm">Hover the card</p>
            </article>
          </MotionCard>

          <MotionCard
            title={t("items.linkUnderline.title")}
            verdict="recommended"
            verdictLabel={rec}
            note={t("items.linkUnderline.note")}
            onReplay={underline.replay}
          >
            <a
              key={underline.key}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="motion-link-underline text-sm font-medium text-secondary"
            >
              Hover for underline grow
            </a>
          </MotionCard>

          <MotionCard
            title={t("items.buttonHover.title")}
            verdict="recommended"
            verdictLabel={rec}
            note={t("items.buttonHover.note")}
            onReplay={() => {}}
          >
            <button
              type="button"
              className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-background transition duration-300 hover:bg-primary"
            >
              CTA hover color
            </button>
          </MotionCard>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-foreground">{t("sections.scroll")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MotionCard
            title={t("items.scrollReveal.title")}
            verdict="recommended"
            verdictLabel={rec}
            note={t("items.scrollReveal.note")}
            onReplay={scroll.replay}
          >
            <ScrollRevealDemo replayKey={scroll.key} />
          </MotionCard>

          <MotionCard
            title={t("items.smoothScroll.title")}
            verdict="optional"
            verdictLabel={opt}
            note={t("items.smoothScroll.note")}
            onReplay={() => {}}
          >
            <a href="#contact" className="text-sm text-secondary hover:text-primary">
              Anchor link (html scroll-behavior: smooth)
            </a>
          </MotionCard>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-foreground">{t("sections.avoid")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MotionCard
            title={t("items.bounce.title")}
            verdict="avoid"
            verdictLabel={avoid}
            note={t("items.bounce.note")}
            onReplay={bounce.replay}
          >
            <div key={bounce.key} className="motion-bounce-in text-sm">
              Bounce entrance
            </div>
          </MotionCard>

          <MotionCard
            title={t("items.pulse.title")}
            verdict="avoid"
            verdictLabel={avoid}
            note={t("items.pulse.note")}
            onReplay={pulse.replay}
          >
            <div key={pulse.key} className="motion-pulse-soft text-sm">
              Infinite pulse
            </div>
          </MotionCard>
        </div>
      </section>

      <section className="mt-14 border-t border-secondary/20 pt-10">
        <h2 className="font-display text-2xl text-foreground">{t("pickTitle")}</h2>
        <ul className="mt-4 space-y-2 text-sm text-foreground/85">
          <li>• {t("pick.hero")}</li>
          <li>• {t("pick.cards")}</li>
          <li>• {t("pick.sections")}</li>
          <li>• {t("pick.skip")}</li>
        </ul>
      </section>
    </div>
  );
}
