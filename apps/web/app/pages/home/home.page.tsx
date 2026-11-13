import { Box } from 'leather-styles/jsx';

import { BuyPartners } from './components/buy-partners';
import { ChangelogStrip, type HomeChangelogEntry } from './components/changelog-strip';
import { EarnSection } from './components/earn-section';
import { FullControlSection } from './components/full-control-section';
import { HomeHero } from './components/home-hero';
import { LedgerSection } from './components/ledger-section';
import { ProtectionSection } from './components/protection-section';
import { SwapsSection } from './components/swaps-section';
import { TrustSection } from './components/trust-section';
import { WalletsSection } from './components/wallets-section';

export type { HomeChangelogEntry };

interface HomePageProps {
  changelogEntries: HomeChangelogEntry[];
}

export function HomePage({ changelogEntries }: HomePageProps) {
  return (
    <Box pb="space.10">
      <HomeHero />
      <BuyPartners />
      <SwapsSection />
      <LedgerSection />
      <WalletsSection />
      <FullControlSection />
      <ProtectionSection />
      <TrustSection />
      <EarnSection />
      <ChangelogStrip entries={changelogEntries} />
    </Box>
  );
}
