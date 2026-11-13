import { Box, Flex, styled } from 'leather-styles/jsx';
import { Page } from '~/layouts/page/page';
import { MarketingAnchor } from '~/pages/apps/components/marketing-anchor';

import { HelpLinks } from './components/help-links';
import { developerGuideLinks } from './developers.data';

export function DevelopersPage() {
  return (
    <Page>
      <Page.Header title="Developers" backTo="/" />
      <Flex
        flexDir={['column', 'column', 'row']}
        justifyContent="space-between"
        gap="space.05"
        my="space.07"
      >
        <styled.h2 textStyle="heading.03" maxW="400px">
          Everything you need to start building
        </styled.h2>
        <styled.p textStyle="body.02" maxW={[null, null, '50%']}>
          Whether you&apos;re just getting started or you&apos;re deep into development, you&apos;ll
          find everything you need right here. From quick-start guides to in-depth API references,
          this space is designed to help you ship faster and smarter.
        </styled.p>
      </Flex>
      <Box bg="black" overflow="hidden">
        <styled.img
          src="/marketing/developers/hero.png"
          alt=""
          width="2048px"
          height="366px"
          w="100%"
          h="auto"
        />
      </Box>
      <styled.section py="space.08">
        <styled.h2 textStyle="heading.04" mb="space.06">
          Start developing with Leather
        </styled.h2>
        <styled.ul display="flex" flexDir="column" gap="space.03">
          {developerGuideLinks.map(link => (
            <li key={link.href}>
              <MarketingAnchor
                href={link.href}
                textStyle="label.02"
                _hover={{ textDecoration: 'underline' }}
              >
                {link.label}
              </MarketingAnchor>
            </li>
          ))}
        </styled.ul>
      </styled.section>
      <Box mb="space.09">
        <HelpLinks />
      </Box>
    </Page>
  );
}
