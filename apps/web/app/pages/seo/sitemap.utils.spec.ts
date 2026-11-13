import {
  escapeXml,
  getSitemapPaths,
  renderRobotsTxt,
  renderSitemapXml,
  staticSitemapPaths,
} from './sitemap.utils';

describe('getSitemapPaths', () => {
  it('lists the static pages first', () => {
    const paths = getSitemapPaths({ postSlugs: [], guideSlugs: [], changelogSlugs: [] });
    expect(paths).toEqual(staticSitemapPaths);
  });

  it('lists guides under /support and posts under /posts', () => {
    const paths = getSitemapPaths({
      postSlugs: ['what-is-stacks'],
      guideSlugs: ['install-leather'],
      changelogSlugs: ['web-portfolio'],
    });
    expect(paths).toContain('/support/install-leather');
    expect(paths).toContain('/posts/what-is-stacks');
    expect(paths).toContain('/changelog/web-portfolio');
  });

  it('lists a slug shared by a guide and a post only at its guide', () => {
    const paths = getSitemapPaths({
      postSlugs: ['install-leather'],
      guideSlugs: ['install-leather'],
      changelogSlugs: [],
    });
    expect(paths).toContain('/support/install-leather');
    expect(paths).not.toContain('/posts/install-leather');
  });

  it('leaves out deprecated slugs, which redirect', () => {
    const paths = getSitemapPaths({
      postSlugs: ['send-ordinals', 'deprecation-of-ordinals-inscriptions-support-in-leather'],
      guideSlugs: ['receive-ordinals'],
      changelogSlugs: [],
    });
    expect(paths).not.toContain('/posts/send-ordinals');
    expect(paths).not.toContain('/support/receive-ordinals');
    expect(paths).toContain('/posts/deprecation-of-ordinals-inscriptions-support-in-leather');
  });

  it('lists each path once', () => {
    const paths = getSitemapPaths({
      postSlugs: ['a', 'a'],
      guideSlugs: ['b', 'b'],
      changelogSlugs: ['c', 'c'],
    });
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe('renderSitemapXml', () => {
  it('renders absolute https://leather.io URLs', () => {
    const xml = renderSitemapXml(['/', '/posts/what-is-stacks']);
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => location);
    expect(locations).toEqual(['https://leather.io/', 'https://leather.io/posts/what-is-stacks']);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('escapes XML special characters', () => {
    const xml = renderSitemapXml(["/posts/a&b'c"]);
    expect(xml).toContain('<loc>https://leather.io/posts/a&amp;b&apos;c</loc>');
  });
});

describe('escapeXml', () => {
  it('escapes every XML entity', () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;'
    );
  });
});

describe('renderRobotsTxt', () => {
  it('allows everything and points at the sitemap', () => {
    const robots = renderRobotsTxt();
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://leather.io/sitemap.xml');
  });
});
