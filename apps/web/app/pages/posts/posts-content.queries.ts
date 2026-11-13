import { cmsClient, urlFor } from '~/constants/cms-client';
import { fetchListOrEmpty } from '~/utils/cms/fetch-list-or-empty';

interface PostImage {
  asset?: { _ref: string };
}

interface PostListDoc {
  _id: string;
  title: string;
  slug: string;
  summary: string | null;
  category: string | null;
  publishedAt: string | null;
  image: PostImage | null;
}

interface PostListItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  category: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
}

const postImageWidth = 960;

const postListProjection = `| order(publishedAt desc) {
  _id, title, "slug": slug.current, summary, category, publishedAt, "image": images[0]
}`;

const publishedPostsQuery = `*[
  _type == "post"
  && defined(slug.current)
  && status == "published"
  && hidden != true
] ${postListProjection}`;

const publishedPostsInCategoryQuery = `*[
  _type == "post"
  && defined(slug.current)
  && status == "published"
  && hidden != true
  && category == $category
] ${postListProjection}`;

const guideSlugsQuery = `*[_type == "helpCenterGuide" && defined(slug.current)].slug.current`;

function toPostListItem({ _id, image, ...post }: PostListDoc): PostListItem {
  const imageUrl = image?.asset ? urlFor(image).width(postImageWidth).auto('format').url() : null;
  return { id: _id, ...post, imageUrl };
}

export async function fetchPublishedPosts() {
  const docs = await fetchListOrEmpty(signal =>
    cmsClient.fetch<PostListDoc[]>(publishedPostsQuery, {}, { signal })
  );
  return docs.map(toPostListItem);
}

export async function fetchPublishedPostsInCategory(category: string) {
  const docs = await fetchListOrEmpty(signal =>
    cmsClient.fetch<PostListDoc[]>(publishedPostsInCategoryQuery, { category }, { signal })
  );
  return docs.map(toPostListItem);
}

export async function fetchGuideSlugs() {
  const slugs = await fetchListOrEmpty(signal =>
    cmsClient.fetch<string[]>(guideSlugsQuery, {}, { signal })
  );
  return new Set(slugs);
}
