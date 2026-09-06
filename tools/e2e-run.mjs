/* Run the browser suites against a server of their own.

   They were run against whatever server happened to be up, which meant
   whatever database happened to be there. Each run leaves accounts, classes
   and assignments behind, so the second run trips over the first: a suite that
   passes on its own fails in a batch, and a green result you cannot repeat is
   not a green result. This starts one server on a spare port with an empty
   database, runs the suites through it, and throws the database away.

     node tools/e2e-run.mjs                 # all of them
     node tools/e2e-run.mjs e2e-classes     # just one
*/

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const ALL = ['e2e', 'e2e-language', 'e2e-classes', 'e2e-teacher'];
const suites = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

/* A port nobody else is on, rather than the development 8099. */
const port = 8100 + Math.floor(Math.random() * 800);
const base = `http://127.0.0.1:${port}`;
const dir = mkdtempSync(join(tmpdir(), 'wh-e2e-'));

const server = spawn(process.execPath, [join(ROOT, 'server', 'index.mjs')], {
  cwd: ROOT,
  env: { ...process.env, PORT: String(port), DATABASE: join(dir, 'test.db') },
  stdio: ['ignore', 'pipe', 'pipe']
});
let serverLog = '';
server.stdout.on('data', d => { serverLog += d; });
server.stderr.on('data', d => { serverLog += d; });

const cleanup = () => {
  server.kill();
  try { rmSync(dir, { recursive: true, force: true }); } catch { /* already gone */ }
};
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(130); });

/** Wait for the server to answer, rather than guessing at a sleep. */
async function ready(timeoutMs = 15000) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    try {
      const res = await fetch(`${base}/index.html`);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 200));
  }
  return false;
}

if (!await ready()) {
  console.error(`Server did not start on ${port}.\n${serverLog}`);
  process.exit(1);
}

const run = suite => new Promise(resolve => {
  const child = spawn(process.execPath, [join(HERE, `${suite}.mjs`), base],
    { cwd: ROOT, stdio: 'inherit' });
  child.on('exit', code => resolve(code === 0));
});

let failed = 0;
for (const suite of suites) {
  console.log(`\n──── ${suite} ────`);
  if (!await run(suite)) failed++;
}

console.log(failed ? `\n${failed} suite(s) failed.` : `\nAll ${suites.length} suites passed.`);
process.exit(failed ? 1 : 0);
