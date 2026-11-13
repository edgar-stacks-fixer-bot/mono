import { isRouteErrorResponse } from 'react-router';

import { ErrorPage } from '~/layouts/page/error';

import { NotFound } from './not-found';

const notFoundStatuses = [404, 410];

interface ContentErrorBoundaryProps {
  error: unknown;
}

export function ContentErrorBoundary({ error }: ContentErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && notFoundStatuses.includes(error.status)) return <NotFound />;
  return <ErrorPage error={error} />;
}
