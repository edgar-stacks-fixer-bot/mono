const siteOrigin = 'https://leather.io';

export function toSiteUrl(path: string) {
  return new URL(path, siteOrigin).toString();
}
