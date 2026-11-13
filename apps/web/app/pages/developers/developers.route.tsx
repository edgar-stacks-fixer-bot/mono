import { marketingHeaders, marketingMeta } from '~/pages/seo/marketing-meta';

import { DevelopersPage } from './developers.page';

export function meta() {
  return marketingMeta({ title: 'Developers – Leather', path: '/developers' });
}

export const headers = marketingHeaders;

export default function DevelopersRoute() {
  return <DevelopersPage />;
}
