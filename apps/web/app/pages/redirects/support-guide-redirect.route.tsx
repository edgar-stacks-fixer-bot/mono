import { ContentErrorBoundary } from '~/pages/error/content-error-boundary';
import { notFoundMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/support-guide-redirect.route';
import { redirectContentSlug } from './content-responses';

export function loader({ params, request }: Route.LoaderArgs) {
  return redirectContentSlug(request, params.slug);
}

export const meta = notFoundMeta;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ContentErrorBoundary error={error} />;
}
