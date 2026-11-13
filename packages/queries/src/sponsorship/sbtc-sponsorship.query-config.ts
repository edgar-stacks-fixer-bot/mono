import type {
  QueryFunctionContext,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

import {
  type SponsorshipQuote,
  type SponsorshipQuoteRequest,
  type SponsorshipSubmitRequest,
  type SponsorshipSubmitResult,
  getLeatherSponsorshipApiClient,
} from '@leather.io/services';
import { oneMinInMs } from '@leather.io/utils';

const sbtcSponsorshipQuoteStaleTime = 15_000;

export function createSbtcSponsorshipQuoteQueryKey({
  network,
  sender,
  nonce,
}: SponsorshipQuoteRequest) {
  return ['leather-sponsorship-api--sbtc-quote', network, sender, nonce] as const;
}

export function createSbtcSponsorshipQuoteQueryConfig(request: SponsorshipQuoteRequest) {
  return {
    queryKey: createSbtcSponsorshipQuoteQueryKey(request),
    queryFn: ({ signal }: QueryFunctionContext) =>
      getLeatherSponsorshipApiClient().fetchQuote(request, { signal }),
    staleTime: sbtcSponsorshipQuoteStaleTime,
    gcTime: oneMinInMs,
    retry: false,
    refetchOnWindowFocus: false,
    meta: { persist: false },
  } satisfies UseQueryOptions<SponsorshipQuote>;
}

export function createSubmitSbtcSponsoredTransactionMutationConfig() {
  return {
    mutationKey: ['leather-sponsorship-api--sbtc-submit'],
    mutationFn: (request: SponsorshipSubmitRequest) =>
      getLeatherSponsorshipApiClient().submit(request),
  } satisfies UseMutationOptions<SponsorshipSubmitResult, Error, SponsorshipSubmitRequest>;
}
