import { fetchPublishedPostsInCategory } from '~/pages/posts/posts-content.queries';
import { filterNewsPosts, newsCategory } from '~/pages/posts/posts-index.utils';
import { getPostPath } from '~/pages/redirects/content-slug-resolver';
import { marketingHeaders, marketingMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/news.route';
import { NewsPage } from './news.page';

export async function loader() {
  const posts = filterNewsPosts(await fetchPublishedPostsInCategory(newsCategory));
  return {
    posts: posts.map(({ id, slug, title, summary, publishedAt, imageUrl }) => ({
      id,
      title,
      summary,
      publishedAt,
      imageUrl,
      href: getPostPath(slug),
    })),
  };
}

export function meta() {
  return marketingMeta({ title: 'News – Leather', path: '/news' });
}

export const headers = marketingHeaders;

export default function NewsRoute({ loaderData }: Route.ComponentProps) {
  return <NewsPage posts={loaderData.posts} />;
}
