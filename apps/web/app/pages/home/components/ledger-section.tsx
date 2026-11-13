import { Box, Grid, styled } from 'leather-styles/jsx';
import { LottieAnimation } from '~/components/marketing/lottie-animation';

import { ledgerAnimation } from '../home-animations';
import { ledgerHighlights } from '../home.data';
import { CheckList } from './check-list';
import { HomeSection, HomeSectionTitle } from './home-section';

export function LedgerSection() {
  return (
    <HomeSection>
      <Grid
        gridTemplateColumns={['1fr', '1fr', '3fr 2fr']}
        alignItems="center"
        gap={['space.06', 'space.06', 'space.09']}
      >
        <LottieAnimation {...ledgerAnimation} loop={false} replayOnEnter order={[1, 1, 0]} />
        <Box>
          <HomeSectionTitle lines={['Best in class', 'Ledger support.']} />
          <styled.p textStyle="body.01" color="ink.text-subdued" mt="space.05">
            Create or restore wallets in seconds, keeping all your Bitcoin and Stacks accounts in
            one secure place.
          </styled.p>
          <CheckList items={ledgerHighlights} flexDir="column" mt="space.05" />
        </Box>
      </Grid>
    </HomeSection>
  );
}
