import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { snowLoop, veilAmount } from '../src/render/fx';

const read = (f: string) => JSON.parse(new TextDecoder().decode(readFileSync(f)));
const atlas = read('public/fx/snow_atlas.json');
const meta = read('public/fx/snow_flipbook.json');

describe('snow veil (the vfx.snow flipbook)', () => {
  it('reads every frame of the flipbook in order, inside the image', () => {
    const loop = snowLoop(atlas, meta);
    expect(loop.frames.length).toBe(meta.frames);
    expect(loop.fps).toBe(meta.fps);
    for (const f of loop.frames) {
      expect(f.x).toBeGreaterThanOrEqual(0);
      expect(f.y).toBeGreaterThanOrEqual(0);
      expect(f.x + f.w).toBeLessThanOrEqual(1);
      expect(f.y + f.h).toBeLessThanOrEqual(1);
    }
    // name order is play order: frame 1 sits right of frame 0 on the first row
    expect(loop.frames[1].x).toBeGreaterThan(loop.frames[0].x);
    expect(loop.frames[1].y).toBe(loop.frames[0].y);
  });

  it('is not drawn on a dry day, thickens with the snowfall, nearly gone indoors', () => {
    expect(veilAmount(0, 0)).toBe(0);
    expect(veilAmount(0.02, 0)).toBe(0);
    expect(veilAmount(0.3, 0)).toBeLessThan(veilAmount(0.9, 0));
    expect(veilAmount(1, 1)).toBeLessThan(0.06);
    expect(veilAmount(2, 0)).toBe(1);
  });
});
