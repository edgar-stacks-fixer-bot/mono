import { marketingHeaders, marketingMeta } from '~/pages/seo/marketing-meta';

import { AppsPage } from './apps.page';

export function meta() {
  return marketingMeta({ title: 'Apps – Leather', path: '/apps' });
}

export const headers = marketingHeaders;

export default function AppsRoute() {
  return <AppsPage />;
}
