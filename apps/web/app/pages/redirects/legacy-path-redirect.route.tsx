import { ContentErrorBoundary } from '~/pages/error/content-error-boundary';
import { notFoundMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/legacy-path-redirect.route';
import { redirectContentSlug, throwNotFound, throwTerminalResolution } from './content-responses';
import { findLegacyPathRedirect } from './legacy-path-redirects';

export function loader({ request }: Route.LoaderArgs) {
  const legacyRedirect = findLegacyPathRedirect(new URL(request.url).pathname);
  if (!legacyRedirect) return throwNotFound();
  if ('slug' in legacyRedirect) return redirectContentSlug(request, legacyRedirect.slug);
  return throwTerminalResolution(request, { kind: 'redirect', path: legacyRedirect.to });
}

export const meta = notFoundMeta;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ContentErrorBoundary error={error} />;
}
