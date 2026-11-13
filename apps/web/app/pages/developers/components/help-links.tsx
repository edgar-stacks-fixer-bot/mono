import { type ReactElement } from 'react';

import { Box, Grid, styled } from 'leather-styles/jsx';
import { MarketingAnchor } from '~/pages/apps/components/marketing-anchor';

import { GlassesIcon, SupportIcon, TerminalIcon } from '@leather.io/ui';

import { developerDocsUrl } from '../developers.data';

interface HelpLink {
  title: string;
  description: string;
  href: string;
  icon: ReactElement;
}

const helpLinks: HelpLink[] = [
  {
    title: 'Help',
    description: 'Quick answers and support for common questions.',
    href: '/support',
    icon: <SupportIcon />,
  },
  {
    title: 'Guides',
    description: 'Simple walkthroughs to get you started.',
    href: '/support',
    icon: <GlassesIcon />,
  },
  {
    title: 'Developers',
    description: 'Docs and tools to help you build faster.',
    href: developerDocsUrl,
    icon: <TerminalIcon />,
  },
];

export function HelpLinks() {
  return (
    <Grid
      gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)']}
      borderTop="default"
      borderBottom="default"
    >
      {helpLinks.map(link => (
        <MarketingAnchor
          key={link.title}
          href={link.href}
          display="flex"
          flexDir="column"
          p="space.07"
          borderRight={[null, null, 'default']}
          borderBottom={['default', null, 'none']}
          _last={{ borderRight: 'none', borderBottom: 'none' }}
          _hover={{ bg: 'ink.component-background-hover' }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="48px"
            height="48px"
            bg="ink.background-secondary"
            mb="space.09"
          >
            {link.icon}
          </Box>
          <styled.h3 textStyle="heading.05">{link.title}</styled.h3>
          <styled.p textStyle="caption.01" color="ink.text-subdued">
            {link.description}
          </styled.p>
        </MarketingAnchor>
      ))}
    </Grid>
  );
}
