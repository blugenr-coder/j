// Bundles the studio into one HTML file for a claude.ai artifact:
// engine + sample + viewer + app become one inline module, and three.js
// loads from jsDelivr's ESM build (the artifact CSP allows that CDN).
//
//   node artoo/artifact/build.mjs [out.html]

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const JS = path.join(HERE, '..', 'public', 'js');
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.186.1';
const out = process.argv[2] || path.join(HERE, 'dist', 'artoo-studio.html');

const header = [
  `import * as THREE from '${CDN}/+esm';`,
  `import { MarchingCubes } from '${CDN}/examples/jsm/objects/MarchingCubes.js/+esm';`,
  `import { mergeVertices } from '${CDN}/examples/jsm/utils/BufferGeometryUtils.js/+esm';`,
  `import { GLTFExporter } from '${CDN}/examples/jsm/exporters/GLTFExporter.js/+esm';`,
  `import { OBJExporter } from '${CDN}/examples/jsm/exporters/OBJExporter.js/+esm';`,
  `import { STLExporter } from '${CDN}/examples/jsm/exporters/STLExporter.js/+esm';`,
  `import { OrbitControls } from '${CDN}/examples/jsm/controls/OrbitControls.js/+esm';`,
  `import { GLTFLoader } from '${CDN}/examples/jsm/loaders/GLTFLoader.js/+esm';`,
  `import { RoomEnvironment } from '${CDN}/examples/jsm/environments/RoomEnvironment.js/+esm';`,
].join('\n');

const sources = [
  [path.join(JS, 'engine.js')], [path.join(JS, 'sample.js')], [path.join(JS, 'viewer.js')],
  [path.join(JS, 'depth.js')], [path.join(JS, 'match.js')], [path.join(HERE, 'app.js')],
];

const seen = new Map();
let body = '';
for (const [file] of sources) {
  let src = await readFile(file, 'utf8');
  src = src.replace(/^import .*;$/gm, '').replace(/^export \{[^}]*\};$/gm, '').replace(/^export /gm, '');
  for (const m of src.matchAll(/^(?:async )?(?:function\*? |const |let |class )([A-Za-z_$][\w$]*)/gm)) {
    if (seen.has(m[1])) throw new Error(`"${m[1]}" is declared in both ${seen.get(m[1])} and ${path.basename(file)}`);
    seen.set(m[1], path.basename(file));
  }
  body += `\n// ---- ${path.basename(file)} ----\n${src}`;
}

const page = await readFile(path.join(HERE, 'page.html'), 'utf8');
const html = page.replace('<!--APP-->', () => `<script type="module">\n${header}\n${body}\n</script>\n`);
await import('node:fs').then(fs => fs.mkdirSync(path.dirname(out), { recursive: true }));
await writeFile(out, html);
console.log(`${out}  ${(html.length / 1024).toFixed(0)} KB`);
