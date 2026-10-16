export type OutFmt = 'jpeg' | 'png' | 'webp' | 'pdf';
export type Spec = { w: number; h: number; minKB: number; maxKB: number; cleanup: boolean; format: OutFmt };
export const EXT: Record<OutFmt, string> = { jpeg: 'jpg', png: 'png', webp: 'webp', pdf: 'pdf' };

/** Detects the type of an uploaded file. HEIC and unknown photo types are treated as JPEG. */
export function formatOf(f: { name: string; type: string }): OutFmt {
  const n = f.name.toLowerCase();
  if (f.type === 'application/pdf' || n.endsWith('.pdf')) return 'pdf';
  if (f.type === 'image/png' || n.endsWith('.png')) return 'png';
  if (f.type === 'image/webp' || n.endsWith('.webp')) return 'webp';
  return 'jpeg';
}
export type Rect = { sx: number; sy: number; sw: number; sh: number };

export const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

export async function loadImage(file: File): Promise<HTMLImageElement> {
  let blob: Blob = file;
  if (/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) {
    const { default: heic2any } = await import('heic2any');
    const out = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    blob = Array.isArray(out) ? out[0] : out;
  }
  const url = URL.createObjectURL(blob);
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error('unreadable'));
    img.src = url;
  });
}

/** Largest crop box with the target aspect ratio, shrunk by zoom and centred on c (image pixels). */
export function cropRect(iw: number, ih: number, aspect: number, zoom: number, c: { x: number; y: number }): Rect {
  const sw = Math.min(iw, ih * aspect) / zoom;
  const sh = sw / aspect;
  return { sx: clamp(c.x - sw / 2, 0, iw - sw), sy: clamp(c.y - sh / 2, 0, ih - sh), sw, sh };
}

function cleanSignature(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const d = ctx.getImageData(0, 0, w, h);
  const p = d.data, n = w * h;
  const g = new Uint8Array(n), hist = new Uint32Array(256);
  for (let i = 0; i < n; i++) {
    const v = (p[i * 4] * 0.299 + p[i * 4 + 1] * 0.587 + p[i * 4 + 2] * 0.114) | 0;
    g[i] = v; hist[v]++;
  }
  const at = (f: number) => { let a = 0; for (let v = 0; v < 256; v++) { a += hist[v]; if (a >= n * f) return v; } return 255; };
  const ink = at(0.02);
  const bg = Math.max(at(0.6) * 0.92, ink + 20);
  for (let i = 0; i < n; i++) {
    const v = clamp(((g[i] - ink) / (bg - ink)) * 255, 0, 255);
    p[i * 4] = p[i * 4 + 1] = p[i * 4 + 2] = v;
  }
  ctx.putImageData(d, 0, 0);
}

/** Raises a JPEG to `target` bytes with valid COM (comment) segments placed right after SOI. */
export async function padJpeg(blob: Blob, target: number): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let need = target - buf.length;
  if (need <= 0) return blob;
  const parts: Uint8Array[] = [buf.slice(0, 2)];
  while (need > 0) {
    const data = Math.max(0, Math.min(need - 4, 65533));
    const seg = new Uint8Array(data + 4);
    seg[0] = 0xff; seg[1] = 0xfe; seg[2] = (data + 2) >> 8; seg[3] = (data + 2) & 255;
    parts.push(seg);
    need -= data + 4;
  }
  parts.push(buf.slice(2));
  return new Blob(parts as BlobPart[], { type: 'image/jpeg' });
}

async function pdfFromJpeg(b: Blob, w: number, h: number): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const jpg = await pdf.embedJpg(new Uint8Array(await b.arrayBuffer()));
  const [pw, ph] = w > h ? [841.89, 595.28] : [595.28, 841.89]; // A4, orientation follows the image
  const k = Math.min((pw - 48) / w, (ph - 48) / h);
  const iw = w * k, ih = h * k;
  pdf.addPage([pw, ph]).drawImage(jpg, { x: (pw - iw) / 2, y: (ph - ih) / 2, width: iw, height: ih });
  return new Blob([(await pdf.save()) as BlobPart], { type: 'application/pdf' });
}

export async function render(img: HTMLImageElement, r: Rect, spec: Spec): Promise<{ blob: Blob; ok: boolean }> {
  const cv = document.createElement('canvas');
  cv.width = spec.w; cv.height = spec.h;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, spec.w, spec.h);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, spec.w, spec.h);
  if (spec.cleanup) cleanSignature(ctx, spec.w, spec.h);

  // KB can mean 1000 or 1024 bytes on different portals: stay over min*1024 and under max*1000 so both readings pass.
  const min = spec.minKB * 1024;
  const max = spec.maxKB * 1000 >= min ? spec.maxKB * 1000 : spec.maxKB * 1024;
  const mime = spec.format === 'webp' ? 'image/webp' : 'image/jpeg';
  const enc = (q: number, m = mime) => new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), m, q));

  if (spec.format === 'png') { // lossless: the size cannot be tuned, so the result is simply checked
    const png = await enc(1, 'image/png');
    return { blob: png, ok: png.size <= max && png.size >= min };
  }
  const make = async (q: number) => {
    const b = await enc(q);
    if (spec.format === 'webp' && b.type !== 'image/webp') throw new Error('webp unsupported');
    return spec.format === 'pdf' ? pdfFromJpeg(b, spec.w, spec.h) : b;
  };
  let best = await make(0.95);
  if (best.size > max) {
    let lo = 0.05, hi = 0.95, found: Blob | null = null;
    for (let i = 0; i < 8; i++) {
      const q = (lo + hi) / 2, b = await make(q);
      if (b.size <= max) { found = b; lo = q; } else hi = q;
    }
    best = found ?? (await make(0.05));
  }
  if (best.size < min && spec.format === 'jpeg') best = await padJpeg(best, Math.min(min + 256, max));
  return { blob: best, ok: best.size <= max && best.size >= min };
}
