import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { describe, expect, it } from 'vitest';

import { getOutputScriptType } from '../utils/bitcoin.utils';
import { createBitcoinAddress } from '../validation/bitcoin-address';
import { BitcoinError } from '../validation/bitcoin-error';
import { getPsbtDetails } from './psbt-details';
import { getParsedOutputs } from './psbt-outputs';

const NETWORK = btc.NETWORK;
const ownerPayment = btc.p2wpkh(hexToBytes('02'.padEnd(66, '3')), NETWORK);
const recipientAddress = btc.p2wpkh(hexToBytes('03'.padEnd(66, '7')), NETWORK).address ?? '';

// P2A (pay-to-anchor) scriptPubKey: OP_1 <0x4e73>. @scure/btc-signer@1.6.0
// classifies this as OutScript type 'p2a' and cannot encode it to an address.
const p2aScript = btc.Script.encode([1, hexToBytes('4e73')]);

function buildPsbtWithP2aOutput() {
  const tx = new btc.Transaction({ allowUnknownOutputs: true });
  tx.addInput({
    txid: new Uint8Array(32).fill(0x11),
    index: 0,
    witnessUtxo: { script: ownerPayment.script, amount: 1_000_000n },
  });
  tx.addOutputAddress(recipientAddress, 10_000n, NETWORK);
  tx.addOutput({ script: p2aScript, amount: 985_000n });
  return bytesToHex(tx.toPSBT());
}

describe('getOutputScriptType', () => {
  it('classifies a pay-to-anchor script as p2a', () => {
    expect(getOutputScriptType(p2aScript)).toBe('p2a');
  });

  it('classifies a native segwit script as wpkh', () => {
    expect(getOutputScriptType(ownerPayment.script)).toBe('wpkh');
  });
});

describe('getPsbtDetails output parsing', () => {
  it('keeps a null-address P2A output with its script type instead of dropping it', () => {
    const details = getPsbtDetails({
      psbtHex: buildPsbtWithP2aOutput(),
      psbtAddresses: [],
      networkMode: 'mainnet',
    });

    const p2aOutput = details.psbtOutputs.find(output => output.value === 985_000);
    expect(p2aOutput?.address).toBeNull();
    expect(p2aOutput?.scriptType).toBe('p2a');
  });

  it('resolves a standard output to its address and script type', () => {
    const details = getPsbtDetails({
      psbtHex: buildPsbtWithP2aOutput(),
      psbtAddresses: [],
      networkMode: 'mainnet',
    });

    const wpkhOutput = details.psbtOutputs.find(output => output.value === 10_000);
    expect(wpkhOutput?.address).toBe(recipientAddress);
    expect(wpkhOutput?.scriptType).toBe('wpkh');
  });
});

describe('getParsedOutputs', () => {
  it('parses every output when all outputs have a script', () => {
    const outputs = [
      {
        script: btc.OutScript.encode(btc.Address(NETWORK).decode(recipientAddress)),
        amount: 20_000n,
      },
      { script: p2aScript, amount: 330n },
    ];

    expect(
      getParsedOutputs({
        isPsbtMutable: false,
        outputs,
        networkMode: 'mainnet',
        psbtAddresses: [createBitcoinAddress(recipientAddress)],
      })
    ).toEqual([
      {
        address: recipientAddress,
        isMutable: false,
        toSign: true,
        value: 20_000,
        scriptType: 'wpkh',
      },
      { address: null, isMutable: false, toSign: false, value: 330, scriptType: 'p2a' },
    ]);
  });

  it('throws instead of dropping an output without a script', () => {
    const outputs = [{ script: ownerPayment.script, amount: 20_000n }, { amount: 10_000n }];

    expect(() =>
      getParsedOutputs({
        isPsbtMutable: false,
        outputs,
        networkMode: 'mainnet',
        psbtAddresses: [],
      })
    ).toThrow(new BitcoinError('OutputHasNoScript'));
  });
});
