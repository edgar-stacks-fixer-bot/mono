import { Box, Flex, Grid, styled } from 'leather-styles/jsx';
import { SectionHeading } from '~/components/section-heading';

import { type StakingOption, dualStacking, stakingOptions } from '../apps.data';
import { MarketingAnchor } from './marketing-anchor';

function DualStackingCard() {
  return (
    <MarketingAnchor
      href={dualStacking.href}
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      border="default"
      borderRadius="xs"
      overflow="hidden"
      gridColumn={[null, null, null, 'span 2']}
      _hover={{ bg: 'ink.component-background-hover' }}
    >
      <Box p="space.05">
        <styled.h3 textStyle="heading.05">{dualStacking.title}</styled.h3>
        <styled.p textStyle="label.02" mt="space.04">
          {dualStacking.yieldLabel}
        </styled.p>
        <styled.p textStyle="caption.01" color="ink.text-subdued" mt="space.01">
          {dualStacking.description}
        </styled.p>
        <styled.span
          display="inline-block"
          mt="space.05"
          textStyle="label.03"
          px="space.04"
          py="space.02"
          bg="ink.text-primary"
          color="ink.background-primary"
          borderRadius="round"
        >
          {dualStacking.actionLabel}
        </styled.span>
      </Box>
      <styled.img
        src={dualStacking.imageSrc}
        alt=""
        width="414px"
        height="217px"
        alignSelf="flex-end"
        maxW="100%"
        h="auto"
      />
    </MarketingAnchor>
  );
}

interface StakingOptionCardProps {
  option: StakingOption;
}
function StakingOptionCard({ option }: StakingOptionCardProps) {
  return (
    <MarketingAnchor
      href={option.href}
      display="flex"
      flexDir="column"
      p="space.05"
      border="default"
      borderRadius="xs"
      _hover={{ bg: 'ink.component-background-hover' }}
    >
      <styled.h3 textStyle="heading.05">{option.title}</styled.h3>
      <styled.p textStyle="caption.01" color="ink.text-subdued" mt="space.04">
        {option.description}
      </styled.p>
      <Flex
        justifyContent="space-between"
        textStyle="caption.01"
        color="ink.text-subdued"
        mt="space.06"
        pb="space.03"
        borderBottom="default"
      >
        <styled.span>Providers</styled.span>
        <styled.span>Historical yield</styled.span>
      </Flex>
      <styled.ul>
        {option.providers.map(provider => (
          <Flex
            as="li"
            key={provider.name}
            alignItems="center"
            gap="space.03"
            py="space.03"
            borderBottom="default"
            textStyle="caption.01"
          >
            <styled.img
              src={provider.iconSrc}
              alt=""
              width="24px"
              height="24px"
              borderRadius="xs"
            />
            <styled.span flex={1}>{provider.name}</styled.span>
            <styled.span>{provider.historicalYield}</styled.span>
          </Flex>
        ))}
      </styled.ul>
    </MarketingAnchor>
  );
}

export function EarningSection() {
  return (
    <styled.section>
      <SectionHeading title="Earning on Stacks" />
      <Grid gridTemplateColumns={['1fr', null, 'repeat(2, 1fr)', 'repeat(4, 1fr)']} gap="space.03">
        <DualStackingCard />
        {stakingOptions.map(option => (
          <StakingOptionCard key={option.title} option={option} />
        ))}
      </Grid>
    </styled.section>
  );
}
