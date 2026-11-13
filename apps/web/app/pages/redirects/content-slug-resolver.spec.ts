import {
  type ContentFetchers,
  resolveContentSlug,
  toTerminalResolution,
} from './content-slug-resolver';
import { legacyContentRedirects, retiredContentSlugs } from './legacy-content-redirects';
import { findLegacyPathRedirect, legacyPathRedirects } from './legacy-path-redirects';
import { deprecationPostSlugs, getDeprecationTarget } from './shared-redirect-logic';

interface FakeContent {
  slug: string;
}

interface FakeContentOptions {
  guides?: string[];
  posts?: string[];
}

function createFakeFetchers({ guides = [], posts = [] }: FakeContentOptions = {}) {
  const fetchGuide = vi.fn((slug: string) =>
    Promise.resolve(guides.includes(slug) ? { slug } : null)
  );
  const fetchPost = vi.fn((slug: string) =>
    Promise.resolve(posts.includes(slug) ? { slug } : null)
  );
  const fetchers: ContentFetchers<FakeContent, FakeContent> = { fetchGuide, fetchPost };
  return { fetchers, fetchGuide, fetchPost };
}

const contentPathPattern = /^\/(posts|support)\/([^/]+)$/;
const finalFixedPaths = ['/', '/support', '/posts', '/developers'];

function parseContentPath(path: string) {
  const match = contentPathPattern.exec(path);
  if (!match) return null;
  const [, section, slug] = match;
  if (!section || !slug) return null;
  return { section, slug };
}

function collectContentTargets() {
  const targets = [...legacyContentRedirects.values()].flatMap(path => {
    const parsed = parseContentPath(path);
    return parsed ? [parsed] : [];
  });
  return {
    guides: targets.filter(target => target.section === 'support').map(target => target.slug),
    posts: targets.filter(target => target.section === 'posts').map(target => target.slug),
  };
}

describe('resolveContentSlug', () => {
  it('redirects deprecated slugs to their deprecation post without asking Sanity', async () => {
    const { fetchers, fetchGuide, fetchPost } = createFakeFetchers({
      guides: ['send-ordinals'],
      posts: ['send-ordinals'],
    });

    await expect(resolveContentSlug('send-ordinals', fetchers)).resolves.toEqual({
      kind: 'redirect',
      path: '/posts/deprecation-of-ordinals-inscriptions-support-in-leather',
    });
    expect(fetchGuide).not.toHaveBeenCalled();
    expect(fetchPost).not.toHaveBeenCalled();
  });

  it('serves a guide when one exists', async () => {
    const { fetchers } = createFakeFetchers({ guides: ['install-leather'] });

    await expect(resolveContentSlug('install-leather', fetchers)).resolves.toEqual({
      kind: 'guide',
      guide: { slug: 'install-leather' },
    });
  });

  it('prefers the guide when a post shares its slug', async () => {
    const { fetchers } = createFakeFetchers({
      guides: ['install-leather'],
      posts: ['install-leather'],
    });

    const resolution = await resolveContentSlug('install-leather', fetchers);

    expect(resolution.kind).toBe('guide');
    expect(toTerminalResolution('install-leather', resolution)).toEqual({
      kind: 'redirect',
      path: '/support/install-leather',
    });
  });

  it('serves a post when there is no guide', async () => {
    const { fetchers } = createFakeFetchers({ posts: ['what-is-stacks'] });

    const resolution = await resolveContentSlug('what-is-stacks', fetchers);

    expect(resolution).toEqual({ kind: 'post', post: { slug: 'what-is-stacks' } });
    expect(toTerminalResolution('what-is-stacks', resolution)).toEqual({
      kind: 'redirect',
      path: '/posts/what-is-stacks',
    });
  });

  it('serves a post from Sanity before consulting the legacy map', async () => {
    const { fetchers } = createFakeFetchers({ posts: ['apps-xlink', 'brotocol'] });

    await expect(resolveContentSlug('apps-xlink', fetchers)).resolves.toEqual({
      kind: 'post',
      post: { slug: 'apps-xlink' },
    });
  });

  it('redirects a legacy slug to its post', async () => {
    const { fetchers } = createFakeFetchers({ posts: ['brotocol'] });

    await expect(resolveContentSlug('apps-xlink', fetchers)).resolves.toEqual({
      kind: 'redirect',
      path: '/posts/brotocol',
    });
  });

  it('redirects a legacy slug to its guide', async () => {
    const { fetchers } = createFakeFetchers({ guides: ['send-stx'], posts: ['send-stx'] });

    await expect(resolveContentSlug('send-stacks-from-app', fetchers)).resolves.toEqual({
      kind: 'redirect',
      path: '/support/send-stx',
    });
  });

  it('follows a legacy post target that became a guide so the redirect is a single hop', async () => {
    const { fetchers } = createFakeFetchers({ guides: ['connect-apps'], posts: ['connect-apps'] });

    await expect(
      resolveContentSlug('how-do-i-connect-my-leather-account-to-applications', fetchers)
    ).resolves.toEqual({ kind: 'redirect', path: '/support/connect-apps' });
  });

  it('redirects a legacy slug to a fixed path', async () => {
    const { fetchers } = createFakeFetchers();

    await expect(resolveContentSlug('start-with-leather', fetchers)).resolves.toEqual({
      kind: 'redirect',
      path: '/support',
    });
    await expect(resolveContentSlug('mobile-crypto-wallet', fetchers)).resolves.toEqual({
      kind: 'redirect',
      path: '/',
    });
  });

  it('returns not found for a legacy slug whose target no longer exists', async () => {
    const { fetchers } = createFakeFetchers();

    await expect(resolveContentSlug('apps-xlink', fetchers)).resolves.toEqual({
      kind: 'not-found',
    });
  });

  it.each([...retiredContentSlugs])('returns gone for the retired slug %s', async slug => {
    const { fetchers } = createFakeFetchers();

    await expect(resolveContentSlug(slug, fetchers)).resolves.toEqual({ kind: 'gone' });
  });

  it('returns not found for an unknown slug', async () => {
    const { fetchers } = createFakeFetchers();

    await expect(resolveContentSlug('no-such-post', fetchers)).resolves.toEqual({
      kind: 'not-found',
    });
  });
});

describe('legacy redirect targets', () => {
  it('retires exactly the settled slugs', () => {
    expect([...retiredContentSlugs].sort()).toEqual(
      [
        'apps-befi-labs',
        'apps-lockstacks',
        'apps-stx20-com',
        'befi-labs',
        'stx20-com',
        'tokens-btc',
        'tokens-stx-20',
      ].sort()
    );
  });

  it('never both retires and redirects a slug', () => {
    for (const slug of retiredContentSlugs) expect(legacyContentRedirects.has(slug)).toBe(false);
  });

  it('every legacy target is a final URL', async () => {
    const { fetchers } = createFakeFetchers(collectContentTargets());

    for (const [slug, target] of legacyContentRedirects) {
      expect(target).toMatch(/^\/([a-z0-9-]+(\/[a-z0-9-]+)?)?$/);
      expect(findLegacyPathRedirect(target)).toBeNull();

      const resolution = await resolveContentSlug(slug, fetchers);
      expect(resolution).toEqual({ kind: 'redirect', path: target });

      const content = parseContentPath(target);
      if (!content) {
        expect(finalFixedPaths).toContain(target);
        continue;
      }
      expect(getDeprecationTarget(content.slug)).toBeNull();
      expect(legacyContentRedirects.has(content.slug)).toBe(false);
      expect(retiredContentSlugs.has(content.slug)).toBe(false);

      const targetResolution = await resolveContentSlug(content.slug, fetchers);
      expect(targetResolution.kind).toBe(content.section === 'support' ? 'guide' : 'post');
    }
  });

  it.each(deprecationPostSlugs)('the deprecation post %s does not redirect again', slug => {
    expect(getDeprecationTarget(slug)).toBeNull();
    expect(legacyContentRedirects.has(slug)).toBe(false);
    expect(retiredContentSlugs.has(slug)).toBe(false);
  });

  it('every fixed legacy path points at a page that serves', () => {
    for (const redirect of legacyPathRedirects) {
      if (!('to' in redirect)) continue;
      expect(finalFixedPaths).toContain(redirect.to);
      expect(findLegacyPathRedirect(redirect.to)).toBeNull();
    }
  });
});
