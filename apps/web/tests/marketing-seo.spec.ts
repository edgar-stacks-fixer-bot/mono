import { expect, test } from '@playwright/test';

const okStatus = 200;
const notFoundStatus = 404;

test.describe('Marketing pages and SEO files', () => {
  test('serves the marketing home at / without a redirect', async ({ request }) => {
    const response = await request.get('/', { maxRedirects: 0 });

    expect(response.status()).toBe(okStatus);
    expect(response.headers()['location']).toBeUndefined();
  });

  test('lists only absolute https://leather.io URLs in the sitemap', async ({ request }) => {
    const response = await request.get('/sitemap.xml', { maxRedirects: 0 });
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => location);

    expect(response.status()).toBe(okStatus);
    expect(locations.length).toBeGreaterThan(0);
    for (const location of locations) expect(location).toMatch(/^https:\/\/leather\.io\//);
    expect(locations).toContain('https://leather.io/');
  });

  test('serves robots.txt pointing at the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt', { maxRedirects: 0 });

    expect(response.status()).toBe(okStatus);
    expect(await response.text()).toContain('Sitemap: https://leather.io/sitemap.xml');
  });

  test('answers unknown paths with a real 404', async ({ request }) => {
    const response = await request.get('/no-such-page', { maxRedirects: 0 });

    expect(response.status()).toBe(notFoundStatus);
  });
});
