import { getPostPath } from '~/pages/redirects/content-slug-resolver';
import { marketingHeaders, marketingMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/posts-index.route';
import { fetchGuideSlugs, fetchPublishedPosts } from './posts-content.queries';
import { PostsIndexPage } from './posts-index.page';
import { filterIndexPosts, searchPosts } from './posts-index.utils';

const postsDescription =
  'Stay up to date and read about the latest integrations, partnerships, new features and more from Leather Bitcoin wallet with the Leather blog.';

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const [posts, guideSlugs] = await Promise.all([fetchPublishedPosts(), fetchGuideSlugs()]);
  const results = searchPosts(filterIndexPosts(posts, guideSlugs), query);

  return {
    query,
    posts: results.map(({ id, slug, title, category }) => ({
      id,
      title,
      category,
      href: getPostPath(slug),
    })),
  };
}

export function meta() {
  return marketingMeta({
    title: 'All posts – Leather',
    path: '/posts',
    description: postsDescription,
  });
}

export const headers = marketingHeaders;

export default function PostsIndexRoute({ loaderData }: Route.ComponentProps) {
  return (
    <PostsIndexPage key={loaderData.query} query={loaderData.query} posts={loaderData.posts} />
  );
}
