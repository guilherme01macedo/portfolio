import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const MAX_EDGE = 2400;
const QUALITY = 82;
const BLUR_WIDTH = 16;

export type Prepared = {
  slug: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export function slugify(fileName: string): string {
  return path
    .basename(fileName, path.extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Resize one photo, strip its metadata, and build a blur placeholder. */
export async function preparePhoto(
  input: string,
  outDir: string,
): Promise<Prepared> {
  const slug = slugify(input);
  await mkdir(outDir, { recursive: true });
  const image = sharp(input).rotate();
  const info = await image
    .clone()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(path.join(outDir, `${slug}.jpg`));
  const blur = await image
    .clone()
    .resize({ width: BLUR_WIDTH })
    .jpeg({ quality: 40 })
    .toBuffer();
  return {
    slug,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString('base64')}`,
  };
}

/** Prepare every JPEG or PNG in srcDir and merge the blur entries into outDir/blur.json. */
export async function preparePhotos(
  srcDir: string,
  outDir: string,
): Promise<Prepared[]> {
  const files = (await readdir(srcDir))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();
  const blurPath = path.join(outDir, 'blur.json');
  const blur = JSON.parse(
    await readFile(blurPath, 'utf8').catch(() => '{}'),
  ) as Record<string, string>;
  const results: Prepared[] = [];
  const seenSlugs = new Set<string>();
  for (const file of files) {
    const slug = slugify(file);
    if (seenSlugs.has(slug)) {
      throw new Error(`two files produce the same slug "${slug}"`);
    }
    seenSlugs.add(slug);
    const prepared = await preparePhoto(path.join(srcDir, file), outDir);
    blur[prepared.slug] = prepared.blurDataURL;
    results.push(prepared);
  }
  await mkdir(outDir, { recursive: true });
  await writeFile(blurPath, `${JSON.stringify(blur, null, 2)}\n`);
  return results;
}
