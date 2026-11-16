import { type FeatureMapAppConfig } from './app-config.js';
import { type RpcHandler, loadRpcEndpointNames } from './test-assets.js';
import {
  collectCallFirstStringArguments,
  collectDispatchedEndpoints,
  parseSourceFile,
} from './ts-ast.js';

const rpcMethodProperty = 'method';

export function loadFeatureFlagHookKeys(file: string, hooks: readonly string[]): string[] {
  return [...new Set(collectCallFirstStringArguments(parseSourceFile(file), hooks))];
}

export function loadRpcDispatchHandlers(
  dispatchFiles: readonly string[],
  endpoints: ReadonlyMap<string, string>
): Map<string, RpcHandler> {
  const handlers = new Map<string, RpcHandler>();
  for (const file of dispatchFiles) {
    for (const endpoint of collectDispatchedEndpoints(parseSourceFile(file), rpcMethodProperty)) {
      const method = endpoints.get(endpoint.name);
      if (method === undefined || handlers.has(method)) continue;
      handlers.set(method, { name: method, file, line: endpoint.line, methods: [method] });
    }
  }
  return handlers;
}

export function loadMobileRpcHandlers(config: FeatureMapAppConfig): Map<string, RpcHandler> {
  return loadRpcDispatchHandlers(config.rpcDispatchFiles ?? [], loadRpcEndpointNames(config));
}
