import { useField } from 'formik';

import type { Money } from '@leather.io/models';
import { convertAmountToBaseUnit } from '@leather.io/utils';

import { getBalanceLessSbtcFee } from '@app/features/sbtc-sponsorship/sbtc-sponsorship.utils';

import { SendMaxButton } from '../../components/send-max-button';

interface SbtcSponsoredSendMaxButtonProps {
  balance: Money;
}
export function SbtcSponsoredSendMaxButton({ balance }: SbtcSponsoredSendMaxButtonProps) {
  const [feeField] = useField<unknown>('fee');
  const sendMaxBalance = convertAmountToBaseUnit(getBalanceLessSbtcFee(balance, feeField.value));

  return <SendMaxButton balance={balance} sendMaxBalance={sendMaxBalance.toString()} />;
}
