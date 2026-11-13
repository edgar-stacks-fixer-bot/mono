import { Link } from 'react-router';

import { Box, Flex, Grid, styled } from 'leather-styles/jsx';

import { ArrowTopRightIcon } from '@leather.io/ui';

import { type EarnOption, type YieldProduct, earnOptions } from '../home.data';
import { HomeSection, HomeSectionTitle } from './home-section';

interface ProviderTableProps {
  product: YieldProduct;
}

function ProviderTable({ product }: ProviderTableProps) {
  return (
    <Box px={['space.05', 'space.05', 'space.06']} py="space.06">
      <styled.h4 textStyle="label.01" color="ink.text-primary">
        {product.title}
      </styled.h4>
      <styled.p textStyle="body.02" color="ink.text-subdued" mt="space.02" maxW="440px">
        {product.description}
      </styled.p>
      <styled.table width="100%" mt="space.06" textStyle="body.02" borderCollapse="collapse">
        <thead>
          <styled.tr color="ink.text-non-interactive">
            <styled.th textAlign="left" fontWeight="normal" pb="space.03">
              Providers
            </styled.th>
            <styled.th textAlign="right" fontWeight="normal" pb="space.03">
              Historical yield
            </styled.th>
          </styled.tr>
        </thead>
        <tbody>
          {product.providers.map(provider => (
            <styled.tr
              key={provider.name}
              borderTopWidth="1px"
              borderTopStyle="solid"
              borderTopColor="ink.border-default"
              _first={{ borderTopWidth: 0 }}
            >
              <styled.td py="space.03">
                <Flex alignItems="center" gap="space.03">
                  <styled.img
                    src={provider.logo}
                    alt=""
                    width="32px"
                    height="32px"
                    borderRadius="xs"
                    objectFit="cover"
                  />
                  {provider.name}
                </Flex>
              </styled.td>
              <styled.td py="space.03" textAlign="right">
                {provider.yield}
              </styled.td>
            </styled.tr>
          ))}
        </tbody>
      </styled.table>
    </Box>
  );
}

interface EarnCardProps {
  option: EarnOption;
}

function EarnCard({ option }: EarnCardProps) {
  return (
    <Box
      border="1px solid"
      borderColor="ink.border-default"
      borderRadius="md"
      overflow="hidden"
      bg="ink.background-secondary"
    >
      <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']} bg="ink.background-primary">
        <Flex
          flexDir="column"
          justifyContent="space-between"
          gap="space.07"
          p={['space.05', 'space.05', 'space.06']}
        >
          <Flex alignItems="center" gap="space.03">
            <styled.img
              src={option.icon}
              alt=""
              width="40px"
              height="40px"
              borderRadius="xs"
              objectFit="cover"
            />
            <styled.h3 textStyle="heading.04">{option.name}</styled.h3>
          </Flex>
          <Link to={option.href}>
            <styled.span
              display="inline-flex"
              alignItems="center"
              gap="space.02"
              height="40px"
              px="space.04"
              borderRadius="round"
              bg="ink.action-primary-default"
              color="ink.background-primary"
              textStyle="label.02"
              _hover={{ bg: 'ink.action-primary-hover' }}
            >
              {option.cta}
              <ArrowTopRightIcon variant="small" color="ink.background-primary" />
            </styled.span>
          </Link>
        </Flex>
        <Flex
          flexDir="column"
          justifyContent="space-between"
          gap="space.06"
          p={['space.05', 'space.05', 'space.06']}
          minH="200px"
          color="black"
          bgGradient="to-br"
          gradientFrom="#F7931A"
          gradientTo="#FF5F2E"
        >
          <styled.p fontSize={['3rem', '3rem', '4rem']} lineHeight="1" fontWeight={500}>
            {option.headlineYield}
          </styled.p>
          <styled.p textStyle="caption.01" maxW="120px">
            Based on avg. past yearly rewards
          </styled.p>
        </Flex>
      </Grid>
      {option.products.map(product => (
        <ProviderTable key={product.title} product={product} />
      ))}
    </Box>
  );
}

export function EarnSection() {
  return (
    <HomeSection>
      <Grid
        gridTemplateColumns={['1fr', '1fr', '1fr 2fr']}
        gap={['space.06', 'space.06', 'space.07']}
      >
        <Box position={[null, null, 'sticky']} top="space.07" alignSelf="start">
          <HomeSectionTitle lines={['The best providers,', 'in one place.']} />
          <styled.p textStyle="label.01" color="ink.text-primary" mt="space.04" maxW="320px">
            We’ve aggregated the best for you, so your assets work harder with full transparency and
            steady yields over time.
          </styled.p>
        </Box>
        <Flex flexDir="column" gap="space.06">
          {earnOptions.map(option => (
            <EarnCard key={option.name} option={option} />
          ))}
        </Flex>
      </Grid>
    </HomeSection>
  );
}
