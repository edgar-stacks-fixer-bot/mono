import { ContentErrorBoundary } from '~/pages/error/content-error-boundary';
import { notFoundMeta } from '~/pages/seo/marketing-meta';

import { type Route } from './+types/help-center-redirect.route';
import { throwTerminalResolution } from './content-responses';

export function loader({ request }: Route.LoaderArgs) {
  return throwTerminalResolution(request, { kind: 'redirect', path: '/support' });
}

export const meta = notFoundMeta;

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ContentErrorBoundary error={error} />;
}
