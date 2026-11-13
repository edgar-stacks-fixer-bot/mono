import { Box, Flex, styled } from 'leather-styles/jsx';
import { explorerFeaturedApps } from '~/pages/apps/apps.data';
import { FeaturedAppsCarousel } from '~/pages/apps/components/featured-apps-carousel';
import { MarketingAnchor } from '~/pages/apps/components/marketing-anchor';

import { Tabs } from '@leather.io/ui';

import {
  type ExplorerApp,
  defaultExplorerTabId,
  explorerAppTabs,
  explorerDisclaimer,
  explorerHero,
} from './explorer.data';

interface ExplorerAppRowProps {
  app: ExplorerApp;
}
function ExplorerAppRow({ app }: ExplorerAppRowProps) {
  return (
    <Flex as="li" alignItems="center" gap="space.03" py="space.04">
      <styled.img src={app.iconSrc} alt="" width="40px" height="40px" />
      <styled.span textStyle="label.02" flex={1}>
        {app.name}
      </styled.span>
      <MarketingAnchor
        href={app.href}
        textStyle="label.03"
        px="space.03"
        py="space.02"
        bg="ink.background-secondary"
        borderRadius="round"
        _hover={{ bg: 'ink.component-background-hover' }}
        aria-label={`Open ${app.name}`}
      >
        Open
      </MarketingAnchor>
    </Flex>
  );
}

function ExplorerHero() {
  return (
    <Flex alignItems="center" gap="space.04" px="space.05" py="space.07">
      <Box flex={1}>
        <styled.h1 textStyle="heading.03">{explorerHero.title}</styled.h1>
        <styled.p textStyle="label.01" mt="space.02">
          {explorerHero.subtitle}
        </styled.p>
        <MarketingAnchor
          href={explorerHero.href}
          display="inline-block"
          mt="space.05"
          textStyle="label.03"
          px="space.03"
          py="space.02"
          bg="ink.text-primary"
          color="ink.background-primary"
          borderRadius="round"
        >
          {explorerHero.actionLabel}
        </MarketingAnchor>
      </Box>
      <Box position="relative" width="120px" height="150px" flexShrink={0}>
        <styled.img
          src="/marketing/explorer/hero-piggy-bank.png"
          alt=""
          width="96px"
          height="96px"
          position="absolute"
          top={0}
          left={0}
        />
        <styled.img
          src="/marketing/explorer/hero-hourglass.png"
          alt=""
          width="80px"
          height="83px"
          position="absolute"
          bottom={0}
          right={0}
        />
      </Box>
    </Flex>
  );
}

export function ExplorerPage() {
  return (
    <Box maxWidth="390px" mx="auto" pb="space.07">
      <ExplorerHero />
      <FeaturedAppsCarousel apps={explorerFeaturedApps} />
      <styled.h2 textStyle="heading.03" px="space.05" mt="space.07" mb="space.05">
        More apps to earn in Stacks
      </styled.h2>
      <Tabs.Root defaultValue={defaultExplorerTabId}>
        <Tabs.List aria-label="App categories">
          {explorerAppTabs.map(tab => (
            <Tabs.Trigger key={tab.id} value={tab.id}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {explorerAppTabs.map(tab => (
          <Tabs.Content key={tab.id} value={tab.id}>
            <styled.ul px="space.05">
              {tab.apps.map(app => (
                <ExplorerAppRow key={app.name} app={app} />
              ))}
            </styled.ul>
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <styled.p
        textStyle="caption.01"
        color="ink.text-subdued"
        mx="space.05"
        mt="space.03"
        pt="space.05"
        borderTop="default"
      >
        {explorerDisclaimer}
      </styled.p>
    </Box>
  );
}
