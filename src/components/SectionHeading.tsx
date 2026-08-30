export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-foreground/75">{subtitle}</p>
    </div>
  );
}
