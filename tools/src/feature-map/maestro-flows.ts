import { toRepoRelative } from './app-config.js';
import { type SpecFile } from './test-assets.js';
import { type SourceLocation, listFiles } from './ts-ast.js';

const flowFilePattern = /\.ya?ml$/;
const flowLine = 1;

function listFlowFiles(dir: string): string[] {
  return listFiles(dir, file => flowFilePattern.test(file));
}

export function loadMaestroFlows(dirs: readonly string[]): Map<string, SpecFile> {
  const flows = new Map<string, SpecFile>();
  for (const file of dirs.flatMap(listFlowFiles)) {
    const relative = toRepoRelative(file);
    flows.set(relative, { path: relative, routeKeys: [] });
  }
  return flows;
}

export function loadMaestroActions(dir: string): Map<string, SourceLocation> {
  const actions = new Map<string, SourceLocation>();
  for (const file of listFlowFiles(dir)) {
    actions.set(toRepoRelative(file), { file, line: flowLine });
  }
  return actions;
}
