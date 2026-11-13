import { type ReactNode } from 'react';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { type StakingPoolSlug, getStakingPoolFromSlug } from '~/data/bitcoin-staking-data';

import { noop } from '@leather.io/utils';

import { usePox5Position } from '../../hooks/use-pox5-position';
import { type Pox5PayoutPreferenceResult } from '../../queries/create-get-pox5-payout-preference-query-options';
import { type Pox5PayoutPreference } from '../../transactions/pox5-signer-calldata';
import { type ActiveStakingDetails, useActiveStakingInfo } from './use-active-staking-info';

const { readPayoutPreference, payoutPreferenceQueryContractIds } = vi.hoisted(() => ({
  readPayoutPreference: vi.fn<() => Promise<Pox5PayoutPreferenceResult | null>>(),
  payoutPreferenceQueryContractIds: vi.fn<(signerManagerContractId: string | undefined) => void>(),
}));

vi.mock('../../hooks/use-pox5-position', () => ({
  usePox5Position: vi.fn(),
}));

vi.mock('../../hooks/use-pox5-cycle-clock', () => ({
  usePox5CycleClock() {
    return { isLoading: false, cycleClock: null };
  },
}));

vi.mock('../../queries/pox5-node.query', () => ({
  usePox5PoxInfoQuery() {
    return { data: undefined };
  },
  usePox5SecondsUntilNextCycleQuery() {
    return { data: undefined };
  },
}));

vi.mock('../../queries/pox5-stacking.query', () => ({
  usePox5ClaimableRewards() {
    return { isLoading: false, totalEarned: 0n, byCycle: [] };
  },
  usePox5PayoutPreferenceQuery(signerManagerContractId: string | undefined) {
    payoutPreferenceQueryContractIds(signerManagerContractId);
    return useQuery({
      queryKey: ['pox5-payout-preference', signerManagerContractId],
      queryFn: readPayoutPreference,
      enabled: signerManagerContractId !== undefined,
      retry: false,
    });
  },
}));

const btcPayoutPreference: Pox5PayoutPreference = {
  btcRewardAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
  maxFeeSats: 2500n,
  minClaimSats: 3047n,
};

function mockActivePosition(poolSlug: StakingPoolSlug) {
  vi.mocked(usePox5Position).mockReturnValue({
    isLoading: false,
    position: {
      status: 'active',
      info: {
        amountMicroStx: 1_000_000_000n,
        firstRewardCycle: 100,
        numCycles: 12,
        signerManagerContractId: 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.signer-manager',
      },
      pool: getStakingPoolFromSlug(poolSlug),
      pendingTx: null,
    },
  });
}

const unresolvedStatuses: ActiveStakingDetails['payoutPreferenceStatus'][] = ['pending', 'error'];

function mockPayoutPreferenceRead(
  status: ActiveStakingDetails['payoutPreferenceStatus'],
  preference: Pox5PayoutPreference | null = null
) {
  readPayoutPreference.mockImplementation(() => {
    if (status === 'pending') return new Promise(noop);
    if (status === 'error') return Promise.reject(new Error('read failed'));
    return Promise.resolve({ preference, supportsMinClaim: true });
  });
}

interface WrapperProps {
  children: ReactNode;
}

function renderActiveStakingInfo() {
  const queryClient = new QueryClient();
  function Wrapper({ children }: WrapperProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return renderHook(() => useActiveStakingInfo(), { wrapper: Wrapper });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe(useActiveStakingInfo.name, () => {
  test.each(unresolvedStatuses)('passes through a %s payout preference read', async status => {
    mockActivePosition('fast-pool');
    mockPayoutPreferenceRead(status);
    const { result } = renderActiveStakingInfo();
    await waitFor(() => expect(result.current.details?.payoutPreferenceStatus).toBe(status));
    expect(result.current.details?.payoutPreference).toBeNull();
  });

  test('passes through a successful payout preference read and its preference', async () => {
    mockActivePosition('fast-pool');
    mockPayoutPreferenceRead('success', btcPayoutPreference);
    const { result } = renderActiveStakingInfo();
    await waitFor(() => expect(result.current.details?.payoutPreferenceStatus).toBe('success'));
    expect(result.current.details?.payoutPreference).toEqual(btcPayoutPreference);
  });

  test('reports success for a pool that cannot pay in BTC, whose query is disabled', () => {
    mockActivePosition('stacking-dao');
    mockPayoutPreferenceRead('success', btcPayoutPreference);
    const { result } = renderActiveStakingInfo();
    expect(payoutPreferenceQueryContractIds).toHaveBeenCalledWith(undefined);
    expect(readPayoutPreference).not.toHaveBeenCalled();
    expect(result.current.details?.payoutPreferenceStatus).toBe('success');
    expect(result.current.details?.payoutPreference).toBeNull();
  });
});
