import { Flex, type FlexProps } from 'leather-styles/jsx';

import { Badge, type BadgeProps } from '../badge/badge.web';

interface NetworkBadge extends FlexProps {
  isVisible: boolean;
  name: string;
  variant?: BadgeProps['variant'];
}

export function NetworkModeBadge({ isVisible, name, variant, ...props }: NetworkBadge) {
  if (!isVisible) return null;

  return (
    <Flex position="relative" zIndex={999} {...props}>
      <Badge label={name} outlined variant={variant} />
    </Flex>
  );
}
