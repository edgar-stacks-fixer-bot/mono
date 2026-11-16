import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { getFeatureMapAppConfig } from './app-config.js';
import {
  expoScreenPath,
  listExpoScreens,
  parseExpoRoutes,
  screenGates,
} from './expo-routes-parser.js';

const tempDir = mkdtempSync(path.join(tmpdir(), 'feature-map-expo-'));

function writeApp(name: string, files: Record<string, string>): string {
  const appDir = path.join(tempDir, name);
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(appDir, file)), { recursive: true });
    writeFileSync(path.join(appDir, file), text);
  }
  return appDir;
}

const gateComponents = { SplashScreenGuard: 'splashScreen', AccountGuard: 'account' };

describe(expoScreenPath.name, () => {
  test.each([
    ['(tabs)/activity.tsx', '/activity'],
    ['(tabs)/(index)/index.tsx', '/'],
    ['(tabs)/(index)/[assetId]/index.tsx', '/[assetId]'],
    ['settings/index.tsx', '/settings'],
    [
      'settings/wallet/configure/[wallet]/view-secret-key.tsx',
      '/settings/wallet/configure/[wallet]/view-secret-key',
    ],
    ['create-new-wallet.tsx', '/create-new-wallet'],
  ])('maps %s to %s', (file, expected) => {
    expect(expoScreenPath(file)).toBe(expected);
  });
});

describe(listExpoScreens.name, () => {
  test('skips layouts, special files and specs', () => {
    const appDir = writeApp('list', {
      '_layout.tsx': '',
      '+not-found.tsx': '',
      'index.tsx': '',
      '(tabs)/_layout.tsx': '',
      '(tabs)/activity.tsx': '',
      '(tabs)/activity.spec.tsx': '',
      'settings/index.tsx': '',
      'README.md': '',
    });
    expect(listExpoScreens(appDir).map(screen => screen.path)).toEqual([
      '/activity',
      '/',
      '/settings',
    ]);
  });
});

describe(parseExpoRoutes.name, () => {
  const appDir = writeApp('routes', {
    '_layout.tsx':
      'export default function Root() { return <SplashScreenGuard><Stack /></SplashScreenGuard>; }',
    'index.tsx': 'export default function Home() { return null; }',
    'settings/_layout.tsx':
      'export default function Settings() { return <AccountGuard><Stack /></AccountGuard>; }',
    'settings/index.tsx': 'export default function Settings() { return null; }',
    'orphan.tsx': 'export default function Orphan() { return null; }',
  });
  const routeUrls = new Map([
    ['Home', '/'],
    ['Settings', '/settings'],
    ['Missing', '/missing'],
  ]);
  const model = parseExpoRoutes({ appDir, gateComponents }, routeUrls);

  test('turns each screen file into a route keyed by the AppRoutes value it matches', () => {
    const byPath = new Map(model.routes.map(route => [route.mountedPath, route]));
    expect(byPath.get('/')?.keys).toEqual(['Home']);
    expect(byPath.get('/settings')?.keys).toEqual(['Settings']);
    expect(byPath.get('/orphan')?.keys).toEqual([]);
    expect(byPath.get('/settings')?.file).toBe(path.join(appDir, 'settings/index.tsx'));
    expect(model.unresolved).toEqual([]);
  });

  test('derives gates from the layouts above a screen, outermost first', () => {
    const byPath = new Map(model.routes.map(route => [route.mountedPath, route]));
    expect(byPath.get('/')?.gates).toEqual(['splashScreen']);
    expect(byPath.get('/settings')?.gates).toEqual(['splashScreen', 'account']);
  });

  test('records references only for keys with a screen', () => {
    expect([...model.references.keys()].sort()).toEqual(['Home', 'Settings']);
  });
});

describe(screenGates.name, () => {
  test('puts every mobile screen behind the splash screen guard', () => {
    const expo = getFeatureMapAppConfig('mobile').expoRouter;
    if (!expo) throw new Error('mobile config has no expoRouter');
    for (const screen of listExpoScreens(expo.appDir)) {
      expect(screenGates(expo, screen.file)).toEqual(['splashScreen']);
    }
  });
});
