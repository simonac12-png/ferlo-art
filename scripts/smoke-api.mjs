#!/usr/bin/env node
/**
 * Post-deploy smoke check for the live API.
 *
 * The static guard in verify-api-esm.mjs catches module-format breakage before
 * it ships; this catches whatever it can't (a dependency that fails to load, a
 * missing env var, a bad rewrite). Every check is a *read* — the waitlist is
 * probed with GET, which fully loads the function and returns 405 without
 * sending any email.
 *
 *   pnpm smoke:api                       # checks https://www.ferlo.art
 *   pnpm smoke:api https://staging.host  # checks another origin
 */
const base = (process.argv[2] ?? 'https://www.ferlo.art').replace(/\/$/, '');

const checks = [
  { path: '/api/waitlist', method: 'GET', expect: [405], note: 'loads without sending mail' },
  { path: '/api/content', method: 'GET', expect: [200] },
  { path: '/api/popups', method: 'GET', expect: [200] },
  { path: '/api/admin/auth', method: 'GET', expect: [401, 404, 405], note: 'unauthenticated' },
];

let failed = 0;

for (const { path, method, expect, note } of checks) {
  const label = `${method} ${path}${note ? ` (${note})` : ''}`;
  let status;
  try {
    const res = await fetch(`${base}${path}`, { method, redirect: 'manual' });
    status = res.status;
  } catch (error) {
    console.error(`  ✗ ${label} — request failed: ${error.message}`);
    failed++;
    continue;
  }

  if (status >= 500) {
    console.error(`  ✗ ${label} — ${status} (server error; the function likely crashed on load)`);
    failed++;
  } else if (!expect.includes(status)) {
    console.error(`  ✗ ${label} — ${status}, expected one of ${expect.join(', ')}`);
    failed++;
  } else {
    console.log(`  ✓ ${label} — ${status}`);
  }
}

if (failed > 0) {
  console.error(`\nsmoke-api: ${failed} check(s) failed against ${base}\n`);
  process.exit(1);
}

console.log(`\nsmoke-api: all ${checks.length} checks passed against ${base}`);
