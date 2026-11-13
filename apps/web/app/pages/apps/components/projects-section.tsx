import { Grid, styled } from 'leather-styles/jsx';
import { SectionHeading } from '~/components/section-heading';

import { projects } from '../apps.data';
import { MarketingAnchor } from './marketing-anchor';

export function ProjectsSection() {
  return (
    <styled.section>
      <SectionHeading title="Projects" />
      <Grid
        gridTemplateColumns={['1fr', null, 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        borderTop="default"
        borderLeft="default"
      >
        {projects.map(project => (
          <MarketingAnchor
            key={project.name}
            href={project.href}
            display="flex"
            flexDir="column"
            gap="space.02"
            p="space.05"
            borderRight="default"
            borderBottom="default"
            _hover={{ bg: 'ink.component-background-hover' }}
          >
            <styled.img
              src={project.logoSrc}
              alt=""
              width="40px"
              height="40px"
              borderRadius="xs"
              objectFit="cover"
              mb="space.04"
            />
            <styled.h3 textStyle="label.02">{project.name}</styled.h3>
            <styled.p textStyle="caption.01" color="ink.text-subdued" lineClamp={2}>
              {project.description}
            </styled.p>
          </MarketingAnchor>
        ))}
      </Grid>
    </styled.section>
  );
}
