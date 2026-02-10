/**
 * Thumbnail Generation Script
 * Generates small WebP thumbnail previews for all images in the assets folder.
 * Thumbnails are saved as `<name>_thumb.webp` alongside the originals.
 *
 * Run: node scripts/generate-thumbnails.mjs
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, '..', 'assets');
const THUMB_WIDTH = 40;      // Very small — just for blur placeholder
const THUMB_QUALITY = 30;

async function getAllImages(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await getAllImages(fullPath)));
        } else {
            const ext = extname(entry.name).toLowerCase();
            const base = basename(entry.name);
            // Skip existing thumbnails
            if (base.includes('_thumb')) continue;
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}

async function generateThumbnail(filePath) {
    const dir = dirname(filePath);
    const base = basename(filePath);
    const nameWithoutExt = base.replace(/\.[^/.]+$/, '');
    const thumbPath = join(dir, `${nameWithoutExt}_thumb.webp`);

    // Skip if thumbnail already exists and is newer than the source
    try {
        const srcStat = await stat(filePath);
        const thumbStat = await stat(thumbPath);
        if (thumbStat.mtime >= srcStat.mtime) {
            console.log(`  SKIP ${filePath.split('assets')[1]} (thumbnail up-to-date)`);
            return;
        }
    } catch {
        // Thumbnail doesn't exist yet — create it
    }

    try {
        await sharp(filePath)
            .resize(THUMB_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: THUMB_QUALITY })
            .toFile(thumbPath);

        const thumbSize = (await stat(thumbPath)).size;
        console.log(`  OK   ${filePath.split('assets')[1]} -> _thumb.webp (${Math.round(thumbSize / 1024)}KB)`);
    } catch (err) {
        console.error(`  ERR  ${filePath}: ${err.message}`);
    }
}

async function main() {
    console.log('🖼️  Thumbnail Generation Script');
    console.log(`   Assets dir: ${ASSETS_DIR}`);
    console.log(`   Thumb width: ${THUMB_WIDTH}px`);
    console.log(`   Quality: ${THUMB_QUALITY}\n`);

    const images = await getAllImages(ASSETS_DIR);
    console.log(`Found ${images.length} source images.\n`);

    for (const img of images) {
        await generateThumbnail(img);
    }

    console.log('\n✅ Done! Thumbnails generated.');
}

main().catch(console.error);
