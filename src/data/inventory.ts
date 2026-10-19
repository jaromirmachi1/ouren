import type { Unit } from '../types';

const LAYOUTS = ['1+kk', '2+kk', '2+1', '3+kk', '3+1', '4+kk'] as const;

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic sample inventory so catalog pages stay stable across reloads. */
export function buildInventory(slug: string, count: number, basePrice = 4_800_000): Unit[] {
  const rand = mulberry32(hashSeed(slug));
  const units: Unit[] = [];
  const total = Math.min(Math.max(count, 1), 36);

  for (let i = 0; i < total; i += 1) {
    const floor = Math.floor(i / 3) + 1;
    const layout = LAYOUTS[Math.floor(rand() * LAYOUTS.length)];
    const area = Math.round(28 + rand() * 72);
    const price = Math.round((basePrice + area * 85_000 + rand() * 400_000) / 10_000) * 10_000;
    const roll = rand();
    const status: Unit['status'] = roll > 0.82 ? 'sold' : roll > 0.68 ? 'reserved' : 'available';
    const terrace = rand() > 0.55 ? Math.round(4 + rand() * 18) : undefined;

    units.push({
      id: `${slug}-${i + 1}`,
      number: `${floor}${String.fromCharCode(65 + (i % 3))}`,
      floor,
      layout,
      area,
      price,
      status,
      terrace,
    });
  }

  return units;
}
