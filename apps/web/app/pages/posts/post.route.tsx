import { ContentErrorBoundary } from '~/pages/error/content-error-boundary';
import { Post } from '~/pages/posts/post';
import { type CmsPost, cmsContentFetchers } from '~/pages/redirects/cms-content-fetchers';
import { throwTerminalResolution } from '~/pages/redirects/content-responses';
import {
  getPostPath,
  resolveContentSlug,
  toTerminalResolution,
} from '~/pages/redirects/content-slug-resolver';
import { marketingHeaders, marketingMeta, notFoundMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/post.route';

export async function loader({ params, request }: Route.LoaderArgs): Promise<{ post: CmsPost }> {
  const slug = params.postSlug;
  const resolution = await resolveContentSlug(slug, cmsContentFetchers);

  if (resolution.kind !== 'post') {
    return throwTerminalResolution(request, toTerminalResolution(slug, resolution));
  }

  return { post: resolution.post };
}

export function meta({ loaderData, params }: Route.MetaArgs) {
  if (!loaderData) return notFoundMeta();
  const { post } = loaderData;
  return marketingMeta({
    title: `${post.title} – Leather`,
    path: getPostPath(params.postSlug),
    description: post.summary,
  });
}

export const headers = marketingHeaders;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ContentErrorBoundary error={error} />;
}

export default function PostRoute() {
  return <Post />;
}
