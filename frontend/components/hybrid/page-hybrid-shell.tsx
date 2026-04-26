import type { ReactNode } from "react";

import Blocks from "@/components/blocks";
import ReusableSlotSections from "@/components/reusable-slot-sections";
import {
  fetchSanityPageBySlugBuildOnly,
  fetchSanityReusableSections,
} from "@/sanity/lib/fetch";

type PageHybridShellProps = {
  slug: string;
  children: ReactNode;
};

export default async function PageHybridShell({
  slug,
  children,
}: PageHybridShellProps) {
  const cmsPage = await fetchSanityPageBySlugBuildOnly({ slug });
  const reusableSections = await fetchSanityReusableSections();
  const cmsPageWithSplit = cmsPage as (typeof cmsPage & {
    topBlockCount?: number;
  }) | null;
  const cmsBlocks = cmsPage?.blocks ?? [];
  const rawTopBlockCount =
    typeof cmsPageWithSplit?.topBlockCount === "number"
      ? cmsPageWithSplit.topBlockCount
      : 0;
  const topBlockCount = Math.max(0, Math.min(rawTopBlockCount, cmsBlocks.length));
  const topBlocks = cmsBlocks.slice(0, topBlockCount);
  const bottomBlocks = cmsBlocks.slice(topBlockCount);

  return (
    <>
      {topBlocks.length > 0 ? (
        <Blocks blocks={topBlocks} pageTitle={cmsPage?.title} />
      ) : null}
      <ReusableSlotSections sections={reusableSections} slot="afterHero" />
      {children}
      <ReusableSlotSections sections={reusableSections} slot="beforeFinalCta" />
      {bottomBlocks.length > 0 ? (
        <Blocks blocks={bottomBlocks} pageTitle={cmsPage?.title} />
      ) : null}
    </>
  );
}
