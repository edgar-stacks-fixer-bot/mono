import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

const explorationThemes = ['light', 'dark'] as const;
export type ExplorationTheme = (typeof explorationThemes)[number];

export const explorationThemeModes = ['both', 'light', 'dark'] as const;
type ExplorationThemeMode = (typeof explorationThemeModes)[number];

export const explorationViewports = {
  popup: { label: 'Popup', width: 390, height: 600 },
  narrow: { label: 'Narrow', width: 320, height: 600 },
} as const;
export type ExplorationViewport = keyof typeof explorationViewports;
const explorationViewportIds: readonly ExplorationViewport[] = ['popup', 'narrow'];

export const explorationContents = ['default', 'long'] as const;
export type ExplorationContent = (typeof explorationContents)[number];

interface ExplorationParams {
  theme: ExplorationThemeMode;
  viewport: ExplorationViewport;
  content: ExplorationContent;
  rails: boolean;
  focus: string | null;
  step: string | null;
}

const defaultExplorationParams: ExplorationParams = {
  theme: 'both',
  viewport: 'popup',
  content: 'default',
  rails: false,
  focus: null,
  step: null,
};

function pickOption<T extends string>(options: readonly T[], value: string | null, fallback: T) {
  return options.find(option => option === value) ?? fallback;
}

export function parseExplorationParams(search: URLSearchParams): ExplorationParams {
  return {
    theme: pickOption(explorationThemeModes, search.get('theme'), defaultExplorationParams.theme),
    viewport: pickOption(
      explorationViewportIds,
      search.get('viewport'),
      defaultExplorationParams.viewport
    ),
    content: pickOption(
      explorationContents,
      search.get('content'),
      defaultExplorationParams.content
    ),
    rails: search.get('rails') === '1',
    focus: search.get('focus') || null,
    step: search.get('step') || null,
  };
}

export function updateExplorationSearch(
  search: URLSearchParams,
  patch: Partial<ExplorationParams>
): URLSearchParams {
  const next = new URLSearchParams(search);
  const params = { ...parseExplorationParams(search), ...patch };

  function setOrDelete(key: string, value: string | null, defaultValue: string | null) {
    if (value === null || value === defaultValue) {
      next.delete(key);
      return;
    }
    next.set(key, value);
  }

  setOrDelete('theme', params.theme, defaultExplorationParams.theme);
  setOrDelete('viewport', params.viewport, defaultExplorationParams.viewport);
  setOrDelete('content', params.content, defaultExplorationParams.content);
  setOrDelete('rails', params.rails ? '1' : null, null);
  setOrDelete('focus', params.focus, null);
  setOrDelete('step', params.step, null);
  return next;
}

export function themesForMode(mode: ExplorationThemeMode): readonly ExplorationTheme[] {
  if (mode === 'both') return explorationThemes;
  return [mode];
}

export function useExplorationParams() {
  const [search, setSearch] = useSearchParams();
  const params = useMemo(() => parseExplorationParams(search), [search]);

  const setParams = useCallback(
    (patch: Partial<ExplorationParams>) => {
      setSearch(current => updateExplorationSearch(current, patch), {
        replace: true,
        preventScrollReset: true,
      });
    },
    [setSearch]
  );

  return { params, setParams };
}
