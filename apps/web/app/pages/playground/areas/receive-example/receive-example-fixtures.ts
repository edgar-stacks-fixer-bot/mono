export type ReceiveAssetAvatarId = 'btc' | 'stx' | 'sbtc';

export interface ReceiveAssetFixture {
  id: string;
  name: string;
  network: string;
  addressType: string;
  derivationPath: string;
  address: string;
  avatar: ReceiveAssetAvatarId;
  notice?: string;
}

export const defaultReceiveAsset: ReceiveAssetFixture = {
  id: 'btc-native-segwit',
  name: 'Bitcoin',
  network: 'Bitcoin',
  addressType: 'Native SegWit',
  derivationPath: "m/84'/0'/0'/0/0",
  address: 'bc1q9h6tq79fzg6dn2fzvqs8ejd5pjmyv4dk7v9yfu',
  avatar: 'btc',
};

export const receiveAssetFixtures: readonly ReceiveAssetFixture[] = [
  defaultReceiveAsset,
  {
    id: 'btc-taproot',
    name: 'Bitcoin (Taproot)',
    network: 'Bitcoin',
    addressType: 'Taproot',
    derivationPath: "m/86'/0'/0'/0/0",
    address: 'bc1pmzfrwwndsqmk5yh69yjr5lfgfg4ev8c0tsc06e5u7u2lsuh2a2tsr9yyxa',
    avatar: 'btc',
    notice: 'Use this address for Ordinals and other inscriptions.',
  },
  {
    id: 'stx',
    name: 'Stacks',
    network: 'Stacks',
    addressType: 'Stacks',
    derivationPath: "m/44'/5757'/0'/0/0",
    address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G',
    avatar: 'stx',
  },
  {
    id: 'sbtc',
    name: 'sBTC',
    network: 'Stacks',
    addressType: 'Stacks',
    derivationPath: "m/44'/5757'/0'/0/0",
    address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G',
    avatar: 'sbtc',
  },
];

const longListCopies = 4;

export const longReceiveAssetFixtures: readonly ReceiveAssetFixture[] = Array.from(
  { length: longListCopies },
  (_, copy) =>
    receiveAssetFixtures.map(asset => ({
      ...asset,
      id: `${asset.id}-${copy}`,
      name: copy === 0 ? asset.name : `${asset.name} ${copy + 1}`,
    }))
).flat();
