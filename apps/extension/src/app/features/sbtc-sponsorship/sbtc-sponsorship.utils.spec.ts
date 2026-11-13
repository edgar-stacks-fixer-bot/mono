import BigNumber from 'bignumber.js';

import { FeeTypes, type StacksTransactionFees } from '@leather.io/models';
import { LeatherApiError } from '@leather.io/services';
import { createMoney } from '@leather.io/utils';

import {
  convertStxFeeToSbtcFeeSats,
  createSbtcSponsoredFees,
  getBalanceLessSbtcFee,
  getSbtcSponsorshipErrorMessage,
  getStacksFeeTierForFeeType,
  getStxFeeMicroForFeeType,
  isSbtcContractId,
  isSbtcSponsorshipQuoteExpired,
  isSbtcSponsorshipRequoteError,
} from './sbtc-sponsorship.utils';

const quote = { satsPerStx: '1500', minFeeSats: 100, maxFeeSats: 50_000 };

function createStacksFeeQuote(amount: number) {
  return {
    type: 'stacksFeeRate' as const,
    value: createMoney(amount, 'STX'),
    rate: 1,
    rateUnit: 'µSTX/byte' as const,
    estimatedTxSize: 200,
    sizeUnit: 'byte' as const,
  };
}

const stxFees: StacksTransactionFees = {
  chain: 'stacks',
  options: {
    low: createStacksFeeQuote(200_000),
    standard: createStacksFeeQuote(400_000),
    high: createStacksFeeQuote(901_000),
  },
  minimumFee: createMoney(200_000, 'STX'),
  highFeeThreshold: createMoney(5_000_000, 'STX'),
};

function createSponsorshipError(code: string, reason?: string) {
  return new LeatherApiError('https://api.leather.io/v1/sponsorship/submit', 409, 'Conflict', {
    error: 'Sponsorship error',
    code,
    reason,
  });
}

describe(convertStxFeeToSbtcFeeSats.name, () => {
  test('converts micro-STX to sats at the quote rate and rounds up', () => {
    expect(convertStxFeeToSbtcFeeSats({ stxFeeMicro: 400_001, quote })).toEqual(601);
  });

  test('accepts the fee as a string', () => {
    expect(convertStxFeeToSbtcFeeSats({ stxFeeMicro: '400000', quote })).toEqual(600);
  });

  test('accepts the fee as a BigNumber', () => {
    expect(convertStxFeeToSbtcFeeSats({ stxFeeMicro: new BigNumber(1_000_000), quote })).toEqual(
      1500
    );
  });

  test('clamps to the minimum fee', () => {
    expect(convertStxFeeToSbtcFeeSats({ stxFeeMicro: 10, quote })).toEqual(100);
  });

  test('clamps to the maximum fee', () => {
    expect(convertStxFeeToSbtcFeeSats({ stxFeeMicro: 900_000_000, quote })).toEqual(50_000);
  });
});

describe(getStacksFeeTierForFeeType.name, () => {
  test('maps each fee type to its tier', () => {
    expect(getStacksFeeTierForFeeType(FeeTypes[FeeTypes.Low])).toEqual('low');
    expect(getStacksFeeTierForFeeType(FeeTypes[FeeTypes.Middle])).toEqual('standard');
    expect(getStacksFeeTierForFeeType(FeeTypes[FeeTypes.High])).toEqual('high');
  });

  test('falls back to standard', () => {
    expect(getStacksFeeTierForFeeType(FeeTypes[FeeTypes.Unknown])).toEqual('standard');
    expect(getStacksFeeTierForFeeType(FeeTypes[FeeTypes.Custom])).toEqual('standard');
  });
});

describe(getStxFeeMicroForFeeType.name, () => {
  test('returns the STX fee of the selected tier', () => {
    expect(getStxFeeMicroForFeeType(stxFees, FeeTypes[FeeTypes.High]).toNumber()).toEqual(901_000);
  });
});

describe(createSbtcSponsoredFees.name, () => {
  test('converts every tier to an sBTC fee', () => {
    const fees = createSbtcSponsoredFees(stxFees, quote);

    expect(fees.options.low.value.symbol).toEqual('sBTC');
    expect(fees.options.low.value.decimals).toEqual(8);
    expect(fees.options.low.value.amount.toNumber()).toEqual(300);
    expect(fees.options.standard.value.amount.toNumber()).toEqual(600);
    expect(fees.options.high.value.amount.toNumber()).toEqual(1352);
  });
});

describe(getBalanceLessSbtcFee.name, () => {
  const balance = createMoney(50_000_000, 'sBTC', 8);

  test('subtracts the selected sBTC fee from the balance', () => {
    expect(getBalanceLessSbtcFee(balance, '0.00000600').amount.toNumber()).toEqual(49_999_400);
  });

  test('keeps the balance when no fee is selected yet', () => {
    expect(getBalanceLessSbtcFee(balance, '').amount.toNumber()).toEqual(50_000_000);
  });

  test('does not go below zero', () => {
    expect(getBalanceLessSbtcFee(balance, 1).amount.toNumber()).toEqual(0);
  });
});

describe(isSbtcSponsorshipQuoteExpired.name, () => {
  const now = new Date('2026-11-13T12:00:00.000Z').getTime();

  test('is expired once the expiry has passed', () => {
    expect(isSbtcSponsorshipQuoteExpired('2026-11-13T11:59:59.000Z', now)).toBe(true);
  });

  test('is not expired before the expiry', () => {
    expect(isSbtcSponsorshipQuoteExpired('2026-11-13T12:00:30.000Z', now)).toBe(false);
  });

  test('treats an unreadable expiry as expired', () => {
    expect(isSbtcSponsorshipQuoteExpired('not a date', now)).toBe(true);
  });
});

describe(isSbtcContractId.name, () => {
  test('matches the sBTC contract of the network', () => {
    expect(
      isSbtcContractId('SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token', 'mainnet')
    ).toBe(true);
    expect(
      isSbtcContractId('SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token', 'testnet')
    ).toBe(false);
  });
});

describe(isSbtcSponsorshipRequoteError.name, () => {
  test('re-quotes on an expired quote or a stale nonce', () => {
    expect(isSbtcSponsorshipRequoteError(createSponsorshipError('quote_expired'))).toBe(true);
    expect(isSbtcSponsorshipRequoteError(createSponsorshipError('stale_nonce'))).toBe(true);
  });

  test('does not re-quote on other errors', () => {
    expect(isSbtcSponsorshipRequoteError(createSponsorshipError('rate_limited'))).toBe(false);
    expect(isSbtcSponsorshipRequoteError(new Error('boom'))).toBe(false);
  });
});

describe(getSbtcSponsorshipErrorMessage.name, () => {
  test('maps an error code to user copy', () => {
    expect(getSbtcSponsorshipErrorMessage(createSponsorshipError('rate_limited'))).toEqual(
      'Too many requests to the sponsorship service. Wait a moment and try again.'
    );
  });

  test('maps a not eligible reason to user copy', () => {
    expect(
      getSbtcSponsorshipErrorMessage(createSponsorshipError('not_eligible', 'insufficient_sbtc'))
    ).toEqual('Your sBTC balance does not cover the amount plus the fee');
  });

  test('falls back to the not eligible copy for an unknown reason', () => {
    expect(
      getSbtcSponsorshipErrorMessage(createSponsorshipError('not_eligible', 'something_else'))
    ).toEqual('This transfer is not eligible for a sponsored sBTC fee');
  });

  test('falls back to the error message', () => {
    expect(getSbtcSponsorshipErrorMessage(new Error('Network down'))).toEqual('Network down');
  });
});
