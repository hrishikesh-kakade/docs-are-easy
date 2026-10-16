import { loadImage } from './image';

export const FONTS = {
  sans: 'system-ui,"Noto Sans Devanagari",sans-serif',
  serif: 'Georgia,"Noto Serif Devanagari",serif',
  mono: 'ui-monospace,Menlo,Consolas,monospace',
  script: '"Segoe Script","Brush Script MT","Noto Sans Devanagari",cursive',
} as const;

const toPng = (cv: HTMLCanvasElement) => new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('png'))), 'image/png'));

/** Text becomes a transparent PNG, so any script (including Hindi) can be stamped onto a PDF. */
export async function textPng(text: string, family: string, color: string): Promise<Blob> {
  const cv = document.createElement('canvas');
  let ctx = cv.getContext('2d')!;
  const font = `bold 120px ${family}`;
  ctx.font = font;
  cv.width = Math.ceil(ctx.measureText(text).width) + 40; cv.height = 200;
  ctx = cv.getContext('2d')!; // resizing resets the context
  ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'middle';
  ctx.fillText(text, 20, 100);
  return toPng(cv);
}

export async function imagePng(file: File): Promise<Blob> {
  const img = await loadImage(file);
  const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
  const cv = document.createElement('canvas');
  cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
  cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height);
  return toPng(cv);
}
