#!/usr/bin/env node
/**
 * Build-time guard for Vercel serverless functions.
 *
 * Every file under api/ is authored as ESM. Vercel's Node builder decides
 * whether the compiled output is loaded as ESM or CJS from the *nearest*
 * package.json — which, for api/, is the repo root. If that package.json ever
 * loses `"type": "module"`, the build still succeeds and every function then
 * dies at invocation with:
 *
 *   SyntaxError: Cannot use import statement outside a module
 *
 * That happened in production and took the whole API down silently, so this
 * check fails the build instead.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const apiDir = join(repoRoot, 'api');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|mts|js|mjs)$/.test(entry) ? [full] : [];
  });
}

/** Walk up from `file` to the first package.json, like Node's ESM resolver. */
function nearestPackageJson(file) {
  let dir = dirname(file);
  for (;;) {
    const candidate = join(dir, 'package.json');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir || dir.length < repoRoot.length) return null;
    dir = parent;
  }
}

const errors = [];
const files = walk(apiDir);

if (files.length === 0) {
  errors.push('No files found under api/ — expected at least one serverless function.');
}

for (const file of files) {
  const rel = relative(repoRoot, file);
  const source = readFileSync(file, 'utf8');
  const isEsm = /^\s*(import|export)\s/m.test(source);
  const isCjs = /\brequire\s*\(|\bmodule\.exports\b|\bexports\.\w/.test(source);

  if (isEsm && isCjs) {
    errors.push(`${rel}: mixes ESM (import/export) and CJS (require/module.exports) syntax.`);
  }

  if (!isEsm) continue;
  if (file.endsWith('.mjs') || file.endsWith('.mts')) continue; // always ESM

  const pkgPath = nearestPackageJson(file);
  if (!pkgPath) {
    errors.push(`${rel}: no package.json found between the file and the repo root.`);
    continue;
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (pkg.type !== 'module') {
    errors.push(
      `${rel}: uses ESM syntax, but its nearest package.json ` +
        `(${relative(repoRoot, pkgPath)}) has ${
          pkg.type ? `"type": "${pkg.type}"` : 'no "type" field'
        }. ` +
        `Node will load the compiled output as CommonJS and the function will ` +
        `crash on its first import. Add "type": "module" there.`
    );
  }
}

if (errors.length > 0) {
  console.error('\nverify-api-esm: serverless functions would crash at runtime.\n');
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error('');
  process.exit(1);
}

console.log(`verify-api-esm: ${files.length} api file(s) OK (ESM module resolution consistent).`);
