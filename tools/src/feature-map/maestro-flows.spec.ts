import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { getFeatureMapAppConfig, toRepoRelative } from './app-config.js';
import { loadMaestroActions, loadMaestroFlows } from './maestro-flows.js';

const tempDir = mkdtempSync(path.join(tmpdir(), 'feature-map-maestro-'));
const mobile = getFeatureMapAppConfig('mobile');

function writeFlows(files: Record<string, string>) {
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(tempDir, file)), { recursive: true });
    writeFileSync(path.join(tempDir, file), text);
  }
}

writeFlows({
  'flows/smoke.yaml': 'appId: x\n---\n- launchApp\n',
  'flows/nested/receive.yml': 'appId: x\n',
  'flows/README.md': '# flows',
  'shared/unlock.yaml': 'appId: x\n',
  'legacy-flows/old.yaml': 'appId: x\n',
});

describe(loadMaestroFlows.name, () => {
  test('lists the yaml flows of the given dirs by repo-relative path', () => {
    const flows = loadMaestroFlows([path.join(tempDir, 'flows'), path.join(tempDir, 'shared')]);
    expect([...flows.keys()]).toEqual(
      ['flows/nested/receive.yml', 'flows/smoke.yaml', 'shared/unlock.yaml'].map(file =>
        toRepoRelative(path.join(tempDir, file))
      )
    );
    const smoke = toRepoRelative(path.join(tempDir, 'flows/smoke.yaml'));
    expect(flows.get(smoke)).toEqual({ path: smoke, routeKeys: [] });
  });

  test('accepts the mobile flows and shared sub-flows but not the legacy flows', () => {
    const flows = loadMaestroFlows(mobile.maestro?.flowsDirs ?? []);
    expect(flows.has('apps/mobile/maestro/flows/smoke-tests.yaml')).toBe(true);
    expect(flows.has('apps/mobile/maestro/shared/unlock.yaml')).toBe(true);
    expect([...flows.keys()].some(flow => flow.includes('legacy-flows'))).toBe(false);
  });
});

describe(loadMaestroActions.name, () => {
  test('names each shared sub-flow by repo-relative path', () => {
    const actions = loadMaestroActions(path.join(tempDir, 'shared'));
    const unlock = path.join(tempDir, 'shared/unlock.yaml');
    expect([...actions.entries()]).toEqual([[toRepoRelative(unlock), { file: unlock, line: 1 }]]);
  });

  test('finds the mobile unlock and clean-up sub-flows', () => {
    const actionsDir = mobile.maestro?.actionsDir;
    if (!actionsDir) throw new Error('mobile config has no maestro actionsDir');
    const actions = loadMaestroActions(actionsDir);
    expect([...actions.keys()]).toEqual([
      'apps/mobile/maestro/shared/clean-up.yaml',
      'apps/mobile/maestro/shared/unlock.yaml',
    ]);
  });
});
