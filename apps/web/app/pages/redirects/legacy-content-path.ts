import { redirectContentSlug, throwNotFound, throwTerminalResolution } from './content-responses';
import { stripTrailingSlashes } from './legacy-path-redirects';

interface LegacyContentPathOptions {
  allowGuidePrefix: boolean;
}

type LegacyContentPath = { kind: 'index' } | { kind: 'slug'; slug: string } | { kind: 'unknown' };

const guidePrefix = 'guide';

export function parseLegacyContentPath(
  splat: string | undefined,
  { allowGuidePrefix }: LegacyContentPathOptions
): LegacyContentPath {
  const path = stripTrailingSlashes(`/${splat ?? ''}`);
  if (path === '/') return { kind: 'index' };

  const segments = path.slice(1).split('/');
  const [first, second, ...rest] = segments;
  if (first && second === undefined) return { kind: 'slug', slug: first };
  if (allowGuidePrefix && first === guidePrefix && second && rest.length === 0) {
    return { kind: 'slug', slug: second };
  }
  return { kind: 'unknown' };
}

export function redirectLegacyContentPath(
  request: Request,
  splat: string | undefined,
  options: LegacyContentPathOptions
) {
  const parsed = parseLegacyContentPath(splat, options);
  if (parsed.kind === 'index') {
    return throwTerminalResolution(request, { kind: 'redirect', path: '/support' });
  }
  if (parsed.kind === 'slug') return redirectContentSlug(request, parsed.slug);
  return throwNotFound();
}
