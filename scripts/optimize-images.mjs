import sharp from 'sharp';
import { readdir, stat, rename } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'public/img';
const MAX_W = 1600;
const JPG_QUALITY = 82;
const PNG_QUALITY = 82;
const SKIP_DIRS = new Set(['SVG-WEB-TACOS-STREET']);

let totalBefore = 0;
let totalAfter = 0;
let count = 0;
let skipped = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(p);
    } else if (e.isFile()) {
      const ext = extname(e.name).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        await optimize(p, ext);
      }
    }
  }
}

async function optimize(file, ext) {
  try {
    const before = (await stat(file)).size;
    const img = sharp(file, { failOn: 'none' });
    const meta = await img.metadata();
    const resize = meta.width && meta.width > MAX_W ? { width: MAX_W, withoutEnlargement: true } : null;
    let pipeline = sharp(file, { failOn: 'none' }).rotate();
    if (resize) pipeline = pipeline.resize(resize);
    if (ext === '.png') {
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true });
    } else {
      pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true });
    }
    const tmp = file + '.opt.tmp';
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;
    if (after < before) {
      await rename(tmp, file);
      totalBefore += before;
      totalAfter += after;
      count++;
      const pct = ((1 - after / before) * 100).toFixed(0);
      console.log(`  ${file}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB (-${pct}%)`);
    } else {
      const { unlink } = await import('node:fs/promises');
      await unlink(tmp);
      skipped++;
      console.log(`  ${file}: skipped (already optimized)`);
    }
  } catch (err) {
    console.error(`  ${file}: FAILED - ${err.message}`);
  }
}

console.log(`Optimizing images in ${ROOT}...\n`);
await walk(ROOT);
console.log(`\nDone. ${count} files optimized, ${skipped} skipped.`);
console.log(`Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB`);
console.log(`Saved: ${((totalBefore-totalAfter)/1024/1024).toFixed(1)}MB (${((1-totalAfter/totalBefore)*100).toFixed(0)}%)`);
