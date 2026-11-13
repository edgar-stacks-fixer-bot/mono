import { Link } from 'react-router';

import { css } from 'leather-styles/css';
import { Box, Flex, Grid, styled } from 'leather-styles/jsx';
import { Page } from '~/layouts/page/page';

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
  href: string;
}

interface NewsPageProps {
  posts: NewsItem[];
}

const newsDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const newsImageClass = css({
  width: '100%',
  height: 'auto',
  aspectRatio: '16 / 10',
  objectFit: 'cover',
  borderRadius: 'md',
});

function formatNewsDate(date: string | null) {
  if (!date) return null;
  return newsDateFormatter.format(new Date(date));
}

interface NewsImageProps {
  imageUrl: string | null;
  title: string;
}

function NewsImage({ imageUrl, title }: NewsImageProps) {
  if (!imageUrl) return null;
  return (
    <img
      src={imageUrl}
      alt={title}
      width={960}
      height={600}
      loading="lazy"
      className={newsImageClass}
    />
  );
}

interface NewsPostProps {
  post: NewsItem;
}

function FeaturedNews({ post }: NewsPostProps) {
  return (
    <Link to={post.href}>
      <Grid gap="space.06" gridTemplateColumns={['1fr', '1fr', '3fr 2fr']} alignItems="center">
        <NewsImage imageUrl={post.imageUrl} title={post.title} />
        <Flex flexDir="column" gap="space.04">
          <styled.h2 textStyle="heading.03">{post.title}</styled.h2>
          {post.summary && (
            <styled.p textStyle="body.01" color="ink.text-subdued" lineClamp={4}>
              {post.summary}
            </styled.p>
          )}
          <styled.p textStyle="caption.01" color="ink.text-subdued">
            {formatNewsDate(post.publishedAt)}
          </styled.p>
        </Flex>
      </Grid>
    </Link>
  );
}

function NewsCard({ post }: NewsPostProps) {
  return (
    <Link to={post.href}>
      <Flex flexDir="column" gap="space.03">
        <NewsImage imageUrl={post.imageUrl} title={post.title} />
        <styled.h3 textStyle="heading.05">{post.title}</styled.h3>
        <styled.p textStyle="caption.01" color="ink.text-subdued">
          {formatNewsDate(post.publishedAt)}
        </styled.p>
      </Flex>
    </Link>
  );
}

export function NewsPage({ posts }: NewsPageProps) {
  const [featured, ...rest] = posts;

  return (
    <Page>
      <Page.Header title="News" />
      <Page.Content mb="space.09">
        {!featured && (
          <styled.p textStyle="body.02" color="ink.text-subdued">
            No news yet
          </styled.p>
        )}
        {featured && <FeaturedNews post={featured} />}
        <Grid
          as="ul"
          mt="space.09"
          gap="space.07"
          gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        >
          {rest.map(post => (
            <Box as="li" key={post.id} listStyle="none">
              <NewsCard post={post} />
            </Box>
          ))}
        </Grid>
      </Page.Content>
    </Page>
  );
}
