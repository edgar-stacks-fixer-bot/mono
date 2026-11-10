import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { getFeatureMapAppConfig } from './app-config.js';
import {
  loadFeatureFlagHookKeys,
  loadMobileRpcHandlers,
  loadRpcDispatchHandlers,
} from './mobile-assets.js';

const tempDir = mkdtempSync(path.join(tmpdir(), 'feature-map-mobile-'));
const mobile = getFeatureMapAppConfig('mobile');

function writeSource(name: string, text: string): string {
  const file = path.join(tempDir, name);
  writeFileSync(file, text);
  return file;
}

describe(loadFeatureFlagHookKeys.name, () => {
  test('reads the first string argument of each flag hook call', () => {
    const file = writeSource(
      'flags.ts',
      [
        "export function useA() { return useBoolVariation('flag_a', false); }",
        "export function useB() { return useStringVariation('flag_b', ''); }",
        "export function useC() { return useBoolVariation('flag_a', true); }",
        "export function useD() { return useOtherHook('not_a_flag'); }",
        'export function useE(key: string) { return useBoolVariation(key, false); }',
      ].join('\n')
    );
    expect(loadFeatureFlagHookKeys(file, ['useBoolVariation', 'useStringVariation'])).toEqual([
      'flag_a',
      'flag_b',
    ]);
  });

  test('finds the mobile LaunchDarkly flags', () => {
    const flags = loadFeatureFlagHookKeys(mobile.featureFlagsFile, mobile.featureFlagHooks ?? []);
    expect(flags).toContain('swap');
    expect(flags).toContain('minimum_app_version');
    expect(flags).toContain('release_onramper_buy');
  });
});

describe(loadRpcDispatchHandlers.name, () => {
  const endpoints = new Map([
    ['getInfo', 'getInfo'],
    ['stxTransferStx', 'stx_transferStx'],
    ['signPsbt', 'signPsbt'],
  ]);

  test('names handlers by method string from case clauses and request.safeParse calls', () => {
    const routing = writeSource(
      'routing.ts',
      'export function route(m: unknown) {\n  return getInfo.request.safeParse(m);\n}'
    );
    const approver = writeSource(
      'approver.tsx',
      [
        'export function Approver({ method }: { method: string }) {',
        '  switch (method) {',
        '    case stxTransferStx.method:',
        '      return stxTransferStx.request.parse({});',
        '    case unknownEndpoint.method:',
        '      return null;',
        '  }',
        '}',
      ].join('\n')
    );
    const handlers = loadRpcDispatchHandlers([routing, approver], endpoints);
    expect([...handlers.values()]).toEqual([
      { name: 'getInfo', file: routing, line: 2, methods: ['getInfo'] },
      { name: 'stx_transferStx', file: approver, line: 3, methods: ['stx_transferStx'] },
    ]);
  });
});

describe(loadMobileRpcHandlers.name, () => {
  test('enumerates every dApp method the mobile browser answers or approves', () => {
    const handlers = loadMobileRpcHandlers(mobile);
    expect([...handlers.keys()].sort()).toEqual([
      'getAddresses',
      'getInfo',
      'sendTransfer',
      'signMessage',
      'signPsbt',
      'stx_callContract',
      'stx_deployContract',
      'stx_getAddresses',
      'stx_signMessage',
      'stx_signStructuredMessage',
      'stx_signTransaction',
      'stx_transferSip10Ft',
      'stx_transferSip9Nft',
      'stx_transferStx',
      'supportedMethods',
    ]);
    expect(handlers.get('getInfo')?.file.endsWith('message-routing.ts')).toBe(true);
    expect(handlers.get('signPsbt')?.file.endsWith('browser-approver.tsx')).toBe(true);
  });
});
