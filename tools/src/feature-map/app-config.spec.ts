import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { getMonorepoRoot } from '../utils/paths.js';
import { getFeatureMapAppConfig, toRepoRelative } from './app-config.js';

describe(getFeatureMapAppConfig.name, () => {
  test('configures the mobile app from expo-router screens, Maestro flows and rpc dispatch files', () => {
    const config = getFeatureMapAppConfig('mobile');
    expect(config.app).toBe('mobile');
    expect(toRepoRelative(config.routeUrlsFile)).toBe('apps/mobile/src/shared/app-routes.ts');
    expect(config.routeUrlsObjectName).toBe('AppRoutes');
    expect(toRepoRelative(config.featuresDir)).toBe('apps/mobile/tests/feature-map');
    expect(toRepoRelative(config.selectorsDir)).toBe('apps/mobile/src/shared/selectors');
    expect(config.featureFlagHooks).toEqual(['useBoolVariation', 'useStringVariation']);
    expect(config.rpcDispatchFiles?.map(toRepoRelative)).toEqual([
      'apps/mobile/src/features/browser/browser/message-routing.ts',
      'apps/mobile/src/features/browser/approver-sheet/browser-approver.tsx',
    ]);
    expect(config.expoRouter?.gateComponents).toEqual({ SplashScreenGuard: 'splashScreen' });
    expect(config.maestro?.flowsDirs.map(toRepoRelative)).toEqual([
      'apps/mobile/maestro/flows',
      'apps/mobile/maestro/shared',
    ]);
    expect(config.maestro?.actionsDir).toBe(
      path.join(getMonorepoRoot(), 'apps/mobile/maestro/shared')
    );
    expect(config.outputFile).toBe(
      path.join(getMonorepoRoot(), '.claude/skills/feature-map/mobile.md')
    );
  });

  test('leaves the extension-only fields off the mobile config', () => {
    const config = getFeatureMapAppConfig('mobile');
    expect(config.featureFlagsInterfaceName).toBeUndefined();
    expect(config.rpcMethodsDir).toBeUndefined();
    expect(config.pageObjectsDir).toBeUndefined();
    expect(config.mocksDir).toBeUndefined();
    expect(config.setupMocksFunctionName).toBeUndefined();
  });

  test('keeps the extension on its router, page objects and mocks', () => {
    const config = getFeatureMapAppConfig('extension');
    expect(config.featureFlagsInterfaceName).toBe('FeatureFlags');
    expect(config.setupMocksFunctionName).toBe('setupMockApis');
    expect(config.expoRouter).toBeUndefined();
    expect(config.maestro).toBeUndefined();
    expect(config.rpcDispatchFiles).toBeUndefined();
  });

  test('rejects an unknown app', () => {
    expect(() => getFeatureMapAppConfig('web')).toThrow(
      "feature-map: unsupported app 'web'. Supported apps: extension, mobile"
    );
  });
});
