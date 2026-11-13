import { z } from 'zod';

export interface ChromeHandle {
  chrome: 'none';
}

const chromeHandleSchema = z.object({ chrome: z.literal('none') });

export function hidesChrome(handle: unknown) {
  return chromeHandleSchema.safeParse(handle).success;
}
