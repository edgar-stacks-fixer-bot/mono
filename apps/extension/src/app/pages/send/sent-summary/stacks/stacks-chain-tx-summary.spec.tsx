import { renderToString } from 'react-dom/server';

import { makeUnsignedSTXTokenTransfer } from '@stacks/transactions';

import { SbtcSponsoredSentSummary } from './stacks-chain-tx-summary';

vi.mock('./stacks-chain-tx-summary.layout', () => ({
  StacksChainTxSummaryLayout() {
    return <div>summary</div>;
  },
  StacksChainTxSummaryLoading() {
    return null;
  },
}));

vi.mock('@app/features/tx-status-badge/tx-status-badge', () => ({
  TxStatusBadge() {
    return null;
  },
}));

vi.mock('@app/query/common/market-data/market-data.hooks', () => ({
  useCryptoCurrencyMarketData: vi.fn(),
}));

vi.mock('@app/query/stacks/token-metadata/fungible-tokens/fungible-token-metadata.query', () => ({
  useGetFungibleTokenMetadataQuery: vi.fn(),
}));

const publicKey = '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';

describe(SbtcSponsoredSentSummary.name, () => {
  test('renders nothing instead of throwing for a transaction that is not a sponsored sBTC transfer', async () => {
    const tx = await makeUnsignedSTXTokenTransfer({
      recipient: 'ST000000000000000000002AMW42H',
      amount: 1n,
      fee: 0,
      nonce: 0,
      publicKey,
      network: 'testnet',
    });

    expect(renderToString(<SbtcSponsoredSentSummary txid="0x01" symbol="sBTC" tx={tx} />)).toBe('');
  });
});
