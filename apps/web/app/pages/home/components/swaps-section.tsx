import { Box, Grid, styled } from 'leather-styles/jsx';
import { SplineScene } from '~/components/marketing/spline-scene';

import { coinRingScene } from '../home-animations';
import { swapProviders } from '../home.data';
import { CheckList } from './check-list';
import { HomeSection, HomeSectionTitle } from './home-section';

export function SwapsSection() {
  return (
    <HomeSection>
      <Grid
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
        alignItems="center"
        gap={['space.06', 'space.06', 'space.09']}
      >
        <Box>
          <HomeSectionTitle lines={['Decentralized', 'swaps.']} />
          <styled.p textStyle="body.01" color="ink.text-subdued" mt="space.05" maxW="460px">
            Swap over 100 tokens. Instantly, privately, and with full control. No accounts. No
            middlemen. No limits.
          </styled.p>
          <CheckList items={swapProviders} mt="space.05" />
        </Box>
        <SplineScene {...coinRingScene} />
      </Grid>
    </HomeSection>
  );
}
