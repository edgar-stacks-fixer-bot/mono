import { type ReactNode } from 'react';

import { HStack } from 'leather-styles/jsx';

import { ChevronRightIcon, InlineIcon, ListItemBox } from '@leather.io/ui';

interface ListRowProps {
  title: string;
  leading?: ReactNode;
  caption?: ReactNode;
  value?: ReactNode;
  valueCaption?: ReactNode;
  onSelect?(): void;
}

export function ListRow({ title, leading, caption, value, valueCaption, onSelect }: ListRowProps) {
  const chevron = onSelect ? (
    <InlineIcon icon={<ChevronRightIcon />} tone="subdued" data-testid="list-row-chevron" />
  ) : null;
  const hasTrailing = Boolean(value) || Boolean(chevron);

  return (
    <ListItemBox
      title={title}
      leading={leading}
      caption={caption}
      trailing={
        hasTrailing ? (
          <HStack gap="space.02" alignItems="center">
            {value}
            {chevron}
          </HStack>
        ) : undefined
      }
      trailingCaption={valueCaption}
      density="compact"
      onClick={onSelect}
    />
  );
}
