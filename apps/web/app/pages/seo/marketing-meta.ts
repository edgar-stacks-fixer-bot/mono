import { type MetaDescriptor } from 'react-router';

import { toSiteUrl } from './site-url';

const defaultMarketingDescription =
  'Leather is a self-custodial wallet built for earning yield and managing assets in the Bitcoin ecosystem. Open-source and secure, it supports BTC, STX, Ordinals, BRC-20s, and more—giving users full control across apps, DeFi, and marketplaces.';

const marketingCacheControl = 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400';

const notFoundTitle = '404 – Leather';

interface MarketingMetaOptions {
  title: string;
  path: string;
  description?: string;
  image?: string;
}

export function marketingMeta({
  title,
  path,
  description = defaultMarketingDescription,
  image,
}: MarketingMetaOptions): MetaDescriptor[] {
  const url = toSiteUrl(path);
  const meta: MetaDescriptor[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
  ];
  if (!image) return meta;
  return [
    ...meta,
    { property: 'og:image', content: image },
    { name: 'twitter:image', content: image },
  ];
}

export function notFoundMeta(): MetaDescriptor[] {
  return [{ title: notFoundTitle }];
}

export function marketingHeaders() {
  return { 'Cache-Control': marketingCacheControl };
}
