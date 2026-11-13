import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { EM_DASH } from '~/constants/constants';
import { type StakingPoolSlug, getStakingPoolFromSlug } from '~/data/bitcoin-staking-data';

import { type Pox5StakerInfo } from '../../queries/create-get-pox5-staker-info-query-options';
import { type Pox5PayoutPreference } from '../../transactions/pox5-signer-calldata';
import { type ActiveStakingDetails } from '../hooks/use-active-staking-info';
import { StakingPositionGrid } from './staking-position-grid';

vi.mock('./staking-action-buttons', () => ({
  StakingActionButtons() {
    return null;
  },
}));

vi.mock('../../components/pool-tvl-value', () => ({
  PoolTvlValue() {
    return null;
  },
}));

const btcRewardAddress = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';

const btcPayoutPreference: Pox5PayoutPreference = {
  btcRewardAddress,
  maxFeeSats: 2500n,
  minClaimSats: 3047n,
};

const info: Pox5StakerInfo = {
  amountMicroStx: 1_000_000_000n,
  firstRewardCycle: 100,
  numCycles: 12,
  signerManagerContractId: 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.fastpool-1-signer-manager',
};

const unresolvedStatuses: ActiveStakingDetails['payoutPreferenceStatus'][] = ['pending', 'error'];

function makeDetails(
  payoutPreferenceStatus: ActiveStakingDetails['payoutPreferenceStatus'],
  payoutPreference: Pox5PayoutPreference | null = null
): ActiveStakingDetails {
  return {
    endCycle: 112,
    unlockDate: null,
    isInPreparePhase: false,
    secondsUntilStakingReopens: 0,
    nextCycleNumber: null,
    daysUntilNextCycle: null,
    claimable: { isLoading: false, totalEarned: 0n, byCycle: [] },
    payoutPreference,
    payoutPreferenceStatus,
  };
}

function renderGrid(poolSlug: StakingPoolSlug, details: ActiveStakingDetails) {
  render(
    <StakingPositionGrid
      poolSlug={poolSlug}
      pool={getStakingPoolFromSlug(poolSlug)}
      info={info}
      details={details}
    />
  );
}

function getCellValue(name: string) {
  return screen.getByText(name).nextElementSibling?.textContent;
}

afterEach(() => {
  cleanup();
});

describe(StakingPositionGrid.name, () => {
  test('shows BTC and the payout address for a Fast Pool BTC election', () => {
    renderGrid('fast-pool', makeDetails('success', btcPayoutPreference));
    expect(getCellValue('Rewards token')).toBe('BTC');
    expect(getCellValue('Rewards payout')).toBe(btcRewardAddress);
  });

  test.each(unresolvedStatuses)(
    'shows a dash in both cells for Fast Pool while the payout read is %s',
    status => {
      renderGrid('fast-pool', makeDetails(status));
      expect(getCellValue('Rewards token')).toBe(EM_DASH);
      expect(getCellValue('Rewards payout')).toBe(EM_DASH);
    }
  );

  test('shows sBTC on Stacks for Fast Pool after a successful empty read', () => {
    renderGrid('fast-pool', makeDetails('success'));
    expect(getCellValue('Rewards token')).toBe('sBTC');
    expect(getCellValue('Rewards payout')).toBe('sBTC on Stacks');
  });

  test('shows BTC and a dash for PlanBetter while the payout read is pending', () => {
    renderGrid('planbetter', makeDetails('pending'));
    expect(getCellValue('Rewards token')).toBe('BTC');
    expect(getCellValue('Rewards payout')).toBe(EM_DASH);
  });

  test('shows BTC and the payout address for PlanBetter once the read has a preference', () => {
    renderGrid('planbetter', makeDetails('success', btcPayoutPreference));
    expect(getCellValue('Rewards token')).toBe('BTC');
    expect(getCellValue('Rewards payout')).toBe(btcRewardAddress);
  });
});
