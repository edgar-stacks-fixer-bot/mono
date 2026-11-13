import { type APIRequestContext, expect, test } from '@playwright/test';

const permanentRedirectStatus = 301;
const okStatus = 200;
const notFoundStatus = 404;

const oneHopRedirects = [
  { from: '/help-center/guide/install-leather', to: '/support/install-leather' },
  { from: '/help-center/install-leather', to: '/support/install-leather' },
  {
    from: '/help-center/guide/what-is-stacks?query=value',
    to: '/posts/what-is-stacks?query=value',
  },
  { from: '/help-center/search?q=fees', to: '/support/search?q=fees' },
  { from: '/help-center', to: '/support' },
  { from: '/help-center/', to: '/support' },
  { from: '/guides/send-stacks-from-app', to: '/support/send-stx' },
  { from: '/support/guide/install-leather', to: '/support/install-leather' },
  { from: '/support/guide/what-is-stacks', to: '/posts/what-is-stacks' },
  { from: '/support/what-is-stacks', to: '/posts/what-is-stacks' },
  { from: '/posts/install-leather', to: '/support/install-leather' },
  {
    from: '/posts/send-ordinals',
    to: '/posts/deprecation-of-ordinals-inscriptions-support-in-leather',
  },
  { from: '/posts/apps-xlink', to: '/posts/brotocol' },
];

const notFoundPaths = [
  '/posts/no-such-post',
  '/support/no-such-guide',
  '/support/guide/no-such-guide',
  '/help-center/a/b',
];

async function getWithoutRedirects(request: APIRequestContext, path: string) {
  return request.get(path, { maxRedirects: 0 });
}

function toPathWithSearch(location: string) {
  const url = new URL(location, 'http://localhost');
  return `${url.pathname}${url.search}`;
}

test.describe('Content redirects', () => {
  for (const { from, to } of oneHopRedirects) {
    test(`redirects ${from} to ${to} in one hop`, async ({ request }) => {
      const response = await getWithoutRedirects(request, from);
      const location = response.headers()['location'] ?? '';

      expect(response.status()).toBe(permanentRedirectStatus);
      expect(toPathWithSearch(location)).toBe(to);

      const target = await getWithoutRedirects(request, to);
      expect(target.status()).toBe(okStatus);
    });
  }

  for (const path of notFoundPaths) {
    test(`returns 404 for ${path}`, async ({ request }) => {
      const response = await getWithoutRedirects(request, path);

      expect(response.status()).toBe(notFoundStatus);
    });
  }
});
