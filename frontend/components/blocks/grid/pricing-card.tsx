import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PAGE_QUERY_RESULT, ColorVariant } from "@/sanity.types";
import { SectionPanel } from "@/components/ui/section-shell";
import SanityIcon from "@/components/icons/sanity-icon";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type GridRow = Extract<Block, { _type: "grid-row" }>;
type GridColumn = NonNullable<NonNullable<GridRow["columns"]>>[number];
type PricingCard = Extract<GridColumn, { _type: "pricing-card" }>;

interface PricingCardProps extends Omit<PricingCard, "_type" | "_key"> {
  color?: ColorVariant;
  textAlign?: "left" | "center" | null;
  cardStyle?: "vertical" | "horizontal" | "classic" | null;
}

export default function PricingCard({
  color,
  textAlign,
  cardStyle,
  uiIcon,
  title,
  tagLine,
  excerpt,
  price,
  list,
  link,
}: PricingCardProps) {
  const isCenter = textAlign === "center";
  const isHorizontal = cardStyle === "horizontal";

  return (
    <SectionPanel
      tone={color === "primary" ? "sky" : "neutral"}
      className="flex w-full flex-col justify-between rounded-[1.5rem] p-6 md:p-8"
    >
        <div className={cn(color === "primary" ? "text-background" : undefined, isCenter && "text-center")}>
          {title && (
            <div className={cn("flex items-center", isCenter ? "justify-center gap-3 flex-wrap" : "justify-between")}>
              <div className={cn("inline-flex items-center gap-2", isHorizontal && "items-start")}>
                <SanityIcon icon={uiIcon} className="size-5" />
                <h3 className="text-xl font-semibold leading-[1.2]">{title}</h3>
              </div>
              {tagLine ? <Badge className="rounded-full">{tagLine}</Badge> : null}
            </div>
          )}
          {price && price.value !== null && price.value !== undefined && (
            <div className="flex items-end my-8 gap-1">
              <div className="text-3xl font-semibold leading-none">
                ${price.value}
              </div>
              {price.period && <div className="text-sm">{price.period}</div>}
            </div>
          )}
          {list && list.length > 0 && (
            <ul className="flex flex-col gap-2 my-8">
              {list.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm leading-6">
                  <Check size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {excerpt ? (
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              {excerpt}
            </p>
          ) : null}
        </div>
        <Button
          className={cn("mt-6 rounded-full px-6", isCenter ? "self-center" : "self-start")}
          size="lg"
          variant="default"
          asChild
        >
          <Link
            href={link?.href ? link.href : "#"}
            target={link?.target ? "_blank" : undefined}
          >
            <SanityIcon icon={link?.uiIcon || link?.icon} className="size-4" />
            {link?.title}
          </Link>
        </Button>
    </SectionPanel>
  );
}
