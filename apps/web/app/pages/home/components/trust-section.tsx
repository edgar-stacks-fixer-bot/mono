import { type ReactNode } from 'react';

import { Flex, Grid, styled } from 'leather-styles/jsx';
import { ExternalLink } from '~/components/external-link';

import { type TrustLogo, type TrustPoint, homeAsset, trustPoints } from '../home.data';
import { HomeSection, HomeSectionTitle } from './home-section';

function GithubLogo() {
  return (
    <Flex alignItems="center" gap="space.02" color="black">
      <img src={homeAsset('logos/github.svg')} alt="" width={36} height={36} />
      <styled.span fontSize="2rem" fontWeight={700} letterSpacing="-0.02em">
        GitHub
      </styled.span>
    </Flex>
  );
}

const trustLogos: Record<TrustLogo, ReactNode> = {
  github: <GithubLogo />,
  'least-authority': (
    <img
      src={homeAsset('logos/least-authority.png')}
      alt="Least Authority"
      width={85}
      height={63}
    />
  ),
  hackerone: <img src={homeAsset('logos/hackerone.png')} alt="HackerOne" width={180} height={41} />,
};

interface TrustColumnProps {
  point: TrustPoint;
}

function TrustColumn({ point }: TrustColumnProps) {
  return (
    <Flex flexDir="column" p={['space.05', 'space.05', 'space.06']} gap="space.03">
      <img src={point.icon} alt="" width={20} height={20} />
      <styled.h3 textStyle="heading.05" mt="space.03">
        {point.title}
      </styled.h3>
      <styled.p textStyle="body.02" color="ink.text-subdued">
        {point.description}
      </styled.p>
      <ExternalLink href={point.href} withIcon alignSelf="flex-start" mt="space.03">
        Learn more
      </ExternalLink>
      <Flex
        mt="space.05"
        height="192px"
        alignItems="center"
        justifyContent="center"
        bg="#12100F"
        borderRadius="xs"
      >
        <Flex bg="white" borderRadius="sm" px="space.04" py="space.03" alignItems="center">
          {trustLogos[point.logo]}
        </Flex>
      </Flex>
    </Flex>
  );
}

export function TrustSection() {
  return (
    <HomeSection>
      <HomeSectionTitle lines={['Built on trust.', 'Safety by design.']} mb="space.06" />
      <Grid
        gridTemplateColumns={['1fr', '1fr', 'repeat(3, 1fr)']}
        border="1px solid"
        borderColor="ink.border-default"
        borderRadius="md"
        css={{
          '& > *:not(:last-child)': {
            borderBottom: { base: '1px solid', md: 'none' },
            borderRight: { md: '1px solid' },
            borderColor: 'ink.border-default',
          },
        }}
      >
        {trustPoints.map(point => (
          <TrustColumn key={point.title} point={point} />
        ))}
      </Grid>
    </HomeSection>
  );
}
