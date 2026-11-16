import { existsSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

import { type ExpoRouterConfig } from './app-config.js';
import { type RouteReference, type RoutedRoute, type RouterModel } from './routers-parser.js';
import { listFiles, parseSourceFile } from './ts-ast.js';

interface ExpoScreen {
  readonly file: string;
  readonly path: string;
}

const screenFilePattern = /\.(tsx?|jsx?)$/;
const specFilePattern = /\.spec\.[jt]sx?$/;
const layoutFileNames = ['_layout.tsx', '_layout.ts', '_layout.jsx', '_layout.js'];
const groupSegmentPattern = /^\(.+\)$/;
const indexSegment = 'index';
const screenLine = 1;

function isScreenFile(file: string): boolean {
  const name = path.basename(file);
  if (!screenFilePattern.test(name) || specFilePattern.test(name)) return false;
  return !name.startsWith('_') && !name.startsWith('+');
}

export function expoScreenPath(relativeFile: string): string {
  const segments = relativeFile
    .split(/[\\/]/)
    .map((segment, index, all) =>
      index === all.length - 1 ? segment.replace(screenFilePattern, '') : segment
    )
    .filter(segment => segment !== indexSegment && !groupSegmentPattern.test(segment));
  return `/${segments.join('/')}`;
}

export function listExpoScreens(appDir: string): ExpoScreen[] {
  return listFiles(appDir, isScreenFile).map(file => ({
    file,
    path: expoScreenPath(path.relative(appDir, file)),
  }));
}

function collectJsxTagNames(sourceFile: ts.SourceFile): string[] {
  const tags: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      tags.push(node.tagName.getText(sourceFile));
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return tags;
}

function layoutGates(file: string, gateComponents: ExpoRouterConfig['gateComponents']): string[] {
  return collectJsxTagNames(parseSourceFile(file))
    .map(tag => gateComponents[tag])
    .filter(gate => gate !== undefined);
}

function layoutDirsAbove(appDir: string, file: string): string[] {
  const relative = path.relative(appDir, path.dirname(file));
  const segments = relative === '' ? [] : relative.split(path.sep);
  return [
    appDir,
    ...segments.map((_, index) => path.join(appDir, ...segments.slice(0, index + 1))),
  ];
}

function findLayoutFile(dir: string): string | undefined {
  return layoutFileNames.map(name => path.join(dir, name)).find(file => existsSync(file));
}

export function screenGates(expo: ExpoRouterConfig, file: string): string[] {
  const gates: string[] = [];
  for (const dir of layoutDirsAbove(expo.appDir, file)) {
    const layout = findLayoutFile(dir);
    if (!layout) continue;
    for (const gate of layoutGates(layout, expo.gateComponents)) {
      if (!gates.includes(gate)) gates.push(gate);
    }
  }
  return gates;
}

export function parseExpoRoutes(
  expo: ExpoRouterConfig,
  routeUrls: ReadonlyMap<string, string>
): RouterModel {
  const routes: RoutedRoute[] = listExpoScreens(expo.appDir).map(screen => ({
    file: screen.file,
    line: screenLine,
    keys: [...routeUrls].filter(([, value]) => value === screen.path).map(([key]) => key),
    path: screen.path,
    mountedPath: screen.path,
    gates: screenGates(expo, screen.file),
    flags: [],
    parentKeys: [],
    isIndex: false,
  }));
  const references = new Map<string, RouteReference[]>();
  for (const route of routes) {
    for (const key of route.keys) {
      const list = references.get(key) ?? [];
      list.push({ key, file: route.file, line: route.line });
      references.set(key, list);
    }
  }
  return { routes, references, unresolved: [] };
}
