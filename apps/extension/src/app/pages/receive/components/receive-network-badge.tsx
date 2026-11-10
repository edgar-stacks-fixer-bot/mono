import { HomePageSelectors } from '@tests/selectors/home.selectors';
import type { FlexProps } from 'leather-styles/jsx';

import { type BadgeProps, NetworkModeBadge } from '@leather.io/ui';

import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

interface ReceiveNetworkBadgeDisplay {
  label: string;
  variant: BadgeProps['variant'];
}

export function getReceiveNetworkBadgeDisplay(
  name: string,
  isMainnet: boolean
): ReceiveNetworkBadgeDisplay {
  return { label: name, variant: isMainnet ? 'default' : 'warning' };
}

export function ReceiveNetworkBadge(props: FlexProps) {
  const { name, isMainnet } = useCurrentNetworkState();
  const { label, variant } = getReceiveNetworkBadgeDisplay(name, isMainnet);

  return (
    <NetworkModeBadge
      data-testid={HomePageSelectors.ReceiveNetworkBadge}
      isVisible
      name={label}
      variant={variant}
      {...props}
    />
  );
}
