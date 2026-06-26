import { stegaClean } from "@/lib/clean";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import SectionContainer from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type StatsHeroBlock = Extract<Block, { _type: "stats-hero-block" }>;

export default function StatsHeroBlock({
  padding,
  colorVariant,
  eyebrow,
  title,
  description,
  image,
  links,
}: StatsHeroBlock) {
  const color = stegaClean(colorVariant);
  const hasImageAsset = Boolean(image && (image.asset?._id || !!(image as any)._url));

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            {eyebrow && (
              <div className="mb-4 inline-block  bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                {eyebrow}
              </div>
            )}
            {title && (
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mb-6 text-lg text-muted-foreground">
                {description}
              </p>
            )}

            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map((link, index) => (
                  <Button
                    key={link._key}
                    asChild
                    variant={index === 0 ? "default" : "outline"}
                    size="lg"
                    className=" px-6"
                  >
                    <Link
                      href={link.href || "#"}
                      target={link.target ? "_blank" : undefined}
                      rel={
                        link.target ? "noopener noreferrer" : undefined
                      }
                    >
                      {link.title || "Learn More"}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {hasImageAsset && image && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={urlFor(image).width(800).url()}
                alt={image.alt || title || "Hero image"}
                fill
                className="object-cover"
                priority
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
