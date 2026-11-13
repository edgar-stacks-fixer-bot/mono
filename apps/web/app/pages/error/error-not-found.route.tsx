import { data } from 'react-router';

import { notFoundMeta } from '~/pages/seo/marketing-meta';

import { NotFound } from './not-found';

export function loader() {
  return data(null, { status: 404 });
}

export const meta = notFoundMeta;

export default function NotFoundRoute() {
  return <NotFound />;
}
