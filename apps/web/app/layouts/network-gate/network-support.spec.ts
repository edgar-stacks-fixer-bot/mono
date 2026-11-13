import { routeSupportsNetwork } from './network-support';

describe('routeSupportsNetwork', () => {
  it('supports every route on mainnet', () => {
    expect(routeSupportsNetwork('/staking', 'mainnet')).toBe(true);
    expect(routeSupportsNetwork('/portfolio', 'mainnet')).toBe(true);
  });

  it.each([
    '/',
    '/apps',
    '/developers',
    '/news',
    '/explorer',
    '/posts',
    '/posts/what-is-stacks',
    '/support',
    '/support/install-leather',
    '/changelog',
    '/changelog/web-portfolio',
  ])('supports the marketing and content path %s on testnet', pathname => {
    expect(routeSupportsNetwork(pathname, 'testnet')).toBe(true);
  });

  it('supports multisig on testnet', () => {
    expect(routeSupportsNetwork('/multisig', 'testnet')).toBe(true);
    expect(routeSupportsNetwork('/multisig/create', 'testnet')).toBe(true);
  });

  it.each(['/staking', '/sbtc', '/portfolio', '/appsfoo', '/postsx'])(
    'gates the mainnet-only path %s on testnet',
    pathname => {
      expect(routeSupportsNetwork(pathname, 'testnet')).toBe(false);
    }
  );
});
