import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { type FeatureMapAppConfig, getFeatureMapAppConfig, toRepoRelative } from './app-config.js';
import { checkFeatureMap } from './check.js';
import { checkExpoRoutes } from './expo-routes-check.js';
import { buildFeatureMapModel } from './model.js';

const tempDir = mkdtempSync(path.join(tmpdir(), 'feature-map-expo-check-'));

function writeFiles(root: string, files: Record<string, string>) {
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
  }
}

function makeConfig(routes: string): FeatureMapAppConfig {
  const appDir = mkdtempSync(path.join(tempDir, 'app-'));
  writeFiles(appDir, {
    'src/app/_layout.tsx': 'export default function Root() { return <SplashScreenGuard />; }',
    'src/app/index.tsx': 'export default function Home() { return null; }',
    'src/app/settings/index.tsx': 'export default function Settings() { return null; }',
    'src/shared/app-routes.ts': routes,
    'src/shared/selectors/home.selectors.ts':
      "export const HomeSelectors = { Home: 'home' } as const;",
    'src/features/feature-flags/index.ts':
      "export function useSwap() { return useBoolVariation('swap', false); }",
  });
  mkdirSync(path.join(appDir, 'tests/feature-map'), { recursive: true });
  const mobile = getFeatureMapAppConfig('mobile');
  return {
    ...mobile,
    appDir,
    routeUrlsFile: path.join(appDir, 'src/shared/app-routes.ts'),
    featureFlagsFile: path.join(appDir, 'src/features/feature-flags/index.ts'),
    rpcDispatchFiles: [],
    featuresDir: path.join(appDir, 'tests/feature-map'),
    selectorsDir: path.join(appDir, 'src/shared/selectors'),
    specsDir: path.join(appDir, 'src'),
    expoRouter: {
      appDir: path.join(appDir, 'src/app'),
      gateComponents: { SplashScreenGuard: 'splashScreen' },
    },
    maestro: { flowsDirs: [], actionsDir: path.join(appDir, 'maestro/shared') },
  };
}

describe(checkExpoRoutes.name, () => {
  test('passes when every screen has a key and every key a screen', () => {
    const config = makeConfig(
      "export const AppRoutes = { Home: '/', Settings: '/settings' } as const;"
    );
    mkdirSync(path.join(config.appDir, 'maestro/shared'), { recursive: true });
    expect(checkExpoRoutes(buildFeatureMapModel(config))).toEqual([]);
  });

  test('fails on a screen file with no AppRoutes key', () => {
    const config = makeConfig("export const AppRoutes = { Home: '/' } as const;");
    mkdirSync(path.join(config.appDir, 'maestro/shared'), { recursive: true });
    const routesFile = toRepoRelative(config.routeUrlsFile);
    expect(checkExpoRoutes(buildFeatureMapModel(config))).toEqual([
      `screen ${toRepoRelative(path.join(config.appDir, 'src/app/settings/index.tsx'))} ('/settings') has no AppRoutes key. Fix: add a key with the value '/settings' to AppRoutes in ${routesFile}.`,
    ]);
  });

  test('fails on an AppRoutes key with no screen file', () => {
    const config = makeConfig(
      "export const AppRoutes = { Home: '/', Settings: '/settings', Gone: '/gone' } as const;"
    );
    mkdirSync(path.join(config.appDir, 'maestro/shared'), { recursive: true });
    const routesFile = toRepoRelative(config.routeUrlsFile);
    expect(checkExpoRoutes(buildFeatureMapModel(config))).toEqual([
      `AppRoutes.Gone ('/gone') matches no screen file. Fix: remove the key from ${routesFile} or set it to the path of a screen file.`,
    ]);
  });

  test('is part of the full check for expo-router apps', () => {
    const config = makeConfig("export const AppRoutes = { Home: '/' } as const;");
    mkdirSync(path.join(config.appDir, 'maestro/shared'), { recursive: true });
    const { errors } = checkFeatureMap(buildFeatureMapModel(config));
    expect(errors.some(error => error.includes("('/settings') has no AppRoutes key"))).toBe(true);
  });
});
