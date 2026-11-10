import { useMemo } from 'react';

import type { TransactionOutput } from '@scure/btc-signer/psbt';

import { BitcoinError, getParsedOutputs } from '@leather.io/bitcoin';
import type { NetworkConfiguration } from '@leather.io/models';

import { useCurrentAccountNativeSegwitIndexZeroPayer } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroPayer } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export interface PsbtOutput {
  address: string | null;
  isMutable: boolean;
  toSign: boolean;
  value: number;
}

interface UseParsedOutputsArgs {
  isPsbtMutable: boolean;
  outputs: TransactionOutput[];
  network: NetworkConfiguration;
}
export function useParsedOutputs({
  isPsbtMutable,
  outputs,
  network,
}: UseParsedOutputsArgs): PsbtOutput[] | null {
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroPayer().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroPayer();
  const networkMode = network.chain.bitcoin.mode;

  return useMemo(() => {
    try {
      return getParsedOutputs({
        isPsbtMutable,
        outputs,
        networkMode,
        psbtAddresses: [bitcoinAddressNativeSegwit, bitcoinAddressTaproot],
      });
    } catch (e) {
      if (e instanceof BitcoinError && e.message === 'OutputHasNoScript') return null;
      throw e;
    }
  }, [bitcoinAddressNativeSegwit, bitcoinAddressTaproot, networkMode, isPsbtMutable, outputs]);
}
