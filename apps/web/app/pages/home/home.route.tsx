import { cmsClient } from '~/constants/cms-client';
import { marketingHeaders, marketingMeta } from '~/pages/seo/marketing-meta';
import { fetchListOrEmpty } from '~/utils/cms/fetch-list-or-empty';

import { type Route } from './+types/home.route';
import { type HomeChangelogEntry, HomePage } from './home.page';

const latestChangelogQuery = `*[
  _type == "changelog" && publishedAt <= now() && defined(slug.current)
] | order(publishedAt desc)[0...4] {
  "slug": slug.current,
  title,
  publishedAt,
  "tags": coalesce(tags[]->name, [])
}`;

export async function loader() {
  const changelogEntries = await fetchListOrEmpty(signal =>
    cmsClient.fetch<HomeChangelogEntry[]>(latestChangelogQuery, {}, { signal })
  );
  return { changelogEntries };
}

export function meta() {
  return marketingMeta({ title: 'Leather', path: '/' });
}

export const headers = marketingHeaders;

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  return <HomePage changelogEntries={loaderData.changelogEntries} />;
}
