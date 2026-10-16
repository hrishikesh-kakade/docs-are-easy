import { useEffect, useState } from 'react';
import { T, type Lang } from '../i18n';

export type Out = { name: string; blob: Blob; url: string; kb: string };
export const mkOut = (name: string, blob: Blob): Out => ({ name, blob, url: URL.createObjectURL(blob), kb: (blob.size / 1024).toFixed(1) });
export const tick = () => new Promise((r) => setTimeout(r));
export const jpegOf = (cv: HTMLCanvasElement, q = 0.9) => new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('jpg'))), 'image/jpeg', q));

/** Results that are released from memory when replaced or when the tool closes. */
export function useOuts(): [Out[], (o: Out[]) => void] {
  const [outs, set] = useState<Out[]>([]);
  useEffect(() => () => { outs.forEach((o) => URL.revokeObjectURL(o.url)); }, [outs]);
  return [outs, set];
}

export function DropPdf({ lang, onFile, label }: { lang: Lang; onFile: (f: File) => void; label?: string }) {
  const t = T[lang];
  return (
    <label className="drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}>
      <input type="file" accept="application/pdf,.pdf" className="vh" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFile(f); }} />
      <strong>{label ?? t.dropPdf}</strong>
      <span>PDF</span>
    </label>
  );
}

export function ChangeBtn({ lang, onFile, label }: { lang: Lang; onFile: (f: File) => void; label?: string }) {
  const t = T[lang];
  return (
    <label className="btn ghost">
      <input type="file" accept="application/pdf,.pdf" className="vh" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFile(f); }} />
      {label ?? t.change}
    </label>
  );
}

export function Downloads({ lang, outs, zipName }: { lang: Lang; outs: Out[]; zipName?: string }) {
  const t = T[lang];
  async function zip() {
    const { default: JSZip } = await import('jszip');
    const z = new JSZip();
    outs.forEach((o) => z.file(o.name, o.blob));
    const url = URL.createObjectURL(await z.generateAsync({ type: 'blob' }));
    const a = document.createElement('a');
    a.href = url; a.download = zipName ?? 'docsareeasy.zip'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (outs.length === 0) return null;
  return (
    <div className="result" aria-live="polite">
      <div>
        <ul className="files">
          {outs.map((o) => (
            <li key={o.name}><span className="fname">{o.name} · {o.kb} KB</span><a className="btn" href={o.url} download={o.name}>{t.download}</a></li>
          ))}
        </ul>
        {outs.length > 1 && <button type="button" className="btn ghost" onClick={zip}>{t.downloadZip}</button>}
      </div>
    </div>
  );
}
