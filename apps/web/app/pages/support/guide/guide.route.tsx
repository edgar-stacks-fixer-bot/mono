import { ContentErrorBoundary } from '~/pages/error/content-error-boundary';
import { type CmsGuide, cmsContentFetchers } from '~/pages/redirects/cms-content-fetchers';
import { throwTerminalResolution } from '~/pages/redirects/content-responses';
import {
  getGuidePath,
  resolveContentSlug,
  toTerminalResolution,
} from '~/pages/redirects/content-slug-resolver';
import { marketingHeaders, marketingMeta, notFoundMeta } from '~/pages/seo/marketing-meta';
import { Guide } from '~/pages/support/guide/guide';

import { type Route } from './+types/guide.route';

export async function loader({ params, request }: Route.LoaderArgs): Promise<{ guide: CmsGuide }> {
  const slug = params.guideSlug;
  const resolution = await resolveContentSlug(slug, cmsContentFetchers);

  if (resolution.kind !== 'guide') {
    return throwTerminalResolution(request, toTerminalResolution(slug, resolution));
  }

  return { guide: resolution.guide };
}

export function meta({ loaderData, params }: Route.MetaArgs) {
  if (!loaderData) return notFoundMeta();
  const { guide } = loaderData;
  return marketingMeta({
    title: `${guide.title} – Leather Help Center`,
    path: getGuidePath(params.guideSlug),
    description: guide.summary,
  });
}

export const headers = marketingHeaders;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ContentErrorBoundary error={error} />;
}

export default function GuideRoute() {
  return <Guide />;
}
