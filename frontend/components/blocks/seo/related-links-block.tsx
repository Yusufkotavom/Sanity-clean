import SectionContainer from "@/components/ui/section-container";
import Link from "next/link";
import type { ColorVariant, SectionPadding } from "@/sanity.types";

type Props = {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  title?: string | null;
  links?: Array<{ _key?: string; title?: string; href?: string }> | null;
};

export default function RelatedLinksBlock({ padding, colorVariant, title, links }: Props) {
  if (!links?.length) return null;
  return (
    <SectionContainer color={colorVariant} padding={padding}>
      {title && <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>}
      <div className="flex flex-wrap gap-2">
        {links.map((link, i) => (
          <Link key={link._key || i} href={link.href || "#"} className="rounded-md border border-border/60 px-3 py-1.5 text-xs transition-colors hover:bg-accent">
            {link.title}
          </Link>
        ))}
      </div>
    </SectionContainer>
  );
}
