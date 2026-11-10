import { isValidElement } from 'react';

import { describe, expect, it, vi } from 'vitest';

import { type NetworkConfiguration, defaultNetworksKeyedById } from '@leather.io/models';

import { NetworkBadge } from './network-badge';

const mockUseSettings = vi.fn<() => { networkPreference: NetworkConfiguration }>();

vi.mock('@/store/settings/settings', () => ({
  useSettings: () => mockUseSettings(),
}));

vi.mock('expo-router', () => ({
  useRouter: () => ({ navigate: vi.fn() }),
}));

vi.mock('@leather.io/ui/native', () => ({
  Badge: vi.fn(),
  Pressable: vi.fn(),
}));

function getBadgeVariant(element: unknown) {
  if (!isValidElement<{ children: unknown }>(element)) return undefined;
  const badge = element.props.children;
  if (!isValidElement<{ variant?: string }>(badge)) return undefined;
  return badge.props.variant;
}

describe(NetworkBadge.name, () => {
  it('renders nothing on mainnet', () => {
    mockUseSettings.mockReturnValue({ networkPreference: defaultNetworksKeyedById.mainnet });
    expect(NetworkBadge({})).toBeNull();
  });

  it('renders a warning badge on a non-mainnet network', () => {
    mockUseSettings.mockReturnValue({ networkPreference: defaultNetworksKeyedById.testnet });
    expect(getBadgeVariant(NetworkBadge({}))).toEqual('warning');
  });

  it('lets an explicit variant override the warning default', () => {
    mockUseSettings.mockReturnValue({ networkPreference: defaultNetworksKeyedById.signet });
    expect(getBadgeVariant(NetworkBadge({ variant: 'info' }))).toEqual('info');
  });
});
