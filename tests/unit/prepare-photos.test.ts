import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { preparePhoto } from '../../scripts/lib/prepare-photos';

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'photos-'));
  await sharp({
    create: { width: 3000, height: 2000, channels: 3, background: '#db3a34' },
  })
    .jpeg()
    .toFile(path.join(dir, 'Demo Day 2.jpg'));
});

afterEach(() => rm(dir, { recursive: true, force: true }));

describe('preparePhoto', () => {
  test('resizes to 2400 px, slugifies the name, and returns a blur data URL', async () => {
    const out = path.join(dir, 'out');
    const result = await preparePhoto(path.join(dir, 'Demo Day 2.jpg'), out);
    expect(result.slug).toBe('demo-day-2');
    expect(result.width).toBe(2400);
    expect(result.height).toBe(1600);
    expect(result.blurDataURL.startsWith('data:image/jpeg;base64,')).toBe(true);
    const meta = await sharp(path.join(out, 'demo-day-2.jpg')).metadata();
    expect(meta.width).toBe(2400);
    expect(meta.exif).toBeUndefined();
  });
});
