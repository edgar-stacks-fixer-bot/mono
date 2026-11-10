import { type ReactNode } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

import { Badge } from '@leather.io/ui';

interface ReceiveAssetIdentityProps {
  avatar: ReactNode;
  name: string;
  network: string;
}

export function ReceiveAssetIdentity({ avatar, name, network }: ReceiveAssetIdentityProps) {
  return (
    <Flex direction="column" alignItems="center" gap="space.03">
      {avatar}
      <Flex direction="column" alignItems="center" gap="space.02">
        <styled.h2 textStyle="heading.05" color="ink.text-primary">
          {`Receive ${name}`}
        </styled.h2>
        <Badge label={network} />
      </Flex>
    </Flex>
  );
}
