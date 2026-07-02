import SectionContainer from "@/components/ui/section-container";
import Timeline1 from "@/components/blocks/timeline/timeline-1";
import { PAGE_QUERY_RESULT,  } from "@/sanity.types";

type TimelineRow = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "timeline-row" }
>;

export default function TimelineRow({ blockStyles, 
      
      
      timelines,
    }: TimelineRow) {
  return (
    <SectionContainer blockStyles={blockStyles}>
      {timelines && timelines?.length > 0 && (
        <div className="max-w-[48rem] mx-auto">
          {timelines?.map((timeline) => (
            <Timeline1
              key={timeline._key}
              {...timeline}
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
