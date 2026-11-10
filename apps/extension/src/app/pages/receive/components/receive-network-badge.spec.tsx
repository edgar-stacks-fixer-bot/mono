import { getReceiveNetworkBadgeDisplay } from './receive-network-badge';

vi.mock('@leather.io/ui', () => ({
  NetworkModeBadge: () => null,
}));

vi.mock('@app/store/networks/networks.hooks', () => ({
  useCurrentNetworkState: vi.fn(),
}));

describe('getReceiveNetworkBadgeDisplay', () => {
  test('shows the mainnet name with the default badge', () => {
    expect(getReceiveNetworkBadgeDisplay('Mainnet', true)).toEqual({
      label: 'Mainnet',
      variant: 'default',
    });
  });

  test('shows the testnet name with the warning badge', () => {
    expect(getReceiveNetworkBadgeDisplay('Testnet4', false)).toEqual({
      label: 'Testnet4',
      variant: 'warning',
    });
  });

  test('shows a custom network name as entered with the warning badge', () => {
    expect(getReceiveNetworkBadgeDisplay('My devnet', false)).toEqual({
      label: 'My devnet',
      variant: 'warning',
    });
  });
});
