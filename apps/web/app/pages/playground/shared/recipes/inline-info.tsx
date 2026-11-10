import { type ReactNode } from 'react';

import { styled } from 'leather-styles/jsx';

import { InfoCircleIcon, InlineIcon } from '@leather.io/ui';

interface InlineInfoProps {
  children: ReactNode;
}

export function InlineInfo({ children }: InlineInfoProps) {
  return (
    <styled.p textStyle="caption.01" color="ink.text-subdued">
      <InlineIcon icon={<InfoCircleIcon />} tone="subdued" placement="start" />
      {children}
    </styled.p>
  );
}
