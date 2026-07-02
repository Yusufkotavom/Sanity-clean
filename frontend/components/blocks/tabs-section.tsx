"use client";

import { useState } from "react";
import SectionContainer from "@/components/ui/section-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GridRow from "./grid/grid-row";
import { stegaClean } from "@/lib/clean";

interface TabItem {
  _key: string;
  label: string;
  grid: any;
}

interface TabsSectionProps {
  blockStyles?: any;
  tabs?: TabItem[] | null;
}

export default function TabsSection({ blockStyles, 
      
      
      tabs,
    }: TabsSectionProps) {
  // Safe initialization for activeTab
  const initialTab = tabs?.[0]?._key || "";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Ensure state aligns if tabs prop changes
  const activeTabExists = tabs.some((t) => t._key === activeTab);
  const resolvedActiveTab = activeTabExists ? activeTab : initialTab;

  return (
    <SectionContainer blockStyles={blockStyles}>
      <Tabs
        value={resolvedActiveTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col items-center gap-8"
      >
        <TabsList className="bg-muted/80 p-1.5 rounded-full flex flex-wrap justify-center border border-border/40 dark:border-white/10">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab._key}
              value={tab._key}
              className="px-6 py-2 text-sm font-medium rounded-full transition-all duration-200"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab._key}
            value={tab._key}
            className="w-full focus-visible:outline-none focus-visible:ring-0"
          >
            {tab.grid && (
              <GridRow {...tab.grid} noContainer />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </SectionContainer>
  );
}
