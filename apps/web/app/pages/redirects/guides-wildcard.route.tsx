import { ContentErrorBoundary } from '~/pages/error/content-error-boundary';
import { notFoundMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/guides-wildcard.route';
import { redirectLegacyContentPath } from './legacy-content-path';

export function loader({ params, request }: Route.LoaderArgs) {
  return redirectLegacyContentPath(request, params['*'], { allowGuidePrefix: false });
}

export const meta = notFoundMeta;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ContentErrorBoundary error={error} />;
}
