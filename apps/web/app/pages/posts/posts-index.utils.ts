import { isDeprecatedContentSlug } from '~/pages/redirects/shared-redirect-logic';

export const postsPageSize = 12;
export const newsCategory = 'News';

const excludedIndexCategories: ReadonlySet<string> = new Set(['Apps', 'Legal', 'Tokens']);

interface ListablePost {
  slug: string;
  title: string;
  summary?: string | null;
  category?: string | null;
}

function isRetiredPost(post: ListablePost) {
  return isDeprecatedContentSlug(post.slug);
}

export function filterIndexPosts<T extends ListablePost>(
  posts: T[],
  guideSlugs: ReadonlySet<string>
): T[] {
  return posts.filter(
    post =>
      !isRetiredPost(post) &&
      !guideSlugs.has(post.slug) &&
      !(post.category && excludedIndexCategories.has(post.category))
  );
}

export function filterNewsPosts<T extends ListablePost>(posts: T[]): T[] {
  return posts.filter(post => post.category === newsCategory && !isRetiredPost(post));
}

export function searchPosts<T extends ListablePost>(posts: T[], query: string | null): T[] {
  const term = query?.trim().toLowerCase();
  if (!term) return posts;
  return posts.filter(post =>
    [post.title, post.summary, post.category].some(field => field?.toLowerCase().includes(term))
  );
}
