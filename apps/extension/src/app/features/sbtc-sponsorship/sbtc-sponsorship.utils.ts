import { AuthType, type StacksTransactionWire } from '@stacks/transactions';
import BigNumber from 'bignumber.js';

import { SBTC_ASSET_ID_MAINNET, SBTC_ASSET_ID_TESTNET } from '@leather.io/constants';
import {
  FeeTypes,
  type Money,
  type NetworkModes,
  type StacksTransactionFees,
} from '@leather.io/models';
import { LeatherApiError, type SponsorshipQuote } from '@leather.io/services';
import { getStacksAssetStringParts } from '@leather.io/stacks';
import { createMoney, isNumber, isString } from '@leather.io/utils';

export const sponsoredTransactionBroadcastError =
  'Sponsored transactions are submitted through the sponsor and cannot be broadcast by the wallet';

export const sbtcFeeSymbol = 'sBTC';
export const sbtcDecimals = 8;

const microStxPerStx = 1_000_000;

export function isSponsoredTransaction(tx: StacksTransactionWire) {
  return tx.auth.authType === AuthType.Sponsored;
}

function getSbtcAssetId(mode: NetworkModes) {
  return mode === 'mainnet' ? SBTC_ASSET_ID_MAINNET : SBTC_ASSET_ID_TESTNET;
}

export function getSbtcContract(mode: NetworkModes) {
  const { contractAddress, contractName, contractAssetName } = getStacksAssetStringParts(
    getSbtcAssetId(mode)
  );
  return {
    contractAddress,
    contractName,
    contractId: `${contractAddress}.${contractName}` as const,
    assetName: contractAssetName,
  };
}

export function isSbtcContractId(contractId: string, mode: NetworkModes) {
  return getSbtcContract(mode).contractId === contractId;
}

type SbtcFeeQuote = Pick<SponsorshipQuote, 'satsPerStx' | 'minFeeSats' | 'maxFeeSats'>;

interface ConvertStxFeeToSbtcFeeArgs {
  stxFeeMicro: BigNumber | number | string;
  quote: SbtcFeeQuote;
}
export function convertStxFeeToSbtcFeeSats({ stxFeeMicro, quote }: ConvertStxFeeToSbtcFeeArgs) {
  const sats = new BigNumber(stxFeeMicro)
    .multipliedBy(quote.satsPerStx)
    .dividedBy(microStxPerStx)
    .integerValue(BigNumber.ROUND_CEIL);
  return BigNumber.min(BigNumber.max(sats, quote.minFeeSats), quote.maxFeeSats).toNumber();
}

export function createSbtcMoney(sats: BigNumber | number | string): Money {
  return createMoney(new BigNumber(sats), sbtcFeeSymbol, sbtcDecimals);
}

export function getBalanceLessSbtcFee(balance: Money, fee: unknown): Money {
  const feeAmount = isNumber(fee) || isString(fee) ? new BigNumber(fee) : new BigNumber(NaN);
  if (!feeAmount.isFinite()) return balance;
  const remaining = balance.amount.minus(feeAmount.shiftedBy(balance.decimals));
  return createMoney(BigNumber.max(remaining, 0), balance.symbol, balance.decimals);
}

type StacksFeeTier = keyof StacksTransactionFees['options'];

const feeTierByFeeType: Record<string, StacksFeeTier> = {
  [FeeTypes[FeeTypes.Low]]: 'low',
  [FeeTypes[FeeTypes.Middle]]: 'standard',
  [FeeTypes[FeeTypes.High]]: 'high',
};

export function getStacksFeeTierForFeeType(feeType: string): StacksFeeTier {
  return feeTierByFeeType[feeType] ?? 'standard';
}

export function getStxFeeMicroForFeeType(fees: StacksTransactionFees, feeType: string) {
  return fees.options[getStacksFeeTierForFeeType(feeType)].value.amount;
}

export function createSbtcSponsoredFees(
  stxFees: StacksTransactionFees,
  quote: SbtcFeeQuote
): StacksTransactionFees {
  function toSbtcQuote<T extends StacksTransactionFees['options'][StacksFeeTier]>(feeQuote: T): T {
    return {
      ...feeQuote,
      value: createSbtcMoney(
        convertStxFeeToSbtcFeeSats({ stxFeeMicro: feeQuote.value.amount, quote })
      ),
    };
  }
  return {
    ...stxFees,
    options: {
      low: toSbtcQuote(stxFees.options.low),
      standard: toSbtcQuote(stxFees.options.standard),
      high: toSbtcQuote(stxFees.options.high),
    },
  };
}

export function isSbtcSponsorshipQuoteExpired(expiresAt: string, now = Date.now()) {
  const expiresAtMs = new Date(expiresAt).getTime();
  return Number.isNaN(expiresAtMs) || expiresAtMs <= now;
}

const sbtcSponsorshipErrorMessages: Record<string, string> = {
  quote_expired: 'The fee quote expired. Review the updated fee and confirm again.',
  not_eligible: 'This transfer is not eligible for a sponsored sBTC fee',
  stale_nonce: 'Your account nonce changed. Review the updated fee and confirm again.',
  broadcast_failed: 'The sponsor could not broadcast this transaction. Try again later.',
  upstream_unavailable: 'The sponsorship service is unavailable right now. Try again later.',
  rate_limited: 'Too many requests to the sponsorship service. Wait a moment and try again.',
};

const sbtcNotEligibleReasonMessages: Record<string, string> = {
  insufficient_sbtc: 'Your sBTC balance does not cover the amount plus the fee',
  bad_transfer_entry: 'The transfer does not match what the sponsor accepts',
  fee_too_low: 'The sBTC fee is below what the sponsor accepts. Review the fee and try again.',
  fee_too_high: 'The sBTC fee is above what the sponsor accepts. Review the fee and try again.',
  float_low: 'The sponsor cannot cover fees right now. Try again later.',
};

const sbtcSponsorshipRequoteErrorCodes = ['quote_expired', 'stale_nonce'];

const unknownSbtcSponsorshipError = 'The sponsored transfer could not be submitted';

function getLeatherApiErrorData(error: unknown) {
  if (error instanceof LeatherApiError) return error.data;
  return undefined;
}

export function isSbtcSponsorshipRequoteError(error: unknown) {
  const code = getLeatherApiErrorData(error)?.code;
  return code !== undefined && sbtcSponsorshipRequoteErrorCodes.includes(code);
}

export function getSbtcSponsorshipErrorMessage(error: unknown) {
  const data = getLeatherApiErrorData(error);
  if (data?.code === 'not_eligible' && data.reason) {
    return sbtcNotEligibleReasonMessages[data.reason] ?? sbtcSponsorshipErrorMessages.not_eligible;
  }
  if (data?.code && sbtcSponsorshipErrorMessages[data.code]) {
    return sbtcSponsorshipErrorMessages[data.code];
  }
  if (data?.error) return data.error;
  if (error instanceof Error && error.message) return error.message;
  return unknownSbtcSponsorshipError;
}
