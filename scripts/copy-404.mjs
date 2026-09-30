import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Static hosts serve /404.html for unknown paths — make it the built app. */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');
const source = path.join(dist, 'index.html');
const target = path.join(dist, '404.html');

if (fs.existsSync(source)) {
  fs.copyFileSync(source, target);
  console.log('dist/404.html written');
}
