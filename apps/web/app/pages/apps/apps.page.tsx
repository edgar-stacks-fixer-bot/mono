import { VStack, styled } from 'leather-styles/jsx';
import { SectionHeading } from '~/components/section-heading';
import { Page } from '~/layouts/page/page';

import { appsFeaturedApps } from './apps.data';
import { CoreTokensSection } from './components/core-tokens-section';
import { EarningSection } from './components/earning-section';
import { FeaturedAppsCarousel } from './components/featured-apps-carousel';
import { ProjectsSection } from './components/projects-section';

export function AppsPage() {
  return (
    <Page>
      <Page.Header title="Explore" />
      <VStack alignItems="stretch" gap="space.09" mb="space.09">
        <CoreTokensSection />
        <EarningSection />
        <styled.section>
          <SectionHeading title="Featured apps" />
          <FeaturedAppsCarousel apps={appsFeaturedApps} />
        </styled.section>
        <ProjectsSection />
      </VStack>
    </Page>
  );
}
