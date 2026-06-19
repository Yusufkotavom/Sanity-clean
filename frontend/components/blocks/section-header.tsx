import { cn } from "@/lib/utils";
import { stegaClean } from "@/lib/clean";
import { SectionIntro, SectionShell } from "@/components/ui/section-shell";

import { PAGE_QUERY_RESULT } from "@/sanity.types";

type SectionHeaderProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "section-header" }
> & {
  pageTitle?: string | null;
};

export default function SectionHeader({
  colorVariant,
  sectionWidth = "default",
  stackAlign = "left",
  tagLine,
  title,
  description,
  pageTitle,
}: SectionHeaderProps) {
  const cleanSectionWidth = stegaClean(sectionWidth);
  const cleanStackAlign = stegaClean(stackAlign);
  
  const isNarrow = cleanSectionWidth === "narrow";
  const resolvedTitle = title?.trim() || pageTitle?.trim() || undefined;
  const toneClassName =
    colorVariant === "primary"
      ? "surface-panel surface-panel-sky rounded-[1.6rem] px-5 py-6 md:px-7 md:py-8"
      : "";

  return (
    <SectionShell>
      <div
        className={cn(
          cleanStackAlign === "center" ? "mx-auto text-center" : undefined,
          isNarrow ? "mx-auto max-w-[48rem]" : "max-w-3xl",
          toneClassName,
        )}
      >
        <SectionIntro
          eyebrow={tagLine || undefined}
          title={resolvedTitle || ""}
          description={description || undefined}
          align={cleanStackAlign === "center" ? "center" : "left"}
          className="mb-0"
        />
      </div>
    </SectionShell>
  );
}
