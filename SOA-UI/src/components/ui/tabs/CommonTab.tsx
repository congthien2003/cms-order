import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type CommonTabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

type CommonTabsProps = {
  tabs: CommonTabItem[];
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
};

export function CommonTabs({
  tabs,
  defaultValue,
  className,
  tabsListClassName,
  tabsContentClassName,
}: CommonTabsProps) {
  if (!tabs?.length) return null;

  const resolvedDefaultValue = defaultValue ?? tabs[0].value;

  return (
    <Tabs
      defaultValue={resolvedDefaultValue}
      className={cn('w-full', className)}
    >
      <TabsList className={tabsListClassName}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={tabsContentClassName}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
