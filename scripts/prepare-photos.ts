import { existsSync } from 'node:fs';
import path from 'node:path';
import { preparePhotos } from './lib/prepare-photos';

async function main() {
  const srcDir = path.resolve(process.argv[2] ?? 'photos-src');
  if (!existsSync(srcDir)) {
    console.error(`Create ${srcDir} and put the original JPEG or PNG files there.`);
    process.exit(1);
  }
  const outDir = path.resolve('public/photos');
  const results = await preparePhotos(srcDir, outDir);
  if (results.length === 0) {
    console.log(`No JPEG or PNG files found in ${srcDir}.`);
    return;
  }
  console.log(`Prepared ${results.length} photo(s) into ${outDir}.`);
  console.log(
    'Paste these into src/content/photos.ts and write the alt text:\n',
  );
  for (const r of results) {
    console.log(
      `  { slug: '${r.slug}', alt: '', width: ${r.width}, height: ${r.height} },`,
    );
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
