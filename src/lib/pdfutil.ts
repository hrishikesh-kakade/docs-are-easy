/** "1-3, 5, 8-10" becomes [[0,1,2],[4],[7,8,9]] (0-based). Returns null when anything is malformed or out of range. */
export function parseRanges(input: string, total: number): number[][] | null {
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const out: number[][] = [];
  for (const p of parts) {
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(p);
    if (!m) return null;
    const a = Number(m[1]), b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b < a || b > total) return null;
    out.push(Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i));
  }
  return out;
}

export function toRoman(n: number, upper: boolean): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return String(n);
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let r = '';
  for (const [v, s] of map) while (n >= v) { r += s; n -= v; }
  return upper ? r : r.toLowerCase();
}

export const MM = 72 / 25.4; // millimetres to PDF points

/** Bottom-left corner so that a w by h image rotated by `deg` about that corner ends up centred on (cx, cy). */
export function cornerFor(cx: number, cy: number, w: number, h: number, deg: number) {
  const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return { x: cx - (w / 2) * c + (h / 2) * s, y: cy - (w / 2) * s - (h / 2) * c };
}

export const baseName = (n: string) => n.replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{M}\p{N}_-]+/gu, '_') || 'file';
