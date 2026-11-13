import { bytesToHex } from '@noble/hashes/utils';

import { type CompiledWshDescriptor, reencodeTestnetFamilyAddress } from '@leather.io/bitcoin';

type WshDescriptorKey = CompiledWshDescriptor['keys'][number];

export function toLedgerDisplayedAddress(address: string): string {
  return reencodeTestnetFamilyAddress(address, 'testnet') ?? address;
}

export function isLedgerOnDeviceAddressConfirmed(
  onDeviceAddress: string,
  expectedAddress: string | null | undefined
): boolean {
  if (!expectedAddress) return false;
  return toLedgerDisplayedAddress(onDeviceAddress) === toLedgerDisplayedAddress(expectedAddress);
}

export const ledgerRawKeyUnsupportedMessage =
  'Ledger cannot display this address. Every other signer must be an extended public key (xpub), and your account can only be a raw public key when the xpubs use the 0/0 path.';

function isAccountKey(key: WshDescriptorKey, accountKey: WshDescriptorKey) {
  if (key === accountKey) return true;
  if (!key.pubkey || !accountKey.pubkey) return false;
  return bytesToHex(key.pubkey) === bytesToHex(accountKey.pubkey);
}

export function isLedgerDisplayableDescriptor(
  compiled: CompiledWshDescriptor,
  accountKey: WshDescriptorKey
): boolean {
  if (compiled.keys.some(key => !key.bip32 && !isAccountKey(key, accountKey))) return false;
  if (accountKey.bip32) return true;
  const { changeIndex, addressIndex } = compiled.keyPathIndexes;
  return changeIndex === 0 && addressIndex === 0;
}
