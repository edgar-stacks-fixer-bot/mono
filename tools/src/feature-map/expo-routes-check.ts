import { toRepoRelative } from './app-config.js';
import { type FeatureMapModel, routeRef, unkeyedRoutes, unroutedKeys } from './model.js';

export function checkExpoRoutes(model: FeatureMapModel): string[] {
  const routeUrlsFile = toRepoRelative(model.config.routeUrlsFile);
  const objectName = model.config.routeUrlsObjectName;
  const unkeyed = unkeyedRoutes(model).map(
    route =>
      `screen ${toRepoRelative(route.file)} ('${route.mountedPath}') has no ${objectName} key. Fix: add a key with the value '${route.mountedPath}' to ${objectName} in ${routeUrlsFile}.`
  );
  const unrouted = unroutedKeys(model).map(
    key =>
      `${routeRef(model, key)} ('${model.routeUrls.get(key) ?? ''}') matches no screen file. Fix: remove the key from ${routeUrlsFile} or set it to the path of a screen file.`
  );
  return [...unkeyed, ...unrouted];
}
