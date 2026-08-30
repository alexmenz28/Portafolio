"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LabChrome } from "@/components/LabChrome";

type Verdict = "recommended" | "optional" | "avoid";

function Verdict({ kind, label }: { kind: Verdict; label: string }) {
  const styles =
    kind === "recommended"
      ? "border-primary/40 bg-accent text-primary"
      : kind === "optional"
        ? "border-secondary/30 bg-card text-secondary"
        : "border-foreground/20 bg-transparent text-foreground/55";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${styles}`}
    >
      {label}
    </span>
  );
}

function Variant({
  title,
  verdict,
  verdictLabel,
  note,
  children,
}: {
  title: string;
  verdict: Verdict;
  verdictLabel: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-secondary/20 bg-card/60 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Verdict kind={verdict} label={verdictLabel} />
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-3">{children}</div>
      <p className="text-xs text-foreground/65">{note}</p>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-secondary/20 pt-10">
      <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
}

const TOC_IDS = [
  "intent",
  "buttons",
  "links",
  "cards",
  "tags",
  "tables",
  "forms",
  "nav",
  "headings",
  "lists",
  "feedback",
  "motion",
] as const;

export function UiLab() {
  const t = useTranslations("UiLab");
  const rec = t("recommended");
  const opt = t("optional");
  const avoid = t("avoid");

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-20">
      <LabChrome />
      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/"
          className="font-medium text-secondary transition hover:text-primary"
        >
          ← {t("back")}
        </Link>
        <Link
          href="/motion"
          className="font-medium text-secondary transition hover:text-primary"
        >
          {t("motionLab")}
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

      <nav
        aria-label={t("toc")}
        className="mt-8 flex flex-wrap gap-2 border border-secondary/20 bg-card/50 p-3"
      >
        {TOC_IDS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-secondary transition hover:bg-accent hover:text-primary"
          >
            {t(`sections.${id}`)}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-14">
        <Section id="intent" title={t("sections.intent")}>
          <p className="max-w-2xl text-foreground/80">{t("intentBody")}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-primary/30 bg-accent p-4">
              <Verdict kind="recommended" label={rec} />
              <p className="mt-2 text-sm">Borders, hierarchy, calm CTAs, 2–3 motions</p>
            </div>
            <div className="border border-secondary/30 bg-card p-4">
              <Verdict kind="optional" label={opt} />
              <p className="mt-2 text-sm">Soft fills, compact tables, subtle underlines</p>
            </div>
            <div className="border border-foreground/15 p-4">
              <Verdict kind="avoid" label={avoid} />
              <p className="mt-2 text-sm">Pill clusters, heavy shadows, neon glow, emoji chrome</p>
            </div>
          </div>
        </Section>

        <Section id="buttons" title={t("sections.buttons")}>
          <Variant
            title="Solid secondary"
            verdict="recommended"
            verdictLabel={rec}
            note="Primary CTA. Matches current hero “View projects”."
          >
            <button
              type="button"
              className="rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-background transition duration-300 hover:bg-primary"
            >
              View projects
            </button>
          </Variant>

          <Variant
            title="Outline"
            verdict="recommended"
            verdictLabel={rec}
            note="Secondary CTA. Clear without competing with solid."
          >
            <button
              type="button"
              className="rounded-md border border-secondary px-5 py-2.5 text-sm font-semibold text-secondary transition duration-300 hover:bg-secondary hover:text-background"
            >
              Get in touch
            </button>
          </Variant>

          <Variant
            title="Soft / accent fill"
            verdict="optional"
            verdictLabel={opt}
            note="Good for tertiary actions or filters."
          >
            <button
              type="button"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition duration-300 hover:bg-secondary hover:text-background"
            >
              Soft action
            </button>
          </Variant>

          <Variant
            title="Ghost"
            verdict="optional"
            verdictLabel={opt}
            note="Toolbar / theme toggle adjacent actions."
          >
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold text-secondary transition duration-300 hover:bg-accent hover:text-primary"
            >
              Ghost
            </button>
          </Variant>

          <Variant
            title="Pill (fully rounded)"
            verdict="avoid"
            verdictLabel={avoid}
            note="Reads trendy/generic; clashes with the minimal brief."
          >
            <button
              type="button"
              className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-background"
            >
              Pill button
            </button>
          </Variant>

          <Variant
            title="Sizes"
            verdict="recommended"
            verdictLabel={rec}
            note="Use sm for chrome, md for CTAs, lg sparingly in hero."
          >
            <button
              type="button"
              className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-background"
            >
              Small
            </button>
            <button
              type="button"
              className="rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-background"
            >
              Medium
            </button>
            <button
              type="button"
              className="rounded-md bg-secondary px-6 py-3 text-base font-semibold text-background"
            >
              Large
            </button>
          </Variant>
        </Section>

        <Section id="links" title={t("sections.links")}>
          <Variant
            title="Text link"
            verdict="recommended"
            verdictLabel={rec}
            note="Nav, inline references, footer."
          >
            <a href="#buttons" className="text-sm font-medium text-secondary transition hover:text-primary">
              Jump to buttons
            </a>
          </Variant>

          <Variant
            title="Underline on hover"
            verdict="optional"
            verdictLabel={opt}
            note="Slightly more editorial; good for long copy."
          >
            <a
              href="#cards"
              className="text-sm text-foreground underline-offset-4 transition hover:text-primary hover:underline"
            >
              Read case study
            </a>
          </Variant>

          <Variant
            title="Icon + label"
            verdict="recommended"
            verdictLabel={rec}
            note="Contact row / social without icon-only ambiguity."
          >
            <a
              href="mailto:alexander.mendoza.cholima2248@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-primary"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
              Email
            </a>
          </Variant>
        </Section>

        <Section id="cards" title={t("sections.cards")}>
          <div className="grid gap-4 md:grid-cols-2">
            <Variant
              title="Border + accent bar"
              verdict="recommended"
              verdictLabel={rec}
              note="Current project cards. Interaction = hover border + bar growth."
            >
              <article className="group w-full border border-secondary/25 bg-card p-5 transition duration-300 hover:border-secondary/60">
                <div className="mb-4 h-1.5 w-10 bg-primary transition-all duration-300 group-hover:w-16" />
                <h4 className="font-display text-lg">Project title</h4>
                <p className="mt-2 text-sm text-foreground/75">
                  Short outcome-focused description.
                </p>
                <p className="mt-3 text-xs tracking-wide text-secondary uppercase">
                  Next.js · TypeScript
                </p>
              </article>
            </Variant>

            <Variant
              title="Soft surface (no border)"
              verdict="optional"
              verdictLabel={opt}
              note="Works on light theme; weaker on dark without a border."
            >
              <article className="w-full bg-accent p-5">
                <h4 className="font-display text-lg">Soft card</h4>
                <p className="mt-2 text-sm text-foreground/75">Accent fill only.</p>
              </article>
            </Variant>

            <Variant
              title="Left rule only"
              verdict="recommended"
              verdictLabel={rec}
              note="Great for skills groups (already used)."
            >
              <div className="w-full border-l-2 border-secondary/50 pl-4">
                <h4 className="text-sm font-semibold tracking-wide text-secondary uppercase">
                  .NET
                </h4>
                <p className="mt-2 text-sm">Blazor · SQL Server · DevExpress</p>
              </div>
            </Variant>

            <Variant
              title="Heavy shadow / elevated"
              verdict="avoid"
              verdictLabel={avoid}
              note="Feels like a generic dashboard card."
            >
              <article
                className="w-full border border-secondary/20 bg-card p-5"
                style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}
              >
                <h4 className="font-display text-lg">Elevated card</h4>
                <p className="mt-2 text-sm text-foreground/75">Skip for this brand.</p>
              </article>
            </Variant>
          </div>
        </Section>

        <Section id="tags" title={t("sections.tags")}>
          <Variant
            title="Quiet outline tags"
            verdict="recommended"
            verdictLabel={rec}
            note="Stack labels under a project—few, readable."
          >
            <span className="rounded-md border border-secondary/40 px-2.5 py-1 text-xs text-secondary">
              TypeScript
            </span>
            <span className="rounded-md border border-secondary/40 px-2.5 py-1 text-xs text-secondary">
              Blazor
            </span>
            <span className="rounded-md border border-secondary/40 px-2.5 py-1 text-xs text-secondary">
              SQL Server
            </span>
          </Variant>

          <Variant
            title="Filled accent tags"
            verdict="optional"
            verdictLabel={opt}
            note="Use sparingly for status (Remote, Open to work)."
          >
            <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-primary">
              Remote-ready
            </span>
          </Variant>

          <Variant
            title="Icon chip grid"
            verdict="avoid"
            verdictLabel={avoid}
            note="Icon spam hides signal; prefer grouped text skills."
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-md border border-secondary/30 text-xs">
              TS
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-md border border-secondary/30 text-xs">
              C#
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-md border border-secondary/30 text-xs">
              React
            </span>
          </Variant>
        </Section>

        <Section id="tables" title={t("sections.tables")}>
          <Variant
            title="Hairline comparison table"
            verdict="optional"
            verdictLabel={opt}
            note="Useful for stack matrix or certifications—not required on the landing."
          >
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-secondary/30 text-secondary">
                    <th className="py-2 pr-4 font-medium">Area</th>
                    <th className="py-2 pr-4 font-medium">Focus</th>
                    <th className="py-2 font-medium">Signal</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/85">
                  <tr className="border-b border-secondary/15">
                    <td className="py-2.5 pr-4">.NET</td>
                    <td className="py-2.5 pr-4">Blazor / SQL</td>
                    <td className="py-2.5">Strong</td>
                  </tr>
                  <tr className="border-b border-secondary/15">
                    <td className="py-2.5 pr-4">Web</td>
                    <td className="py-2.5 pr-4">Next / TS</td>
                    <td className="py-2.5">Growing</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4">Ops</td>
                    <td className="py-2.5 pr-4">Git / Docker</td>
                    <td className="py-2.5">Solid</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Variant>

          <Variant
            title="Zebra / boxed densetable"
            verdict="avoid"
            verdictLabel={avoid}
            note="Too “admin panel” for a personal portfolio."
          >
            <div className="w-full overflow-hidden rounded-md border border-secondary/30">
              <table className="w-full text-left text-sm">
                <tbody>
                  <tr className="bg-accent/80">
                    <td className="px-3 py-2">Row A</td>
                    <td className="px-3 py-2">Dense</td>
                  </tr>
                  <tr className="bg-card">
                    <td className="px-3 py-2">Row B</td>
                    <td className="px-3 py-2">Busy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Variant>
        </Section>

        <Section id="forms" title={t("sections.forms")}>
          <Variant
            title="Outlined fields + focus ring"
            verdict="recommended"
            verdictLabel={rec}
            note="If you add contact form later: calm, accessible, Glacial focus."
          >
            <form className="grid w-full max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">Email</span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="rounded-md border border-secondary/40 bg-background px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-secondary/30"
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">Message</span>
                <textarea
                  rows={3}
                  placeholder="Short note…"
                  className="resize-y rounded-md border border-secondary/40 bg-background px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-secondary/30"
                />
              </label>
              <button
                type="submit"
                className="justify-self-start rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-primary"
              >
                Send
              </button>
            </form>
          </Variant>

          <Variant
            title="Underline-only inputs"
            verdict="optional"
            verdictLabel={opt}
            note="More editorial; harder to scan on mobile."
          >
            <input
              type="text"
              placeholder="Name"
              className="w-full max-w-xs border-0 border-b border-secondary/40 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary"
            />
          </Variant>
        </Section>

        <Section id="nav" title={t("sections.nav")}>
          <Variant
            title="Text nav row"
            verdict="recommended"
            verdictLabel={rec}
            note="Sticky header candidate: quiet, professional."
          >
            <nav className="flex flex-wrap gap-5 text-sm font-medium text-secondary">
              <a href="#cards" className="hover:text-primary">
                Projects
              </a>
              <a href="#lists" className="hover:text-primary">
                Experience
              </a>
              <a href="#forms" className="hover:text-primary">
                Contact
              </a>
            </nav>
          </Variant>

          <Variant
            title="Floating control cluster"
            verdict="recommended"
            verdictLabel={rec}
            note="Already live: theme + locale."
          >
            <div className="flex gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-secondary/40 text-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
              </span>
              <span className="flex h-10 items-center rounded-md border border-secondary/40 px-3 text-xs font-semibold text-secondary">
                ES
              </span>
            </div>
          </Variant>

          <Variant
            title="Segmented / pill nav"
            verdict="avoid"
            verdictLabel={avoid}
            note="App-chrome look; overkill for a one-page portfolio."
          >
            <div className="flex rounded-full border border-secondary/30 p-1">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-background">
                Work
              </span>
              <span className="rounded-full px-3 py-1 text-xs text-secondary">About</span>
            </div>
          </Variant>
        </Section>

        <Section id="headings" title={t("sections.headings")}>
          <Variant
            title="Display + supporting line"
            verdict="recommended"
            verdictLabel={rec}
            note="Section pattern already in use."
          >
            <div>
              <h3 className="font-display text-3xl tracking-tight">Featured work</h3>
              <p className="mt-2 max-w-md text-sm text-foreground/75">
                One job per section: title + short support.
              </p>
            </div>
          </Variant>

          <Variant
            title="Eyebrow + display"
            verdict="recommended"
            verdictLabel={rec}
            note="Hero role line uses this."
          >
            <div>
              <p className="text-sm font-medium tracking-[0.14em] text-secondary uppercase">
                Full-Stack · .NET & Web
              </p>
              <h3 className="mt-2 font-display text-3xl">Alexander Mendoza</h3>
            </div>
          </Variant>
        </Section>

        <Section id="lists" title={t("sections.lists")}>
          <Variant
            title="Experience block + bullets"
            verdict="recommended"
            verdictLabel={rec}
            note="Current experience section—clean and scannable."
          >
            <div className="w-full border-t border-secondary/25 pt-4">
              <div className="flex justify-between gap-4">
                <div>
                  <h4 className="font-display text-xl">UTEPSA</h4>
                  <p className="text-sm text-secondary">Programmer</p>
                </div>
                <p className="text-xs text-foreground/65">2025</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  Delivered Blazor modules end to end.
                </li>
              </ul>
            </div>
          </Variant>

          <Variant
            title="Vertical timeline"
            verdict="optional"
            verdictLabel={opt}
            note="Nice if you add more roles later; more motion-friendly."
          >
            <ol className="relative w-full max-w-sm space-y-6 border-l border-secondary/40 pl-5">
              <li>
                <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-secondary" />
                <p className="text-sm font-semibold">2025 — UTEPSA</p>
                <p className="text-xs text-foreground/70">Programmer</p>
              </li>
              <li>
                <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary/70" />
                <p className="text-sm font-semibold">2021–2026 — Systems Eng.</p>
                <p className="text-xs text-foreground/70">UTEPSA</p>
              </li>
            </ol>
          </Variant>
        </Section>

        <Section id="feedback" title={t("sections.feedback")}>
          <Variant
            title="Inline callout"
            verdict="optional"
            verdictLabel={opt}
            note="Availability banner or “open to remote”."
          >
            <div className="w-full border border-primary/30 bg-accent px-4 py-3 text-sm text-primary">
              Open to remote roles · English (intermediate) · Spanish (native)
            </div>
          </Variant>

          <Variant
            title="Toast / floating alert"
            verdict="avoid"
            verdictLabel={avoid}
            note="Not needed on a static portfolio unless forms ship."
          >
            <div className="rounded-md border border-secondary/40 bg-card px-4 py-3 text-sm">
              Message sent (example toast)
            </div>
          </Variant>
        </Section>

        <Section id="motion" title={t("sections.motion")}>
          <Variant
            title="Fade-up entrance"
            verdict="recommended"
            verdictLabel={rec}
            note="Already on hero. Keep to 2–3 intentional motions."
          >
            <div className="animate-fade-up rounded-md border border-secondary/30 bg-accent px-4 py-3 text-sm">
              Entrance motion
            </div>
          </Variant>

          <Variant
            title="Hover grow / color shift"
            verdict="recommended"
            verdictLabel={rec}
            note="Buttons & cards: duration-300, no bounce."
          >
            <button
              type="button"
              className="rounded-md border border-secondary px-4 py-2 text-sm text-secondary transition duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-background"
            >
              Hover me
            </button>
          </Variant>

          <Variant
            title="Continuous pulse / glow"
            verdict="avoid"
            verdictLabel={avoid}
            note="Noise, not presence."
          >
            <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-secondary shadow-[0_0_12px_var(--secondary)]" />
          </Variant>
        </Section>
      </div>

      <p className="mt-16 max-w-xl text-sm text-foreground/65">
        Tip: switch theme and language with the floating controls, then pick one
        variant family (recommended) and we can lock it into reusable components.
      </p>
    </div>
  );
}
