import { data, redirect } from 'react-router';

import { cmsContentFetchers } from './cms-content-fetchers';
import {
  type TerminalResolution,
  resolveContentSlug,
  toTerminalResolution,
} from './content-slug-resolver';

const movedPermanentlyStatus = 301;
const notFoundStatus = 404;
const goneStatus = 410;

export function throwNotFound(): never {
  throw data(null, { status: notFoundStatus });
}

export function throwTerminalResolution(request: Request, resolution: TerminalResolution): never {
  if (resolution.kind === 'redirect') {
    const { search } = new URL(request.url);
    throw redirect(`${resolution.path}${search}`, movedPermanentlyStatus);
  }
  if (resolution.kind === 'gone') throw data(null, { status: goneStatus });
  return throwNotFound();
}

export async function redirectContentSlug(request: Request, slug: string): Promise<never> {
  const resolution = await resolveContentSlug(slug, cmsContentFetchers);
  return throwTerminalResolution(request, toTerminalResolution(slug, resolution));
}
