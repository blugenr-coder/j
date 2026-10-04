// Downloads the AI depth files the artifact publishes next to its page:
// ONNX Runtime's WebAssembly binary and Depth Anything V2 Small (int8,
// Apache-2.0), the model split into three Base64 .txt parts because artifacts
// serve text and web media types only, each under 16 MB.
//
//   node artoo/artifact/fetch-ai.mjs   → artoo/artifact/dist/ai/

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist', 'ai');
const WASM = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort-wasm-simd-threaded.wasm';
const MODEL = 'https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model_quantized.onnx';

mkdirSync(OUT, { recursive: true });
const get = (url, file) => execFileSync('curl', ['-sSfL', '-o', file, url], { stdio: 'inherit' });

get(WASM, path.join(OUT, 'ort-wasm-simd-threaded.wasm'));
const tmp = path.join(OUT, 'model.onnx.tmp');
get(MODEL, tmp);
const model = readFileSync(tmp);
const part = Math.ceil(model.length / 3);
for (let k = 0; k < 3; k++) {
  writeFileSync(path.join(OUT, `depth-anything-v2-small-q8.${k + 1}.b64.txt`), model.subarray(k * part, (k + 1) * part).toString('base64'));
}
execFileSync('rm', [tmp]);
console.log(`AI files in ${OUT}`);
