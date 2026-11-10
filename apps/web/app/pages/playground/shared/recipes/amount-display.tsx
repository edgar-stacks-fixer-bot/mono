import { Flex, styled } from 'leather-styles/jsx';

type AmountDisplaySize = 'large' | 'medium';

interface AmountDisplayProps {
  amount: string;
  symbol: string;
  fiat?: string;
  size?: AmountDisplaySize;
  align?: 'start' | 'center';
}

export function AmountDisplay({
  amount,
  symbol,
  fiat,
  size = 'large',
  align = 'center',
}: AmountDisplayProps) {
  return (
    <Flex
      direction="column"
      gap="space.01"
      alignItems={align === 'center' ? 'center' : 'flex-start'}
      data-amount-display
    >
      <styled.span
        textStyle={size === 'large' ? 'heading.02' : 'label.01'}
        color="ink.text-primary"
        fontVariantNumeric="tabular-nums"
      >
        {`${amount} ${symbol}`}
      </styled.span>
      {fiat ? (
        <styled.span
          textStyle="caption.01"
          color="ink.text-subdued"
          fontVariantNumeric="tabular-nums"
        >
          {fiat}
        </styled.span>
      ) : null}
    </Flex>
  );
}
