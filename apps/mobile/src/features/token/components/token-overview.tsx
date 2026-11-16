import { TokenSelectors } from '@/shared/selectors/token.selectors';

import { Box, Text } from '@leather.io/ui/native';

interface TokenOverviewProps {
  actionButtons: React.ReactNode;
  heading: React.ReactNode;
  availableBalance: React.ReactNode;
  quoteBalance: React.ReactNode;
}

export function TokenOverview({
  actionButtons,
  heading,
  availableBalance,
  quoteBalance,
}: TokenOverviewProps) {
  return (
    <Box
      alignItems="center"
      alignContent="center"
      alignSelf="stretch"
      flexWrap="wrap"
      p="5"
      backgroundColor="ink.background-primary"
      testID={TokenSelectors.DetailsOverview}
    >
      <Box flexDirection="column" alignItems="center" gap="3" flex={1}>
        {heading}
        <Box gap="1" flexDirection="column" alignItems="center">
          <Text variant="label01" textAlign="center">
            {availableBalance}
          </Text>
          <Text variant="caption01" textAlign="center">
            {quoteBalance}
          </Text>
        </Box>
        <Box flexDirection="row" justifyContent="center" gap="2">
          {actionButtons}
        </Box>
      </Box>
    </Box>
  );
}
