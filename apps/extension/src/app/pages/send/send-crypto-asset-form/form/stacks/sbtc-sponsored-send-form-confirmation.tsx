import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { deserializeTransaction } from '@stacks/transactions';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { getSbtcSponsoredTransferDetails } from '@leather.io/stacks';
import { Callout } from '@leather.io/ui';
import { sumMoney } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { formatCurrency } from '@app/common/currency-formatter';
import { useRouteState } from '@app/common/hooks/use-route-state';
import { Content, Page } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import {
  createSbtcMoney,
  getSbtcSponsorshipErrorMessage,
  isSbtcSponsorshipQuoteExpired,
  isSbtcSponsorshipRequoteError,
} from '@app/features/sbtc-sponsorship/sbtc-sponsorship.utils';
import {
  useFetchFreshSbtcSponsorshipQuote,
  useGenerateSbtcSponsoredTransferUnsignedTx,
  useSubmitSbtcSponsoredTransaction,
} from '@app/features/sbtc-sponsorship/use-sbtc-sponsorship';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

import {
  type StacksConfirmationRouteState,
  stacksConfirmationRouteStateSchema,
} from '../../hooks/use-send-form-navigate';
import { SendFormConfirmationLayout } from '../send-form-confirmation.layout';

export function SbtcSponsoredSendFormConfirmation() {
  const routeState = useRouteState(stacksConfirmationRouteStateSchema);
  const { tx: txHex, sponsorship, showRequoteCallout } = routeState;
  const { symbol = 'sBTC' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const signStacksTransaction = useSignStacksTransaction();
  const submitSponsoredTransaction = useSubmitSbtcSponsoredTransaction();
  const fetchFreshQuote = useFetchFreshSbtcSponsorshipQuote();
  const generateSponsoredTx = useGenerateSbtcSponsoredTransferUnsignedTx();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tx = deserializeTransaction(txHex);
  const details = getSbtcSponsoredTransferDetails(tx);

  if (!sponsorship || !details) return null;

  const amount = createSbtcMoney(details.amount.toString());
  const fee = createSbtcMoney(details.fee.toString());

  function navigateToError(error: unknown) {
    return navigate(RouteUrls.BroadcastError, {
      state: { message: getSbtcSponsorshipErrorMessage(error) },
    });
  }

  async function requote() {
    if (!sponsorship) return;
    const { quote, nonce } = await fetchFreshQuote();
    const requotedTx = await generateSponsoredTx({
      values: sponsorship.formValues,
      quote,
      stxFeeMicro: sponsorship.stxFeeMicro,
      nonce,
    });
    if (!requotedTx) throw new Error('Unable to rebuild the sponsored transaction');
    await navigate(location.pathname, {
      replace: true,
      state: {
        ...routeState,
        tx: requotedTx.serialize(),
        sponsorship: { ...sponsorship, quoteId: quote.quoteId, expiresAt: quote.expiresAt },
        showRequoteCallout: true,
      } satisfies StacksConfirmationRouteState,
    });
  }

  async function submit() {
    if (!sponsorship) return;
    if (isSbtcSponsorshipQuoteExpired(sponsorship.expiresAt)) return requote();

    const signedTx = await signStacksTransaction(tx);
    if (!signedTx) return;

    try {
      const result = await submitSponsoredTransaction.mutateAsync({
        quoteId: sponsorship.quoteId,
        transaction: signedTx.serialize(),
      });
      await navigate(
        RouteUrls.SentStxTxSummary.replace(':symbol', symbol.toLowerCase()).replace(
          ':txid',
          result.txid
        ),
        { state: { tx: result.transaction } }
      );
    } catch (error) {
      if (isSbtcSponsorshipRequoteError(error)) return requote();
      throw error;
    }
  }

  async function onConfirm() {
    setIsSubmitting(true);
    try {
      await submit();
    } catch (error) {
      logger.error('Failed to submit sponsored sBTC transfer', error);
      await navigateToError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Review" />
      <Content>
        <Page>
          <SendFormConfirmationLayout
            callout={
              showRequoteCallout ? (
                <Callout
                  data-testid={SendCryptoAssetSelectors.SbtcFeeRequoteCallout}
                  mb="space.05"
                  px="space.03"
                  title="Fee quote updated"
                  variant="info"
                >
                  The sponsor updated the sBTC fee. Review the new fee and confirm again.
                </Callout>
              ) : undefined
            }
            fee={fee}
            isLoading={isSubmitting}
            memoDisplayText={details.memo || 'No memo'}
            onBroadcastTransaction={() => void onConfirm()}
            recipient={details.recipient}
            sendingValue={formatCurrency(amount)}
            symbol={symbol.toUpperCase()}
            totalSpend={formatCurrency(sumMoney([amount, fee]))}
            txValue={amount}
          />
        </Page>
      </Content>
    </>
  );
}
