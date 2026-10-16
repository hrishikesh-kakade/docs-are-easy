import type { DocType, Fmt, Spec } from '../data/types';

export type Meta = { format: Fmt; bytes: number; w?: number; h?: number };
export type Check = { key: 'format' | 'size' | 'dims'; ok: boolean };
export type Verdict = { status: 'pass' | 'review' | 'fail' | 'unverified'; checks: Check[] };
const VISUAL: DocType[] = ['photo', 'signature', 'thumb'];

/** mm/cm become pixels only when the notification states a DPI. A DPI is never invented. */
export function pxSize(s: Spec): { w: number; h: number } | null {
  if (s.width == null || s.height == null) return null;
  const u = s.unit ?? 'px';
  if (u === 'px') return { w: s.width, h: s.height };
  if (!s.dpi) return null;
  const f = (u === 'mm' ? 1 / 25.4 : 1 / 2.54) * s.dpi;
  return { w: Math.round(s.width * f), h: Math.round(s.height * f) };
}
export function presetFor(s: Spec) {
  const d = pxSize(s);
  return { w: d?.w, h: d?.h, minKB: s.minKB, maxKB: s.maxKB };
}

export function validateOutput(spec: Spec | null, docType: DocType, meta: Meta, verified: boolean): Verdict {
  if (!spec || !verified) return { status: 'unverified', checks: [] };
  const checks: Check[] = [];
  if (spec.outputFormats.length) checks.push({ key: 'format', ok: spec.outputFormats.includes(meta.format) });
  if (spec.minKB != null || spec.maxKB != null) {
    const min = (spec.minKB ?? 0) * 1024;
    const max = spec.maxKB == null ? Infinity : spec.maxKB * 1000 >= min ? spec.maxKB * 1000 : spec.maxKB * 1024;
    checks.push({ key: 'size', ok: meta.bytes >= min && meta.bytes <= max });
  }
  const d = pxSize(spec);
  if (d && meta.w != null && meta.h != null) checks.push({ key: 'dims', ok: meta.w === d.w && meta.h === d.h });
  if (checks.some((c) => !c.ok)) return { status: 'fail', checks };
  if (!checks.length) return { status: 'unverified', checks };
  return { status: VISUAL.includes(docType) ? 'review' : 'pass', checks };
}
