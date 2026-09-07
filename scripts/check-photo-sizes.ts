import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const LIMIT = 800 * 1024;
const dir = path.resolve('public/photos');

async function main() {
  const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f));
  const tooBig: string[] = [];
  for (const file of files) {
    const { size } = await stat(path.join(dir, file));
    if (size > LIMIT) tooBig.push(`${file} (${Math.round(size / 1024)} KB)`);
  }
  if (tooBig.length > 0) {
    console.error(
      `These photos are over 800 KB. Run pnpm photos on the originals:\n  ${tooBig.join('\n  ')}`,
    );
    process.exit(1);
  }
  console.log(`${files.length} photo(s) under 800 KB.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
