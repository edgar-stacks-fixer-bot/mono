import { cmsClient } from '~/constants/cms-client';

import {
  type HelpCenterGuideBySlugQueryResult,
  type PostBySlugQueryResult,
  helpCenterGuideBySlugQuery,
  postBySlugQuery,
} from '@leather.io/cms';

import type { ContentFetchers } from './content-slug-resolver';

export type CmsGuide = NonNullable<HelpCenterGuideBySlugQueryResult>;
export type CmsPost = NonNullable<PostBySlugQueryResult>;

export const cmsContentFetchers: ContentFetchers<CmsGuide, CmsPost> = {
  fetchGuide(slug) {
    return cmsClient.fetch(helpCenterGuideBySlugQuery, { slug });
  },
  fetchPost(slug) {
    return cmsClient.fetch(postBySlugQuery, { slug });
  },
};
