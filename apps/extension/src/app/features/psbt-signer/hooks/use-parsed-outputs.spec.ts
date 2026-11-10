import type * as ReactModule from 'react';

import { hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';

import { createBitcoinAddress } from '@leather.io/bitcoin';
import { defaultCurrentNetwork } from '@leather.io/models';

import { useParsedOutputs } from './use-parsed-outputs';

const nativeSegwitPayment = btc.p2wpkh(hexToBytes('02'.padEnd(66, '3')), btc.NETWORK);
const recipientPayment = btc.p2wpkh(hexToBytes('03'.padEnd(66, '4')), btc.NETWORK);

function requireAddress(address: string | undefined) {
  if (!address) throw new Error('Expected address to be defined');
  return createBitcoinAddress(address);
}

const nativeSegwitAddress = requireAddress(nativeSegwitPayment.address);
const recipientAddress = requireAddress(recipientPayment.address);

vi.mock('react', async importOriginal => {
  const actual = await importOriginal<typeof ReactModule>();
  return {
    ...actual,
    useMemo<T>(factory: () => T) {
      return factory();
    },
  };
});

vi.mock('@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks', () => ({
  useCurrentAccountNativeSegwitIndexZeroPayer: () => ({ address: nativeSegwitAddress }),
}));

vi.mock('@app/store/accounts/blockchain/bitcoin/taproot-account.hooks', () => ({
  useCurrentAccountTaprootIndexZeroPayer: () => ({ address: undefined }),
}));

describe(useParsedOutputs.name, () => {
  it('parses every output when all outputs have a script', () => {
    const outputs = [
      { script: recipientPayment.script, amount: 20_000n },
      { script: nativeSegwitPayment.script, amount: 5_000n },
    ];

    expect(
      useParsedOutputs({ isPsbtMutable: false, outputs, network: defaultCurrentNetwork })
    ).toEqual([
      expect.objectContaining({
        address: recipientAddress,
        isMutable: false,
        toSign: false,
        value: 20_000,
      }),
      expect.objectContaining({
        address: nativeSegwitAddress,
        isMutable: false,
        toSign: true,
        value: 5_000,
      }),
    ]);
  });

  it('returns null instead of a partial list when an output has no script', () => {
    const outputs = [{ script: recipientPayment.script, amount: 20_000n }, { amount: 10_000n }];

    expect(
      useParsedOutputs({ isPsbtMutable: false, outputs, network: defaultCurrentNetwork })
    ).toBeNull();
  });
});
