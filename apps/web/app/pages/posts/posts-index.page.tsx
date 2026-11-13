import { useState } from 'react';
import { Form, Link } from 'react-router';

import { Box, Flex, Grid, styled } from 'leather-styles/jsx';
import { Page } from '~/layouts/page/page';

import { Button, MagnifyingGlassIcon } from '@leather.io/ui';

import { postsPageSize } from './posts-index.utils';

interface PostsIndexItem {
  id: string;
  title: string;
  category: string | null;
  href: string;
}

interface PostsIndexPageProps {
  query: string;
  posts: PostsIndexItem[];
}

export function PostsIndexPage({ query, posts }: PostsIndexPageProps) {
  const [visibleCount, setVisibleCount] = useState(postsPageSize);
  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <Page>
      <Page.Header title="Posts" />
      <Page.Content mb="space.09">
        <Form method="get" role="search">
          <Flex
            alignItems="center"
            height="48px"
            px="space.05"
            gap="space.03"
            border="default"
            borderRadius="100px"
            maxWidth="560px"
            _focusWithin={{ borderColor: 'ink.text-subdued' }}
          >
            <styled.input
              type="search"
              name="q"
              aria-label="Search posts"
              placeholder={`Search ${posts.length} items...`}
              defaultValue={query}
              textStyle="body.02"
              color="ink.text-primary"
              bg="transparent"
              border="none"
              outline="none"
              flex="1"
              _placeholder={{ color: 'ink.text-subdued' }}
            />
            <styled.button
              type="submit"
              aria-label="Search"
              color="ink.text-subdued"
              cursor="pointer"
            >
              <MagnifyingGlassIcon />
            </styled.button>
          </Flex>
        </Form>

        {posts.length === 0 && (
          <styled.p textStyle="body.02" color="ink.text-subdued" mt="space.07">
            No posts found
          </styled.p>
        )}

        <Grid
          as="ul"
          mt="space.07"
          gap="space.04"
          gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        >
          {visiblePosts.map(post => (
            <styled.li key={post.id} listStyle="none">
              <Link to={post.href}>
                <Flex
                  flexDir="column"
                  justifyContent="space-between"
                  gap="space.04"
                  height="100%"
                  minHeight="140px"
                  p="space.05"
                  border="default"
                  borderRadius="md"
                  transition="border-color 0.2s"
                  _hover={{ borderColor: 'ink.text-subdued' }}
                >
                  <styled.h3 textStyle="heading.05">{post.title}</styled.h3>
                  {post.category && (
                    <styled.p textStyle="caption.01" color="ink.text-subdued">
                      {post.category}
                    </styled.p>
                  )}
                </Flex>
              </Link>
            </styled.li>
          ))}
        </Grid>

        {visibleCount < posts.length && (
          <Box mt="space.07" textAlign="center">
            <Button
              variant="outline"
              onClick={() => setVisibleCount(count => count + postsPageSize)}
            >
              Load more
            </Button>
          </Box>
        )}
      </Page.Content>
    </Page>
  );
}
