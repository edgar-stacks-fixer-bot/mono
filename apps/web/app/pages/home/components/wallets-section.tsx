import { Grid } from 'leather-styles/jsx';
import { LottieAnimation } from '~/components/marketing/lottie-animation';

import { bringWalletsAnimation, nameWalletsAnimation } from '../home-animations';
import { FeatureCard } from './feature-card';
import { HomeSection, HomeSectionTitle } from './home-section';

export function WalletsSection() {
  return (
    <HomeSection>
      <HomeSectionTitle lines={['All your wallets,', 'perfectly organized.']} mb="space.06" />
      <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']} gap="space.03">
        <FeatureCard
          title="Bring all your wallets"
          platform="Mobile"
          description="Create or restore wallets in seconds, keeping all your Bitcoin and Stacks accounts in one secure place."
          media={<LottieAnimation {...bringWalletsAnimation} maxW="480px" />}
        />
        <FeatureCard
          title="Name it your way"
          platform="Mobile"
          description="Personalize your wallets with custom names to stay organized and instantly recognize the accounts that matter most."
          media={<LottieAnimation {...nameWalletsAnimation} maxW="480px" />}
        />
      </Grid>
    </HomeSection>
  );
}
