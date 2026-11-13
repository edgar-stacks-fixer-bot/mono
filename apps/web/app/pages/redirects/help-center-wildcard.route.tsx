import { ContentErrorBoundary } from '~/pages/error/content-error-boundary';
import { notFoundMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/help-center-wildcard.route';
import { throwTerminalResolution } from './content-responses';
import { redirectLegacyContentPath } from './legacy-content-path';

export function loader({ params, request }: Route.LoaderArgs) {
  const splat = params['*'];
  if (splat === 'search' || splat === 'search/') {
    return throwTerminalResolution(request, { kind: 'redirect', path: '/support/search' });
  }
  return redirectLegacyContentPath(request, splat, { allowGuidePrefix: true });
}

export const meta = notFoundMeta;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ContentErrorBoundary error={error} />;
}
