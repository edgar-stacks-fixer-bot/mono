import { useCallback, useMemo } from 'react';

import { PostConditionMode, serializeCV } from '@stacks/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import type { NetworkModes, StacksTransactionFees } from '@leather.io/models';
import {
  createSbtcSponsorshipQuoteQueryConfig,
  createSubmitSbtcSponsoredTransactionMutationConfig,
} from '@leather.io/queries';
import type { SponsorshipQuote, SponsorshipQuoteRequest } from '@leather.io/services';
import {
  TransactionTypes,
  buildSbtcSponsoredTransferPostCondition,
  buildSbtcTransferManyArgs,
  generateStacksUnsignedTransaction,
} from '@leather.io/stacks';
import { createMoney, unitToFractionalUnit } from '@leather.io/utils';

import { logger } from '@shared/logger';

import { useStxAccountBalanceByAddresses } from '@app/query/stacks/balance/stx-balance.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountAddresses } from '@app/services/accounts/use-account-addresses';
import {
  useCurrentStacksAccount,
  useCurrentStacksAccountAddress,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import {
  useCurrentNetworkState,
  useCurrentStacksNetworkState,
} from '@app/store/networks/networks.hooks';
import { useCurrentPolicy } from '@app/store/policy/policy.selectors';

import {
  convertStxFeeToSbtcFeeSats,
  createSbtcSponsoredFees,
  getSbtcContract,
  isSbtcContractId,
  sbtcDecimals,
} from './sbtc-sponsorship.utils';

function useSbtcSponsorshipNetworkMode(): NetworkModes {
  const { isTestnet } = useCurrentNetworkState();
  return isTestnet ? 'testnet' : 'mainnet';
}

type SbtcSponsorshipState =
  | { status: 'loading' }
  | { status: 'stx' }
  | {
      status: 'sbtc';
      quote: SponsorshipQuote;
      nonce: number;
      stxFees: StacksTransactionFees;
      sbtcFees: StacksTransactionFees;
    };

interface UseSbtcSponsorshipArgs {
  contractId: string;
  stxFees?: StacksTransactionFees;
}
export function useSbtcSponsorship({
  contractId,
  stxFees,
}: UseSbtcSponsorshipArgs): SbtcSponsorshipState {
  const mode = useSbtcSponsorshipNetworkMode();
  const policy = useCurrentPolicy();
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: nextNonce } = useNextNonce(stxAddress);
  const stxBalance = useStxAccountBalanceByAddresses(useCurrentAccountAddresses());

  const isEligibleAsset = isSbtcContractId(contractId, mode) && policy?.chain !== 'stacks';
  const availableStx = stxBalance.value?.stx.availableUnlockedBalance;
  const needsSponsorship =
    isEligibleAsset &&
    !!availableStx &&
    !!stxFees &&
    availableStx.amount.isLessThan(stxFees.options.low.value.amount);

  const quoteNonce = needsSponsorship && stxAddress ? nextNonce?.nonce : undefined;
  const quoteRequest: SponsorshipQuoteRequest = {
    network: mode,
    sender: stxAddress,
    nonce: quoteNonce ?? 0,
  };

  const quoteQuery = useQuery({
    ...createSbtcSponsorshipQuoteQueryConfig(quoteRequest),
    enabled: quoteNonce !== undefined,
  });

  return useMemo((): SbtcSponsorshipState => {
    if (!isEligibleAsset) return { status: 'stx' };
    if (stxBalance.state === 'error') return { status: 'stx' };
    if (stxBalance.state !== 'success' || !stxFees) return { status: 'loading' };
    if (!needsSponsorship) return { status: 'stx' };
    if (quoteQuery.isError) {
      logger.error('Unable to fetch an sBTC sponsorship quote', quoteQuery.error);
      return { status: 'stx' };
    }
    if (quoteNonce === undefined || !quoteQuery.data) return { status: 'loading' };
    return {
      status: 'sbtc',
      quote: quoteQuery.data,
      nonce: quoteNonce,
      stxFees,
      sbtcFees: createSbtcSponsoredFees(stxFees, quoteQuery.data),
    };
  }, [
    isEligibleAsset,
    needsSponsorship,
    quoteQuery.data,
    quoteQuery.error,
    quoteQuery.isError,
    quoteNonce,
    stxBalance.state,
    stxFees,
  ]);
}

export function useFetchFreshSbtcSponsorshipQuote() {
  const queryClient = useQueryClient();
  const mode = useSbtcSponsorshipNetworkMode();
  const stxAddress = useCurrentStacksAccountAddress();
  const { refetch: refetchNextNonce } = useNextNonce(stxAddress);

  return useCallback(async () => {
    const { data: nextNonce } = await refetchNextNonce();
    if (nextNonce?.nonce === undefined) throw new Error('Unable to read the account nonce');
    const request = { network: mode, sender: stxAddress, nonce: nextNonce.nonce };
    const quote = await queryClient.fetchQuery({
      ...createSbtcSponsorshipQuoteQueryConfig(request),
      staleTime: 0,
    });
    return { quote, nonce: request.nonce };
  }, [mode, queryClient, refetchNextNonce, stxAddress]);
}

interface SbtcSponsoredTransferValues {
  amount: number | string;
  recipient: string;
  memo: string;
}

interface GenerateSbtcSponsoredTransferArgs {
  values: SbtcSponsoredTransferValues;
  quote: Pick<
    SponsorshipQuote,
    'feeRecipientPrincipal' | 'satsPerStx' | 'minFeeSats' | 'maxFeeSats'
  >;
  stxFeeMicro: BigNumber | string;
  nonce: number;
}
export function useGenerateSbtcSponsoredTransferUnsignedTx() {
  const account = useCurrentStacksAccount();
  const network = useCurrentStacksNetworkState();
  const mode = useSbtcSponsorshipNetworkMode();

  return useCallback(
    async ({ values, quote, stxFeeMicro, nonce }: GenerateSbtcSponsoredTransferArgs) => {
      if (!account) return;
      try {
        const { contractAddress, contractName, contractId, assetName } = getSbtcContract(mode);
        const amount = unitToFractionalUnit(sbtcDecimals)(values.amount).toString(10);
        const fee = convertStxFeeToSbtcFeeSats({ stxFeeMicro, quote });

        return await generateStacksUnsignedTransaction({
          txType: TransactionTypes.ContractCall,
          contractAddress,
          contractName,
          functionName: 'transfer-many',
          functionArgs: buildSbtcTransferManyArgs({
            sender: account.address,
            recipient: values.recipient,
            amount,
            memo: values.memo || undefined,
            feeRecipient: quote.feeRecipientPrincipal,
            fee,
          }).map(arg => serializeCV(arg)),
          postConditions: [
            buildSbtcSponsoredTransferPostCondition({
              sender: account.address,
              amount,
              fee,
              contractId,
              assetName,
            }),
          ],
          postConditionMode: PostConditionMode.Deny,
          network,
          publicKey: account.stxPublicKey,
          fee: createMoney(new BigNumber(stxFeeMicro), 'STX'),
          nonce,
          sponsored: true,
        });
      } catch (error) {
        logger.error('Failed to generate sponsored sBTC transfer', error);
        return;
      }
    },
    [account, mode, network]
  );
}

export function useSubmitSbtcSponsoredTransaction() {
  return useMutation(createSubmitSbtcSponsoredTransactionMutationConfig());
}
