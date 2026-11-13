import { getGuidePath, getPostPath } from '~/pages/redirects/content-slug-resolver';
import { isDeprecatedContentSlug } from '~/pages/redirects/shared-redirect-logic';

import { toSiteUrl } from './site-url';

export const seoFileCacheControl = 'public, max-age=3600, s-maxage=3600';

export const staticSitemapPaths = [
  '/',
  '/apps',
  '/developers',
  '/news',
  '/explorer',
  '/posts',
  '/support',
  '/changelog',
];

interface SitemapContent {
  postSlugs: string[];
  guideSlugs: string[];
  changelogSlugs: string[];
}

export function getSitemapPaths({ postSlugs, guideSlugs, changelogSlugs }: SitemapContent) {
  const servedGuideSlugs = new Set(guideSlugs.filter(slug => !isDeprecatedContentSlug(slug)));
  const servedPostSlugs = postSlugs.filter(
    slug => !isDeprecatedContentSlug(slug) && !servedGuideSlugs.has(slug)
  );

  return [
    ...new Set([
      ...staticSitemapPaths,
      ...[...servedGuideSlugs].map(getGuidePath),
      ...servedPostSlugs.map(getPostPath),
      ...changelogSlugs.map(slug => `/changelog/${slug}`),
    ]),
  ];
}

const xmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

export function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, char => xmlEntities[char] ?? char);
}

export function renderSitemapXml(paths: string[]) {
  const urls = paths.map(path => `  <url><loc>${escapeXml(toSiteUrl(path))}</loc></url>`);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

export function renderRobotsTxt() {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${toSiteUrl('/sitemap.xml')}`, ''].join('\n');
}
