import { useState } from 'react';

import { Grid, styled } from 'leather-styles/jsx';
import { LottieAnimation } from '~/components/marketing/lottie-animation';

import {
  reviewTransactionsAnimation,
  spamFilterActiveSegment,
  spamFilterAnimation,
  spamFilterIdleSegment,
} from '../home-animations';
import { homeAsset } from '../home.data';
import { FeatureCard } from './feature-card';
import { HomeSection, HomeSectionTitle } from './home-section';
import { StillImage } from './still-image';

function SpamFilterCard() {
  const [isHidingSpam, setIsHidingSpam] = useState(false);
  const segment = isHidingSpam ? spamFilterActiveSegment : spamFilterIdleSegment;

  return (
    <FeatureCard
      title="Stay spam free"
      platform="Extension"
      description="Filter unwanted tokens and collectibles, keeping your wallet clean and safe."
      media={
        <styled.button
          type="button"
          aria-pressed={isHidingSpam}
          aria-label="Hide spam"
          onClick={() => setIsHidingSpam(value => !value)}
          display="block"
          width="100%"
          maxW="390px"
          cursor="pointer"
          borderRadius="sm"
          _focusVisible={{ outline: '2px solid', outlineColor: 'ink.action-primary-default' }}
        >
          <LottieAnimation {...spamFilterAnimation} segment={segment} loop={!isHidingSpam} />
        </styled.button>
      }
    />
  );
}

export function ProtectionSection() {
  return (
    <HomeSection>
      <HomeSectionTitle lines={['Protection', 'at every step.']} mb="space.06" />
      <Grid gridTemplateColumns={['1fr', '1fr', 'repeat(3, 1fr)']} gap="space.03">
        <SpamFilterCard />
        <FeatureCard
          title="Review transactions"
          description="Transfer securely and instantly, with clear review step at every transaction."
          media={<LottieAnimation {...reviewTransactionsAnimation} maxW="390px" />}
        />
        <FeatureCard
          title="UTXO protection"
          platform="Extension"
          description="Prevent accidental misuse of Ordinal Inscriptions with UTXO safeguards."
          media={
            <StillImage
              src={homeAsset('images/utxo-protection.png')}
              alt="A protected collectible with a lock badge"
              width={390}
              height={280}
            />
          }
        />
      </Grid>
    </HomeSection>
  );
}
