import { renderRobotsTxt, seoFileCacheControl } from './sitemap.utils';

export function loader() {
  return new Response(renderRobotsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': seoFileCacheControl,
    },
  });
}
