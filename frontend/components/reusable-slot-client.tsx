"use client";

import { usePathname } from "next/navigation";
import ReusableSlotSections from "@/components/reusable-slot-sections";
import type { ReusablePlacementSlot, ReusableSectionItem } from "@/sanity/lib/fetch";

function normalizeRouteKey(pathname: string): string {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
  return cleanPath.length > 0 ? cleanPath : "index";
}

export default function ReusableSlotClient({
  sections,
  slot,
}: {
  sections: ReusableSectionItem[];
  slot: ReusablePlacementSlot;
}) {
  const pathname = usePathname();
  const routeKey = normalizeRouteKey(pathname);
  return <ReusableSlotSections sections={sections} slot={slot} currentRouteKey={routeKey} />;
}
