interface LegacyPathToContentSlug {
  path: string;
  slug: string;
}

interface LegacyPathToFixedPath {
  path: string;
  to: string;
}

type LegacyPathRedirect = LegacyPathToContentSlug | LegacyPathToFixedPath;

function toContentSlug(slug: string, paths: string[]): LegacyPathRedirect[] {
  return paths.map(path => ({ path, slug }));
}

function toFixedPath(to: string, paths: string[]): LegacyPathRedirect[] {
  return paths.map(path => ({ path, to }));
}

export const legacyPathRedirects: readonly LegacyPathRedirect[] = [
  ...toContentSlug('privacy-policy', ['/privacy-policy', '/old-page/privacy-policy']),
  ...toContentSlug('terms-of-service', ['/terms', '/old-page/terms']),
  ...toContentSlug('security', ['/security']),
  ...toContentSlug('wallets-comparison', ['/wallet-apps', '/old-page/wallet-apps']),
  ...toFixedPath('/', [
    '/wallet',
    '/wallet/mobile',
    '/wallet/extension',
    '/download',
    '/install',
    '/mobilewaitlist',
    '/install-desktop',
    '/install-extension',
    '/old-page',
    '/old-page/home',
    '/old-page/install-extension',
    '/old-page/install-desktop',
    '/old-page/mobilewaitlist',
  ]),
  ...toFixedPath('/support', [
    '/contact',
    '/help',
    '/guides',
    '/frequent-questions',
    '/old-page/guides',
    '/old-page/frequent-questions',
    '/old-page/contact',
  ]),
  ...toFixedPath('/posts', ['/old-page/blog', '/old-page/learn']),
  ...toFixedPath('/developers', ['/old-page/developer-docs']),
];

export function stripTrailingSlashes(pathname: string) {
  const stripped = pathname.replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
}

export function findLegacyPathRedirect(pathname: string) {
  const path = stripTrailingSlashes(pathname).toLowerCase();
  return legacyPathRedirects.find(redirect => redirect.path === path) ?? null;
}
