import { type ChromeHandle } from '~/layouts/chrome';
import { marketingHeaders, marketingMeta } from '~/pages/seo/marketing-meta';

import { ExplorerPage } from './explorer.page';

export const handle = { chrome: 'none' } satisfies ChromeHandle;

export function meta() {
  return marketingMeta({ title: 'Explorer – Leather', path: '/explorer' });
}

export const headers = marketingHeaders;

export default function ExplorerRoute() {
  return <ExplorerPage />;
}
