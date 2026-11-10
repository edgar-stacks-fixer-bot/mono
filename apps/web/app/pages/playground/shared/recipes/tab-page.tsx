import { type ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

import { Tabs } from '@leather.io/ui';

interface TabPageTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabPageProps {
  label: string;
  tabs: readonly TabPageTab[];
  defaultTab?: string;
}

export function TabPage({ label, tabs, defaultTab }: TabPageProps) {
  return (
    <Tabs.Root defaultValue={defaultTab ?? tabs[0]?.id}>
      <Tabs.List aria-label={label}>
        {tabs.map(tab => (
          <Tabs.Trigger key={tab.id} value={tab.id}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(tab => (
        <Tabs.Content key={tab.id} value={tab.id}>
          <Box pt="space.04">{tab.content}</Box>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
