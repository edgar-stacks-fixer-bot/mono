import { renderToString } from 'react-dom/server';

import {
  BondSpendingConditions,
  type BondSpendingConditionsDetails,
  formatVaultRequirement,
} from './bond-spending-conditions';

const multiVaultDetails: BondSpendingConditionsDetails = {
  unlockHeight: 850_000,
  hash: 'hash-placeholder',
  counterpartyKey: 'counterparty-key-placeholder',
  vaultKind: 'multi',
  vaultThreshold: 2,
  vaultKeyExpressions: ['vault-key-a', 'vault-key-b', 'vault-key-c'],
};

const pkVaultDetails: BondSpendingConditionsDetails = {
  ...multiVaultDetails,
  vaultKind: 'pk',
  vaultThreshold: 1,
  vaultKeyExpressions: ['owner-key-placeholder'],
};

describe(formatVaultRequirement.name, () => {
  test('describes a multisig vault as a count of co-signers', () => {
    expect(formatVaultRequirement(multiVaultDetails)).toBe('Requires 2 of 3 vault co-signers');
  });

  test('describes a single-key vault as the owner key', () => {
    expect(formatVaultRequirement(pkVaultDetails)).toBe('Requires the owner key');
  });
});

describe(BondSpendingConditions.name, () => {
  test('renders both spending paths for a multisig vault', () => {
    const html = renderToString(<BondSpendingConditions {...multiVaultDetails} />);

    expect(html).toContain('From block <!-- -->850000');
    expect(html).toContain('Before block <!-- -->850000');
    expect(html).toContain('Requires 2 of 3 vault co-signers');
    expect(html).toContain('counterparty-key-placeholder');
    expect(html).toContain('hash-placeholder');
    expect(html).not.toContain('Owner key');
  });

  test('renders the owner key for a single-key vault', () => {
    const html = renderToString(<BondSpendingConditions {...pkVaultDetails} />);

    expect(html).toContain('Requires the owner key');
    expect(html).toContain('Owner key');
    expect(html).toContain('owner-key-placeholder');
  });
});
