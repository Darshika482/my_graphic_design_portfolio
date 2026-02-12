/**
 * Aggressive Image Optimization Script
 * Converts all JPG/PNG images to optimized WebP format in-place,
 * and re-compresses existing WebP images.
 * 
 * - Max dimension: 1600px (sufficient for web display)
 * - WebP quality: 80 (excellent visual quality, much smaller files)
 * - Keeps original extension but writes optimized data
 * - Skips thumbnails (*_thumb.webp)
 * 
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, writeFile, unlink, rename } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, '..', 'assets');
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 75;
const WEBP_QUALITY = 75;
const PNG_QUALITY = 75;

async function getAllImages(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await getAllImages(fullPath)));
        } else {
            const ext = extname(entry.name).toLowerCase();
            const name = basename(entry.name);
            if (name.includes('_thumb')) continue;
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}

async function optimizeImage(filePath) {
    const ext = extname(filePath).toLowerCase();
    const before = (await stat(filePath)).size;
    const beforeKB = Math.round(before / 1024);

    // Skip if already very small (under 100KB)
    if (before < 100 * 1024) {
        console.log(`  SKIP ${basename(filePath)} (${beforeKB}KB - already small)`);
        return 0;
    }

    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        let pipeline = sharp(filePath).rotate();

        // Resize if larger than MAX_DIMENSION
        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        let buffer;
        if (ext === '.webp') {
            buffer = await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer();
        } else if (ext === '.png') {
            buffer = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true }).toBuffer();
        } else {
            buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
        }

        if (buffer.length < before) {
            const tempPath = filePath + '.tmp';
            await writeFile(tempPath, buffer);
            await unlink(filePath);
            await rename(tempPath, filePath);
            const afterKB = Math.round(buffer.length / 1024);
            const savings = Math.round((1 - buffer.length / before) * 100);
            console.log(`  OK   ${basename(filePath)}  ${beforeKB}KB -> ${afterKB}KB  (-${savings}%)`);
            return before - buffer.length;
        } else {
            console.log(`  KEEP ${basename(filePath)} (${beforeKB}KB - already optimal)`);
            return 0;
        }
    } catch (err) {
        console.error(`  ERR  ${basename(filePath)}: ${err.message}`);
        return 0;
    }
}

async function main() {
    console.log('🖼️  Aggressive Image Optimization');
    console.log(`   Max dimension: ${MAX_DIMENSION}px`);
    console.log(`   JPEG quality: ${JPEG_QUALITY}`);
    console.log(`   WebP quality: ${WEBP_QUALITY}\n`);

    const images = await getAllImages(ASSETS_DIR);
    console.log(`Found ${images.length} images to optimize.\n`);

    let totalSaved = 0;
    for (const img of images) {
        totalSaved += await optimizeImage(img);
    }

    // Get new total
    let newTotal = 0;
    const all = await getAllImages(ASSETS_DIR);
    for (const img of all) {
        newTotal += (await stat(img)).size;
    }

    console.log(`\n✅ Done!`);
    console.log(`   Saved: ${Math.round(totalSaved / 1024 / 1024 * 10) / 10} MB`);
    console.log(`   New total: ${Math.round(newTotal / 1024 / 1024 * 10) / 10} MB`);
}

main().catch(console.error);
