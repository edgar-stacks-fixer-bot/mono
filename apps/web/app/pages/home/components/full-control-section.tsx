import { Grid } from 'leather-styles/jsx';
import { LottieAnimation } from '~/components/marketing/lottie-animation';

import {
  btcNotificationsAnimation,
  collectionAnimation,
  sendReceiveAnimation,
} from '../home-animations';
import { homeAsset } from '../home.data';
import { FeatureCard } from './feature-card';
import { HomeSection, HomeSectionTitle } from './home-section';
import { StillImage } from './still-image';

export function FullControlSection() {
  return (
    <HomeSection>
      <HomeSectionTitle lines={['Full control,', 'no compromise.']} mb="space.06" />
      <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']} gap="space.03">
        <FeatureCard
          title="Send and receive"
          description="Transfer Bitcoin, tokens, and collectibles securely and instantly, with clear transaction details every step of the way."
          media={<LottieAnimation {...sendReceiveAnimation} maxW="480px" />}
        />
        <FeatureCard
          title="Your collection, beautifully organised"
          platform="Mobile"
          description="See all your tokens and stacks collectibles at a glance, designed for clarity and a clean visual experience."
          media={<LottieAnimation {...collectionAnimation} maxW="480px" />}
        />
      </Grid>
      <Grid gridTemplateColumns={['1fr', '1fr', 'repeat(3, 1fr)']} gap="space.03" mt="space.03">
        <FeatureCard
          title="Send sBTC without fees"
          description="Transfer securely and instantly, with clear review step at every transaction."
          media={
            <StillImage
              src={homeAsset('images/send-sbtc.svg')}
              alt="A send review showing a sponsored sBTC transfer with no transaction fees"
              width={390}
              height={280}
            />
          }
        />
        <FeatureCard
          title="Know every move"
          description="Review your past transactions with full transparency and detail."
          media={
            <StillImage
              src={homeAsset('images/activity.svg')}
              alt="A list of sent and received transactions"
              width={390}
              height={280}
            />
          }
        />
        <FeatureCard
          title="Get BTC notifications"
          platform="Extension"
          description="Get instant notification every time you receive Bitcoin in your wallet."
          media={<LottieAnimation {...btcNotificationsAnimation} maxW="390px" />}
        />
      </Grid>
    </HomeSection>
  );
}
