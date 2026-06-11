// Genera variante .webp (máx 1200px, q78) de cada jpg/jpeg/png en public/img.
// No borra originales; el código debe referenciar los .webp.
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'public/img';
const MAX_DIM = 1200;
const QUALITY = 78;
const SKIP_DIRS = new Set(['SVG-WEB-TACOS-STREET']);

let totalBefore = 0, totalAfter = 0, count = 0;
const rows = [];

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) await walk(p);
      continue;
    }
    const ext = extname(e.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    const out = p.slice(0, -ext.length) + '.webp';
    try {
      const meta = await sharp(p, { failOn: 'none' }).metadata();
      let pipeline = sharp(p, { failOn: 'none' }).rotate();
      if ((meta.width ?? 0) > MAX_DIM || (meta.height ?? 0) > MAX_DIM) {
        pipeline = pipeline.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true });
      }
      await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(out);
      const before = (await stat(p)).size;
      const after = (await stat(out)).size;
      totalBefore += before; totalAfter += after; count++;
      rows.push({ file: p, kb: before / 1024, webpKb: after / 1024 });
    } catch (err) {
      console.error(`FAILED ${p}: ${err.message}`);
    }
  }
}

await walk(ROOT);
rows.sort((a, b) => b.kb - a.kb);
for (const r of rows.slice(0, 25)) console.log(`${r.kb.toFixed(0)}KB -> ${r.webpKb.toFixed(0)}KB  ${r.file}`);
console.log(`\n${count} convertidas. Total ${(totalBefore / 1048576).toFixed(1)}MB -> ${(totalAfter / 1048576).toFixed(1)}MB`);
