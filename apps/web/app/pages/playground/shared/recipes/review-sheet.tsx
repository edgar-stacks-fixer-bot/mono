import { type ReactNode } from 'react';

import { Flex } from 'leather-styles/jsx';

import { ListContainer, Sheet, SheetHeader } from '@leather.io/ui';

import { ListRow } from './list-row';
import { PageActions } from './page-actions';

interface ReviewRow {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
}

interface ReviewSheetProps {
  isShowing: boolean;
  title: string;
  rows: readonly ReviewRow[];
  confirmLabel: string;
  summary?: ReactNode;
  notice?: ReactNode;
  cancelLabel?: string;
  onConfirm(): void;
  onClose(): void;
}

export function ReviewSheet({
  isShowing,
  title,
  rows,
  confirmLabel,
  summary,
  notice,
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}: ReviewSheetProps) {
  return (
    <Sheet
      isShowing={isShowing}
      onClose={onClose}
      title={title}
      header={<SheetHeader title={title} />}
      footer={
        <PageActions
          primary={{ label: confirmLabel, onClick: onConfirm }}
          secondary={{ label: cancelLabel, onClick: onClose }}
        />
      }
    >
      <Flex direction="column" gap="space.05" px="space.05" pb="space.05" color="ink.text-primary">
        {summary}
        <ListContainer>
          {rows.map(row => (
            <ListRow
              key={row.label}
              title={row.label}
              value={row.value}
              valueCaption={row.caption}
            />
          ))}
        </ListContainer>
        {notice}
      </Flex>
    </Sheet>
  );
}
