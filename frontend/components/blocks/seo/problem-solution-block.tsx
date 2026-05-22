import { stegaClean } from "next-sanity";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import SectionContainer from "@/components/ui/section-container";
import GlassCard from "@/components/ui/glass-card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type Block = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
type ProblemSolutionBlock = Extract<Block, { _type: "problem-solution-block" }>;

export default function ProblemSolutionBlock({
  padding,
  colorVariant,
  title,
  problems,
  solutionTitle,
  solution,
}: ProblemSolutionBlock) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="mx-auto max-w-4xl">
        {title && (
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            {title}
          </h2>
        )}

        {problems && problems.length > 0 && (
          <ul className="mb-8 space-y-3">
            {problems.map((problem, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 backdrop-blur-sm"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span className="text-sm">{problem}</span>
              </li>
            ))}
          </ul>
        )}

        {solution && (
          <GlassCard className="border-primary/25 bg-primary/5">
            {solutionTitle && (
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <span>{solutionTitle}</span>
              </h3>
            )}
            <p className="text-sm leading-relaxed">{solution}</p>
          </GlassCard>
        )}
      </div>
    </SectionContainer>
  );
}
