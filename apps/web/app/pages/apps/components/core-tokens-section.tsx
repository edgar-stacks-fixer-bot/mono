import { Box, Flex, Grid, styled } from 'leather-styles/jsx';
import { SectionHeading } from '~/components/section-heading';

import { type CoreToken, coreTokens } from '../apps.data';
import { MarketingAnchor } from './marketing-anchor';

interface CoreTokenDescriptionProps {
  token: CoreToken;
}
function CoreTokenDescription({ token }: CoreTokenDescriptionProps) {
  const { description, descriptionLink } = token;
  if (!descriptionLink) return <>{description}</>;
  const [before, after] = description.split(descriptionLink.label);
  return (
    <>
      {before}
      <MarketingAnchor href={descriptionLink.href} textDecoration="underline">
        {descriptionLink.label}
      </MarketingAnchor>
      {after}
    </>
  );
}

interface CoreTokenCardProps {
  token: CoreToken;
}
function CoreTokenCard({ token }: CoreTokenCardProps) {
  return (
    <Flex
      flexDir="column"
      gap="space.05"
      p="space.05"
      bg="ink.background-secondary"
      border="default"
      borderRadius="xs"
    >
      <Flex alignItems="center" gap="space.03">
        <styled.img
          src={token.iconSrc}
          alt=""
          width="40px"
          height="40px"
          borderRadius="round"
          objectFit="cover"
        />
        <Box flex={1}>
          <styled.p textStyle="label.02">{token.symbol}</styled.p>
          {token.name && (
            <styled.p textStyle="caption.01" color="ink.text-subdued">
              {token.name}
            </styled.p>
          )}
        </Box>
        <MarketingAnchor
          href={token.href}
          textStyle="label.03"
          px="space.04"
          py="space.02"
          border="default"
          borderColor="ink.text-primary"
          borderRadius="round"
          _hover={{ bg: 'ink.component-background-hover' }}
          aria-label={`${token.actionLabel} ${token.symbol}`}
        >
          {token.actionLabel}
        </MarketingAnchor>
      </Flex>
      <styled.p textStyle="caption.01" color="ink.text-subdued">
        <CoreTokenDescription token={token} />
      </styled.p>
    </Flex>
  );
}

export function CoreTokensSection() {
  return (
    <styled.section>
      <SectionHeading title="Core tokens" />
      <Grid gridTemplateColumns={['1fr', 'repeat(2, 1fr)', null, 'repeat(4, 1fr)']} gap="space.03">
        {coreTokens.map(token => (
          <CoreTokenCard key={token.symbol} token={token} />
        ))}
      </Grid>
    </styled.section>
  );
}
