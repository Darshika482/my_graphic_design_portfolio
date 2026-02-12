/**
 * Aggressive second-pass optimizer.
 * Targets ALL images over 200KB and compresses them hard.
 * Outputs in the same format (jpg->jpg, png->png, webp->webp).
 * Max 1200px, quality 70.
 */

import sharp from 'sharp';
import { readdir, stat, writeFile, unlink, rename } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, '..', 'assets');
const MAX_DIM = 1200;
const QUALITY = 70;
const MIN_SIZE = 200 * 1024; // 200KB threshold

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
        const fp = join(dir, e.name);
        if (e.isDirectory()) files.push(...(await walk(fp)));
        else {
            const ext = extname(e.name).toLowerCase();
            if (e.name.includes('_thumb')) continue;
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) files.push(fp);
        }
    }
    return files;
}

async function main() {
    const images = await walk(ASSETS_DIR);
    let totalSaved = 0;
    let processed = 0;

    for (const fp of images) {
        const s = (await stat(fp)).size;
        if (s < MIN_SIZE) continue;

        const ext = extname(fp).toLowerCase();
        const name = basename(fp);

        try {
            let pipeline = sharp(fp).rotate().resize(MAX_DIM, MAX_DIM, {
                fit: 'inside',
                withoutEnlargement: true,
            });

            let buf;
            if (ext === '.webp') {
                buf = await pipeline.webp({ quality: QUALITY, effort: 6 }).toBuffer();
            } else if (ext === '.png') {
                // Try webp-like compression for PNG
                buf = await pipeline.png({ compressionLevel: 9, quality: QUALITY }).toBuffer();
                // If still big, also try as the same format with lower quality
            } else {
                buf = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
            }

            if (buf.length < s) {
                const tmp = fp + '.tmp';
                await writeFile(tmp, buf);
                await unlink(fp);
                await rename(tmp, fp);
                const saved = s - buf.length;
                totalSaved += saved;
                processed++;
                console.log(`OK  ${name}  ${Math.round(s / 1024)}KB -> ${Math.round(buf.length / 1024)}KB  (-${Math.round(saved / s * 100)}%)`);
            } else {
                console.log(`KEEP ${name} (${Math.round(s / 1024)}KB)`);
            }
        } catch (err) {
            console.error(`ERR  ${name}: ${err.message}`);
        }
    }

    // Count new total
    let newTotal = 0;
    for (const fp of await walk(ASSETS_DIR)) {
        newTotal += (await stat(fp)).size;
    }

    console.log(`\nDone! Compressed ${processed} files.`);
    console.log(`Saved: ${Math.round(totalSaved / 1024 / 1024 * 10) / 10} MB`);
    console.log(`New total: ${Math.round(newTotal / 1024 / 1024 * 10) / 10} MB`);
}

main().catch(console.error);
