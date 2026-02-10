/**
 * Image Compression Script
 * Compresses all JPG/PNG images in the assets folder in-place.
 * - JPGs: re-encoded at quality 80, max 2000px on longest side
 * - PNGs: optimized with compression level 9, max 2000px on longest side
 * 
 * Run: node scripts/compress-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, '..', 'assets');
const MAX_DIMENSION = 2000; // max width or height in pixels
const JPEG_QUALITY = 80;

async function getAllImages(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await getAllImages(fullPath)));
        } else {
            const ext = extname(entry.name).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}

async function compressImage(filePath) {
    const ext = extname(filePath).toLowerCase();
    const before = (await stat(filePath)).size;
    const beforeKB = Math.round(before / 1024);

    // Skip if already small (under 300KB)
    if (before < 300 * 1024) {
        console.log(`  SKIP ${filePath.split('assets')[1]} (${beforeKB}KB - already small)`);
        return { saved: 0, file: filePath };
    }

    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        let pipeline = sharp(filePath).rotate(); // auto-rotate based on EXIF

        // Resize if larger than MAX_DIMENSION
        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        let buffer;
        if (ext === '.png') {
            buffer = await pipeline.png({ quality: JPEG_QUALITY, compressionLevel: 9 }).toBuffer();
        } else {
            buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
        }

        // Only write if we actually saved space
        if (buffer.length < before) {
            const tempPath = filePath + '.tmp';
            const { writeFile, unlink } = await import('fs/promises');
            await writeFile(tempPath, buffer);
            await unlink(filePath);
            await rename(tempPath, filePath);
            const afterKB = Math.round(buffer.length / 1024);
            const savings = Math.round((1 - buffer.length / before) * 100);
            console.log(`  OK   ${filePath.split('assets')[1]}  ${beforeKB}KB -> ${afterKB}KB  (-${savings}%)`);
            return { saved: before - buffer.length, file: filePath };
        } else {
            console.log(`  KEEP ${filePath.split('assets')[1]} (${beforeKB}KB - compression not beneficial)`);
            return { saved: 0, file: filePath };
        }
    } catch (err) {
        console.error(`  ERR  ${filePath}: ${err.message}`);
        return { saved: 0, file: filePath };
    }
}

async function main() {
    console.log('🖼️  Image Compression Script');
    console.log(`   Assets dir: ${ASSETS_DIR}`);
    console.log(`   Max dimension: ${MAX_DIMENSION}px`);
    console.log(`   JPEG quality: ${JPEG_QUALITY}\n`);

    const images = await getAllImages(ASSETS_DIR);
    console.log(`Found ${images.length} images to process:\n`);

    let totalSaved = 0;
    for (const img of images) {
        const result = await compressImage(img);
        totalSaved += result.saved;
    }

    console.log(`\n✅ Done! Total saved: ${Math.round(totalSaved / 1024 / 1024 * 10) / 10} MB`);
}

main().catch(console.error);
