"use client";

import {
  ArchiveCardArrow,
  ArchiveCardExcerpt,
  ArchiveCardMedia,
  ArchiveCardMeta,
  ArchiveCardShell,
  ArchiveCardTitle,
} from "@/components/ui/archive-card";
import { Badge } from "@/components/ui/badge";
import { Code, ExternalLink, Link as LinkIcon } from "lucide-react";

export default function ProjectCard({
  title,
  slug,
  excerpt,
  image,
  clientName,
  industry,
  completionYear,
  projectType,
  categories,
  previewUrl,
  repositoryUrl,
  projectUrl,
}: {
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  image?: any;
  clientName?: string;
  industry?: string;
  completionYear?: number;
  projectType?: string;
  categories?: any[];
  previewUrl?: string;
  repositoryUrl?: string;
  projectUrl?: string;
}) {
  return (
    <ArchiveCardShell href={`/projects/${slug?.current || ""}`} density="compact" className="group p-0 overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="relative flex-grow">
          <ArchiveCardMedia image={image} heightVariant="compact" className="mb-0 rounded-none w-full border-b border-border/50" />
          <div className="absolute right-3 top-3 flex gap-1.5 opacity-100 md:opacity-0 transition-opacity md:group-hover:opacity-100 z-10">
            {repositoryUrl && (
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(repositoryUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <Code size={16} />
              </button>
            )}
            {projectUrl && !previewUrl && (
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(projectUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <LinkIcon size={16} />
              </button>
            )}
             {previewUrl && (
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(previewUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <ExternalLink size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="p-4 lg:p-5">
          {(projectType || (categories && categories.length > 0)) && (
            <div className="mb-2 flex flex-wrap gap-1.5">
            {projectType && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] capitalize leading-relaxed">
                {projectType.replace("-", " ")}
              </Badge>
            )}
            {categories?.map(
              (c) =>
                c?.title && (
                  <Badge key={c._id || c.title} variant="outline" className="px-1.5 py-0 text-[10px] font-normal leading-relaxed">
                    {c.title}
                  </Badge>
                )
            )}
          </div>
        )}
        <ArchiveCardTitle density="compact">{title}</ArchiveCardTitle>
        <ArchiveCardMeta
          density="compact"
          items={[clientName, industry, completionYear]}
        />
        <ArchiveCardExcerpt density="compact">{excerpt}</ArchiveCardExcerpt>
        
          <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
            <span className="text-sm font-semibold capitalize text-foreground/80 group-hover:text-primary transition-colors">
              {previewUrl ? "Live Preview" : "View Details"}
            </span>
            <ArchiveCardArrow density="compact" className="mt-0 group-hover:bg-primary group-hover:text-primary-foreground" />
          </div>
        </div>
      </div>
    </ArchiveCardShell>
  );
}
