import Blocks from "@/components/blocks";
import {
  ReusablePlacementSlot,
  ReusableSectionItem,
} from "@/sanity/lib/fetch";
import { PAGE_QUERY_RESULT } from "@/sanity.types";

type PageBlock = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];

function buildSlotBlocks(
  sections: ReusableSectionItem[],
  slot: ReusablePlacementSlot,
  currentRouteKey?: string,
): PageBlock[] {
  return sections.flatMap((section) => {
    const matchesRoute =
      section.routeMode !== "selected" ||
      !!currentRouteKey?.trim() &&
        Array.isArray(section.routeSlugs) &&
        section.routeSlugs.includes(currentRouteKey);

    if (!section.placements?.includes(slot) || !section.blocks?.length) {
      return [];
    }

    if (!matchesRoute) {
      return [];
    }

    return section.blocks.map((block, index) => ({
      ...block,
      _key: `${section._id}-${slot}-${block._key || index}`,
    })) as PageBlock[];
  });
}

export default function ReusableSlotSections({
  sections,
  slot,
  currentRouteKey,
}: {
  sections: ReusableSectionItem[];
  slot: ReusablePlacementSlot;
  currentRouteKey?: string;
}) {
  const slotBlocks = buildSlotBlocks(sections, slot, currentRouteKey);

  if (!slotBlocks.length) return null;

  return <Blocks blocks={slotBlocks} />;
}
