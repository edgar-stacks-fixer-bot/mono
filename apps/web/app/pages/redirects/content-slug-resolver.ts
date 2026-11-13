import { legacyContentRedirects, retiredContentSlugs } from './legacy-content-redirects';
import { getDeprecationTarget } from './shared-redirect-logic';

export interface ContentFetchers<TGuide, TPost> {
  fetchGuide(slug: string): Promise<TGuide | null>;
  fetchPost(slug: string): Promise<TPost | null>;
}

type ContentSlugResolution<TGuide, TPost> =
  | { kind: 'guide'; guide: TGuide }
  | { kind: 'post'; post: TPost }
  | { kind: 'redirect'; path: string }
  | { kind: 'gone' }
  | { kind: 'not-found' };

export type TerminalResolution =
  | { kind: 'redirect'; path: string }
  | { kind: 'gone' }
  | { kind: 'not-found' };

const contentPathPattern = /^\/(?:posts|support)\/([^/]+)$/;
const maxLegacyTargetDepth = 3;

export function getGuidePath(slug: string) {
  return `/support/${slug}`;
}

export function getPostPath(slug: string) {
  return `/posts/${slug}`;
}

export function toTerminalResolution<TGuide, TPost>(
  slug: string,
  resolution: ContentSlugResolution<TGuide, TPost>
): TerminalResolution {
  switch (resolution.kind) {
    case 'guide':
      return { kind: 'redirect', path: getGuidePath(slug) };
    case 'post':
      return { kind: 'redirect', path: getPostPath(slug) };
    default:
      return resolution;
  }
}

async function resolveLegacyTarget<TGuide, TPost>(
  path: string,
  fetchers: ContentFetchers<TGuide, TPost>,
  depth: number
): Promise<TerminalResolution> {
  const targetSlug = contentPathPattern.exec(path)?.[1];
  if (!targetSlug || depth >= maxLegacyTargetDepth) return { kind: 'redirect', path };
  const resolution = await resolveSlug(targetSlug, fetchers, depth + 1);
  return toTerminalResolution(targetSlug, resolution);
}

async function resolveSlug<TGuide, TPost>(
  slug: string,
  fetchers: ContentFetchers<TGuide, TPost>,
  depth: number
): Promise<ContentSlugResolution<TGuide, TPost>> {
  const deprecationTarget = getDeprecationTarget(slug);
  if (deprecationTarget) return { kind: 'redirect', path: deprecationTarget };

  const [guide, post] = await Promise.all([fetchers.fetchGuide(slug), fetchers.fetchPost(slug)]);
  if (guide) return { kind: 'guide', guide };
  if (post) return { kind: 'post', post };

  if (retiredContentSlugs.has(slug)) return { kind: 'gone' };

  const legacyTarget = legacyContentRedirects.get(slug);
  if (!legacyTarget) return { kind: 'not-found' };
  return resolveLegacyTarget(legacyTarget, fetchers, depth);
}

export async function resolveContentSlug<TGuide, TPost>(
  slug: string,
  fetchers: ContentFetchers<TGuide, TPost>
): Promise<ContentSlugResolution<TGuide, TPost>> {
  return resolveSlug(slug, fetchers, 0);
}
