import { Stack, styled } from 'leather-styles/jsx';

import type { BondVaultLeaf } from '@leather.io/bitcoin';

export interface BondSpendingConditionsDetails {
  unlockHeight: number;
  hash: string;
  counterpartyKey: string;
  vaultKind: BondVaultLeaf['kind'];
  vaultThreshold: number;
  vaultKeyExpressions: string[];
}

type BondVaultRequirement = Pick<
  BondSpendingConditionsDetails,
  'vaultKind' | 'vaultThreshold' | 'vaultKeyExpressions'
>;

export function formatVaultSigners({
  vaultKind,
  vaultThreshold,
  vaultKeyExpressions,
}: BondVaultRequirement) {
  if (vaultKind === 'pk') return 'the owner key';
  return `${vaultThreshold} of ${vaultKeyExpressions.length} vault co-signers`;
}

export function formatVaultRequirement(vaultRequirement: BondVaultRequirement) {
  return `Requires ${formatVaultSigners(vaultRequirement)}`;
}

interface KeyValueProps {
  label: string;
  value: string;
}

function KeyValue({ label, value }: KeyValueProps) {
  return (
    <>
      <styled.span textStyle="caption.01" color="ink.text-secondary">
        {label}
      </styled.span>
      <styled.code textStyle="caption.01" wordBreak="break-all">
        {value}
      </styled.code>
    </>
  );
}

type BondSpendingConditionsProps = BondSpendingConditionsDetails;

export function BondSpendingConditions({
  unlockHeight,
  hash,
  counterpartyKey,
  vaultKind,
  vaultThreshold,
  vaultKeyExpressions,
}: BondSpendingConditionsProps) {
  const vaultRequirement = formatVaultRequirement({
    vaultKind,
    vaultThreshold,
    vaultKeyExpressions,
  });
  const [ownerKey] = vaultKeyExpressions;

  return (
    <Stack gap="space.04">
      <Stack gap="space.01">
        <styled.span textStyle="label.02">From block {unlockHeight}</styled.span>
        <styled.span textStyle="caption.01" color="ink.text-secondary">
          {vaultRequirement}
        </styled.span>
        {vaultKind === 'pk' && ownerKey ? <KeyValue label="Owner key" value={ownerKey} /> : null}
      </Stack>
      <Stack gap="space.01">
        <styled.span textStyle="label.02">Before block {unlockHeight}</styled.span>
        <styled.span textStyle="caption.01" color="ink.text-secondary">
          {vaultRequirement}, plus a signature from the counterparty key and the secret matching the
          SHA-256 hash
        </styled.span>
        <KeyValue label="Counterparty key" value={counterpartyKey} />
        <KeyValue label="SHA-256 hash" value={hash} />
      </Stack>
    </Stack>
  );
}
