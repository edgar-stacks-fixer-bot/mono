import { parseLegacyContentPath } from './legacy-content-path';
import { findLegacyPathRedirect, legacyPathRedirects } from './legacy-path-redirects';

describe('findLegacyPathRedirect', () => {
  it('resolves Framer short paths through a content slug', () => {
    expect(findLegacyPathRedirect('/privacy-policy')).toEqual({
      path: '/privacy-policy',
      slug: 'privacy-policy',
    });
    expect(findLegacyPathRedirect('/old-page/terms')).toEqual({
      path: '/old-page/terms',
      slug: 'terms-of-service',
    });
  });

  it('redirects the retired wallet pages home', () => {
    expect(findLegacyPathRedirect('/wallet')).toEqual({ path: '/wallet', to: '/' });
    expect(findLegacyPathRedirect('/wallet/mobile')).toEqual({ path: '/wallet/mobile', to: '/' });
    expect(findLegacyPathRedirect('/wallet/extension')).toEqual({
      path: '/wallet/extension',
      to: '/',
    });
  });

  it('strips trailing slashes', () => {
    expect(findLegacyPathRedirect('/contact/')).toEqual({ path: '/contact', to: '/support' });
  });

  it('returns null for unknown paths', () => {
    expect(findLegacyPathRedirect('/old-page/unknown')).toBeNull();
  });

  it('lists each path once', () => {
    const paths = legacyPathRedirects.map(({ path }) => path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe('parseLegacyContentPath', () => {
  it('treats an empty splat as the index', () => {
    expect(parseLegacyContentPath('', { allowGuidePrefix: true })).toEqual({ kind: 'index' });
    expect(parseLegacyContentPath(undefined, { allowGuidePrefix: true })).toEqual({
      kind: 'index',
    });
  });

  it('reads a single segment as a slug', () => {
    expect(parseLegacyContentPath('install-leather', { allowGuidePrefix: false })).toEqual({
      kind: 'slug',
      slug: 'install-leather',
    });
    expect(parseLegacyContentPath('install-leather/', { allowGuidePrefix: false })).toEqual({
      kind: 'slug',
      slug: 'install-leather',
    });
  });

  it('reads guide/<slug> only where the guide prefix is allowed', () => {
    expect(parseLegacyContentPath('guide/install-leather', { allowGuidePrefix: true })).toEqual({
      kind: 'slug',
      slug: 'install-leather',
    });
    expect(parseLegacyContentPath('guide/install-leather', { allowGuidePrefix: false })).toEqual({
      kind: 'unknown',
    });
  });

  it('treats deeper paths as unknown', () => {
    expect(parseLegacyContentPath('a/b', { allowGuidePrefix: true })).toEqual({ kind: 'unknown' });
    expect(parseLegacyContentPath('guide/a/b', { allowGuidePrefix: true })).toEqual({
      kind: 'unknown',
    });
  });
});
