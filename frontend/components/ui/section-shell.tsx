import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTone = "neutral" | "amber" | "sky" | "emerald" | "rose";

const TONE_CLASSNAMES: Record<SectionTone, string> = {
  neutral: "surface-panel surface-panel-neutral",
  amber: "surface-panel surface-panel-amber",
  sky: "surface-panel surface-panel-sky",
  emerald: "surface-panel surface-panel-emerald",
  rose: "surface-panel surface-panel-rose",
};

export function SectionShell({
  id,
  className,
  divider = true,
  useThemeBg = false,
  children,
}: {
  id?: string;
  className?: string;
  divider?: boolean;
  useThemeBg?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "container py-12 md:py-16",
        divider ? "section-divider-show" : "section-divider-hide",
        useThemeBg && "section-theme-bg",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-ui-label text-foreground/55">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function SectionPanel({
  tone = "neutral",
  className,
  children,
}: {
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(TONE_CLASSNAMES[tone], className)}>
      {children}
    </div>
  );
}

export function SplitVisualPanel({
  tone = "neutral",
  reverse = false,
  className,
  contentClassName,
  visualClassName,
  content,
  visual,
}: {
  tone?: SectionTone;
  reverse?: boolean;
  className?: string;
  contentClassName?: string;
  visualClassName?: string;
  content: ReactNode;
  visual: ReactNode;
}) {
  return (
    <SectionPanel
      tone={tone}
      className={cn(
        "grid gap-6 overflow-hidden p-5 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] md:p-7 lg:p-8 rounded-[var(--radius-card,1.75rem)]",
        reverse && "md:grid-cols-[minmax(320px,0.92fr)_minmax(0,1fr)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-center",
          reverse && "md:order-2",
          contentClassName,
        )}
      >
        {content}
      </div>
      <div
        className={cn(
          "relative min-h-[240px] overflow-hidden border border-white/40 bg-white/60 shadow-[0_14px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 rounded-[var(--radius-card,1.5rem)]",
          reverse && "md:order-1",
          visualClassName,
        )}
      >
        {visual}
      </div>
    </SectionPanel>
  );
}
