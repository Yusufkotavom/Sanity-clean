import { stegaClean } from "@/lib/clean";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import SectionContainer from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/glass-card";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type ServiceTypesBlock = Extract<Block, { _type: "service-types-block" }>;

export default function ServiceTypesBlock({ blockStyles, 
      
      
      title,
      description,
      services,
    }: ServiceTypesBlock) {
  

  return (
    <SectionContainer blockStyles={blockStyles}>
      <div className="mx-auto max-w-7xl">
        {title && (
          <div className="mb-3 text-center text-3xl font-bold md:text-4xl">
            {title}
          </div>
        )}
        {description && (
          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground">
            {description}
          </p>
        )}

        {services && services.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <GlassCard key={service._key} hover className="relative">
                {service.badge && (
                  <div className="absolute right-4 top-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                    {service.badge}
                  </div>
                )}
                <h3 className="mb-2 text-xl font-bold">{service.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <ul className="mb-4 space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 space-y-2 border-t pt-4">
                  {service.price && (
                    <div className="text-lg font-bold text-primary">
                      {service.price}
                    </div>
                  )}
                  {service.timeline && (
                    <div className="text-sm text-muted-foreground">
                      {service.timeline}
                    </div>
                  )}
                </div>

                {service.link && (
                  <div className="mt-4">
                    <Button
                      asChild
                      variant="default"
                      size="lg"
                      className="w-full  px-6"
                    >
                      <Link
                        href={service.link.href || "#"}
                        target={service.link.target ? "_blank" : undefined}
                        rel={
                          service.link.target
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {service.link.title || "Learn More"}
                      </Link>
                    </Button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
