"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PackageTabsProps = {
  currentCount: number;
  pastCount: number;
  pastUnpaidCount: number;
  current: ReactNode;
  past: ReactNode;
};

const TRIGGER_CLASS =
  "h-auto flex-none rounded-none px-1 pb-3 font-medium text-muted-foreground hover:text-foreground data-active:font-semibold data-active:text-primary after:bg-primary group-data-horizontal/tabs:after:-bottom-px";

export function PackageTabs({
  currentCount,
  pastCount,
  pastUnpaidCount,
  current,
  past,
}: PackageTabsProps) {
  const defaultTab = currentCount === 0 && pastCount > 0 ? "past" : "current";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList
        variant="line"
        className="w-full justify-start gap-6 border-b border-border p-0 group-data-horizontal/tabs:h-auto"
      >
        <TabsTrigger value="current" className={TRIGGER_CLASS}>
          Current ({currentCount})
        </TabsTrigger>
        <TabsTrigger value="past" className={TRIGGER_CLASS}>
          Past ({pastCount})
          {pastUnpaidCount > 0 ? (
            <Badge variant="warning">{pastUnpaidCount} unpaid</Badge>
          ) : null}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="current" className="mt-4">
        {current}
      </TabsContent>
      <TabsContent value="past" className="mt-4">
        {past}
      </TabsContent>
    </Tabs>
  );
}
