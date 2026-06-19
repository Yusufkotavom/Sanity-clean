import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroStandardButton = {
  readonly text: string;
  readonly url: string;
};

type HeroStandardBlock = {
  readonly _type: string;
  readonly _key: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly primaryButton?: HeroStandardButton;
  readonly secondaryButton?: HeroStandardButton;
  readonly alignment?: "left" | "center";
  readonly size?: "md" | "lg";
};

type HeroStandardProps = {
  readonly block: HeroStandardBlock;
};

export function HeroStandard({ block }: HeroStandardProps) {
  const isCentered = block.alignment === "center";
  const isLarge = block.size === "lg";

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.32),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,1))]" />
      <div
        className={cn(
          "relative mx-auto flex max-w-5xl flex-col gap-6",
          isCentered ? "items-center text-center" : "items-start",
        )}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
          VitPOS
        </p>
        <h1
          className={cn(
            "max-w-4xl font-semibold tracking-normal",
            isLarge ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl",
          )}
        >
          {block.title}
        </h1>
        {block.subtitle ? (
          <p className="max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
            {block.subtitle}
          </p>
        ) : null}
        <div className={cn("flex flex-wrap gap-3", isCentered ? "justify-center" : undefined)}>
          {block.primaryButton ? (
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href={block.primaryButton.url}>{block.primaryButton.text}</Link>
            </Button>
          ) : null}
          {block.secondaryButton ? (
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link href={block.secondaryButton.url}>{block.secondaryButton.text}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
