import { Link } from 'react-router';

import { Flex, Grid, styled } from 'leather-styles/jsx';

import { HomeSection, HomeSectionTitle } from './home-section';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export interface HomeChangelogEntry {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
}

interface ChangelogStripProps {
  entries: HomeChangelogEntry[];
}

export function ChangelogStrip({ entries }: ChangelogStripProps) {
  return (
    <HomeSection>
      <Flex alignItems="flex-end" justifyContent="space-between" gap="space.04" mb="space.06">
        <HomeSectionTitle lines={['Changelog']} />
        <Link to="/changelog">
          <styled.span
            textStyle="label.02"
            borderBottom="1px solid"
            borderColor="ink.border-default"
            _hover={{ borderColor: 'ink.action-primary-hover' }}
          >
            See what’s new in Leather
          </styled.span>
        </Link>
      </Flex>
      {entries.length > 0 && (
        <Grid
          gridTemplateColumns={['1fr', '1fr 1fr', null, 'repeat(4, 1fr)']}
          border="1px solid"
          borderColor="ink.border-default"
          borderRadius="md"
          overflow="hidden"
          gap="1px"
          bg="ink.border-default"
        >
          {entries.map(entry => (
            <Link key={entry.slug} to={`/changelog/${entry.slug}`}>
              <Flex
                flexDir="column"
                justifyContent="space-between"
                gap="space.07"
                height="100%"
                minH="180px"
                p="space.05"
                bg="ink.background-primary"
                transition="background-color 0.2s"
                _hover={{ bg: 'ink.component-background-hover' }}
              >
                <styled.time
                  textStyle="label.03"
                  color="ink.text-subdued"
                  dateTime={entry.publishedAt}
                >
                  {dateFormatter.format(new Date(entry.publishedAt))}
                </styled.time>
                <Flex flexDir="column" alignItems="flex-start" gap="space.02">
                  {entry.tags.map(tag => (
                    <styled.span
                      key={tag}
                      textStyle="caption.01"
                      color="ink.text-subdued"
                      border="1px solid"
                      borderColor="ink.border-default"
                      borderRadius="round"
                      px="space.02"
                    >
                      {tag}
                    </styled.span>
                  ))}
                  <styled.h3 textStyle="heading.05" color="ink.text-primary">
                    {entry.title}
                  </styled.h3>
                </Flex>
              </Flex>
            </Link>
          ))}
        </Grid>
      )}
    </HomeSection>
  );
}
