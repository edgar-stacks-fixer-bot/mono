import { describe, expect, test } from 'vitest';

import {
  parseExplorationParams,
  themesForMode,
  updateExplorationSearch,
} from './exploration-params';

describe('exploration params', () => {
  test('falls back to defaults for missing or unknown values', () => {
    expect(parseExplorationParams(new URLSearchParams('theme=sepia&viewport=tv'))).toEqual({
      theme: 'both',
      viewport: 'popup',
      content: 'default',
      rails: false,
      focus: null,
      step: null,
    });
  });

  test('reads every supported value', () => {
    const search = new URLSearchParams(
      'theme=dark&viewport=narrow&content=long&rails=1&focus=popup-page&step=address'
    );
    expect(parseExplorationParams(search)).toEqual({
      theme: 'dark',
      viewport: 'narrow',
      content: 'long',
      rails: true,
      focus: 'popup-page',
      step: 'address',
    });
  });

  test('drops defaults from the URL and keeps unrelated params', () => {
    const search = new URLSearchParams('theme=dark&rails=1&other=kept');
    const next = updateExplorationSearch(search, { theme: 'both', rails: false, step: 'address' });
    expect(next.toString()).toBe('other=kept&step=address');
  });

  test('expands the theme mode into frames', () => {
    expect(themesForMode('both')).toEqual(['light', 'dark']);
    expect(themesForMode('dark')).toEqual(['dark']);
  });
});
