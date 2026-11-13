import { useMemo } from 'react';

import { type FormikHelpers } from 'formik';
import { z } from 'zod';

import type { CryptoAssetBalance, Sip10Asset } from '@leather.io/models';
import { convertAmountToBaseUnit } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { type StacksSendFormValues } from '@shared/models/form.model';

import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { createFormikValidationSchema } from '@app/common/validation/formik-validation-schema';
import { stacksFungibleTokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import {
  getBalanceLessSbtcFee,
  getStxFeeMicroForFeeType,
} from '@app/features/sbtc-sponsorship/sbtc-sponsorship.utils';
import {
  useGenerateSbtcSponsoredTransferUnsignedTx,
  useSbtcSponsorship,
} from '@app/features/sbtc-sponsorship/use-sbtc-sponsorship';
import { useStacksTransactionFees } from '@app/query/stacks/fees/stacks-transaction-fees.hooks';
import { useCurrentPolicy } from '@app/store/policy/policy.selectors';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { useStacksCommonSendForm } from '../../family/stacks/use-stacks-common-send-form';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

const sbtcFeeValueSchema = z.object({ fee: z.unknown() });

interface UseSip10SendFormArgs {
  balance: CryptoAssetBalance;
  info: Sip10Asset;
}
export function useSip10SendForm({ balance, info }: UseSip10SendFormArgs) {
  const generateTx = useGenerateFtTokenTransferUnsignedTx(info);
  const policy = useCurrentPolicy();

  const sendFormNavigate = useSendFormNavigate();

  const unsignedTx = useFtTokenTransferUnsignedTx(info);
  const { data: stacksFtFees } = useStacksTransactionFees(
    unsignedTx,
    policy?.chain === 'stacks' ? policy.publicKeys.length : undefined
  );

  const sbtcSponsorship = useSbtcSponsorship({
    contractId: info.contractId,
    stxFees: stacksFtFees,
  });
  const generateSbtcSponsoredTx = useGenerateSbtcSponsoredTransferUnsignedTx();
  const isSbtcSponsored = sbtcSponsorship.status === 'sbtc';

  const availableTokenBalance = balance.availableBalance;
  const sendMaxBalance = useMemo(
    () => convertAmountToBaseUnit(availableTokenBalance),
    [availableTokenBalance]
  );

  const { initialValues, checkFormValidation, recipient, memo, nonce } = useStacksCommonSendForm({
    symbol: info.symbol,
    availableTokenBalance,
  });

  function createFtAvatar() {
    return {
      avatar: info.contractId,
      imageCanonicalUri: getSafeImageCanonicalUri(info.imageCanonicalUri, info.name),
    };
  }

  return {
    availableTokenBalance,
    initialValues,
    sendMaxBalance,
    stacksFtFees,
    sbtcSponsorship,
    symbol: info.symbol,
    decimals: info.decimals,
    avatar: createFtAvatar(),
    validationSchema: createFormikValidationSchema(values =>
      z.object({
        amount: stacksFungibleTokenAmountValidator(
          isSbtcSponsored
            ? getBalanceLessSbtcFee(
                availableTokenBalance,
                sbtcFeeValueSchema.safeParse(values).data?.fee
              )
            : availableTokenBalance
        ),
        recipient,
        memo,
        nonce,
      })
    ),

    async previewTransaction(
      values: StacksSendFormValues,
      formikHelpers: FormikHelpers<StacksSendFormValues>
    ) {
      const isFormValid = await checkFormValidation(values, formikHelpers);
      if (!isFormValid) return;

      if (sbtcSponsorship.status === 'sbtc') {
        const { quote, nonce: quoteNonce, stxFees } = sbtcSponsorship;
        const stxFeeMicro = getStxFeeMicroForFeeType(stxFees, values.feeType);
        const sponsoredTx = await generateSbtcSponsoredTx({
          values,
          quote,
          stxFeeMicro,
          nonce: quoteNonce,
        });
        if (!sponsoredTx)
          return logger.error('Attempted to generate sponsored sBTC tx, but tx is undefined');

        void sendFormNavigate.toConfirmAndSignStacksSip10Transaction({
          decimals: info.decimals,
          name: info.name,
          tx: sponsoredTx,
          sponsorship: {
            quoteId: quote.quoteId,
            stxFeeMicro: stxFeeMicro.toString(),
            expiresAt: quote.expiresAt,
            assetId: info.assetId,
            formValues: {
              amount: values.amount,
              recipient: values.recipient,
              memo: values.memo,
              feeType: values.feeType,
            },
          },
        });
        return;
      }

      const tx = await generateTx(values);
      if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      void sendFormNavigate.toConfirmAndSignStacksSip10Transaction({
        decimals: info.decimals,
        name: info.name,
        tx,
      });
    },
  };
}
