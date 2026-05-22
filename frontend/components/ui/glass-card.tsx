import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function GlassCard({
  children,
  className,
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-background/70 p-6 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.28)] backdrop-blur-md",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_24px_54px_-26px_rgba(15,23,42,0.35)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

