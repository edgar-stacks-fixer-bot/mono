import { useMemo } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import BigNumber from 'bignumber.js';
import { useField } from 'formik';

import type { MarketData, StacksTransactionFees } from '@leather.io/models';
import { Badge } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, createMoney, isNumber, isString } from '@leather.io/utils';

import { FeesRow } from '@app/components/fees-row/fees-row';

import { sbtcDecimals, sbtcFeeSymbol } from './sbtc-sponsorship.utils';

interface SbtcSponsoredFeesRowProps {
  fees: StacksTransactionFees;
  marketData?: MarketData;
}
export function SbtcSponsoredFeesRow({ fees, marketData }: SbtcSponsoredFeesRowProps) {
  const [feeField] = useField<unknown>('fee');

  const feeFiatValue = useMemo(() => {
    if (!marketData || (!isNumber(feeField.value) && !isString(feeField.value))) return null;
    const fee = new BigNumber(feeField.value);
    if (!fee.isFinite()) return null;
    return baseCurrencyAmountInQuote(
      createMoney(fee.shiftedBy(sbtcDecimals), marketData.pair.base, sbtcDecimals),
      marketData
    );
  }, [feeField.value, marketData]);

  return (
    <FeesRow
      allowCustom={false}
      feeBadge={
        <Badge
          data-testid={SharedComponentsSelectors.SponsoredFeeBadge}
          label="Sponsored"
          ml="space.02"
          variant="info"
        />
      }
      feeCurrency={sbtcFeeSymbol}
      feeFiatValue={feeFiatValue}
      fees={fees}
      isSponsored={false}
    />
  );
}
