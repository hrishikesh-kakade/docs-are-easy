import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { Icon } from './Icons';
import { baseName } from '../lib/pdfutil';
import Preview from './Preview';

type Fmt3 = 'pdf' | 'jpeg' | 'png';
type Out = { url: string; blob: Blob; before: string; after: string; ok: boolean; fmt: Fmt3 };
// Each attempt re-renders every page at a lower resolution/quality. At most 6 attempts, then a clear failure message.
const LADDER: [number, number][] = [[150, 0.75], [130, 0.65], [110, 0.55], [90, 0.5], [72, 0.4], [60, 0.35]];
const MAX_PAGES = 30;
const tick = () => new Promise((r) => setTimeout(r));

type Props = { lang: Lang; file?: File; target?: number; onUse?: (blob: Blob, fmt: Fmt3) => void; hideChange?: boolean; saveAs?: string };

export default function CompressPdf({ lang, file: initial, target: initialTarget, onUse, hideChange, saveAs }: Props) {
  const t = T[lang];
  const [file, setFile] = useState<File | null>(initial ?? null);
  const [target, setTarget] = useState(initialTarget ?? 1000);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [out, setOut] = useState<Out | null>(null);
  const stop = useRef(false);
  const [outFmt, setOutFmt] = useState<Fmt3>('pdf');
  const [widthPx, setWidthPx] = useState(0);
  const [pages, setPages] = useState<number | null>(null);

  useEffect(() => {
    setPages(null);
    if (!file) return;
    let live = true;
    (async () => {
      try {
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        if (live) setPages(doc.getPageCount());
      } catch { /* unreadable here: the run step reports it */ }
    })();
    return () => { live = false; };
  }, [file]);

  function clearOut() {
    if (out) URL.revokeObjectURL(out.url);
    setOut(null);
  }
  async function run() {
    if (!file) return;
    setBusy(true); setErr(''); setMsg(''); clearOut(); stop.current = false;
    try {
      const limit = target * 1000; // under target*1000 bytes so it passes whether KB means 1000 or 1024 bytes
      if (outFmt === 'pdf' && file.size <= limit) { setMsg(t.already); return; }
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      const src = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      if (src.numPages > MAX_PAGES) throw new Error('big');
      if (outFmt !== 'pdf') { // convert page 1 to an image
        const mime = outFmt === 'png' ? 'image/png' : 'image/jpeg';
        const rungs: [number, number][] = outFmt === 'png' ? [[150, 1]] : LADDER;
        const page = await src.getPage(1);
        const base = page.getViewport({ scale: 1 });
        let img: Blob | null = null;
        for (let a = 0; a < rungs.length; a++) {
          if (stop.current) return;
          setProg(`${a + 1}/${rungs.length}`);
          await tick();
          const [dpi, q] = rungs[a];
          const vp = page.getViewport({ scale: widthPx > 0 ? widthPx / base.width : dpi / 72 });
          const cv = document.createElement('canvas');
          cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          img = await new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), mime, q));
          cv.width = 0; cv.height = 0;
          if (img.size <= limit) break;
        }
        if (img) setOut({ fmt: outFmt, blob: img, url: URL.createObjectURL(img), before: (file.size / 1024).toFixed(1), after: (img.size / 1024).toFixed(1), ok: img.size <= limit });
        return;
      }
      let best: Blob | null = null;
      for (let a = 0; a < LADDER.length; a++) {
        const [dpi, q] = LADDER[a];
        const pdf = await PDFDocument.create();
        for (let p = 1; p <= src.numPages; p++) {
          if (stop.current) return;
          setProg(`${a + 1}/${LADDER.length} · ${p}/${src.numPages}`);
          await tick();
          const page = await src.getPage(p);
          const base = page.getViewport({ scale: 1 });
          const vp = page.getViewport({ scale: dpi / 72 });
          const cv = document.createElement('canvas');
          cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const blob = await new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/jpeg', q));
          const img = await pdf.embedJpg(new Uint8Array(await blob.arrayBuffer()));
          pdf.addPage([base.width, base.height]).drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
          cv.width = 0; cv.height = 0; page.cleanup();
        }
        best = new Blob([(await pdf.save()) as BlobPart], { type: 'application/pdf' });
        if (best.size <= limit) break;
      }
      if (best) setOut({ fmt: 'pdf', blob: best, url: URL.createObjectURL(best), before: (file.size / 1024).toFixed(1), after: (best.size / 1024).toFixed(1), ok: best.size <= limit });
    } catch (e) {
      setErr(e instanceof Error && e.message === 'big' ? t.tooBig : t.errPdf);
    } finally {
      setBusy(false); setProg('');
    }
  }

  const input = (
    <input type="file" accept="application/pdf,.pdf" className="vh"
      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) { setFile(f); setErr(''); setMsg(''); clearOut(); } }} />
  );

  return (
    <div className="tool">
      {!file ? (
        <label className="drop" onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setErr(''); setMsg(''); clearOut(); } }}>
          {input}
          <strong>{t.dropPdf}</strong>
          <span>PDF</span>
        </label>
      ) : (
        <div className="ws">
          <div className="ws-main"><div className="filecard">
          <p className="stats">{file.name} · {(file.size / 1024).toFixed(1)} KB</p>
          {!hideChange && <label className="btn ghost">{input}{t.change}</label>}
          </div>
          <Preview lang={lang} original={file} results={out ? [{ name: `${saveAs ?? (file ? baseName(file.name) + '-compressed' : 'compressed')}.${{ pdf: 'pdf', jpeg: 'jpg', png: 'png' }[out.fmt]}`, blob: out.blob, url: out.url }] : []} />
          </div>
          <aside className="ws-side">
          <h2 className="h3">{t.options}</h2>
          <div className="grid one">
            <label>{t.targetKB}
              <input type="number" inputMode="numeric" min={10} value={target}
                onChange={(e) => { setTarget(Math.max(0, Number(e.target.value) || 0)); clearOut(); }} />
            </label>
            <label>{t.outFormat}
              <select value={outFmt} onChange={(e) => { setOutFmt(e.target.value as Fmt3); clearOut(); }}>
                <option value="pdf">PDF ({t.sameAs})</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </label>
            {outFmt !== 'pdf' && (
              <label>{t.width}
                <input type="number" inputMode="numeric" min={0} placeholder="auto" value={widthPx || ''}
                  onChange={(e) => { setWidthPx(Math.max(0, Number(e.target.value) || 0)); clearOut(); }} />
              </label>
            )}
          </div>
          {outFmt === 'pdf' && <p className="notice">{t.rasterWarn}</p>}
          {outFmt !== 'pdf' && pages != null && pages > 1 && <p className="notice">{t.firstPageOnly}</p>}
          {outFmt === 'png' && <p className="hint">{t.pngNote}</p>}
          <div className="actions">
            <button type="button" className="btn" disabled={busy || target < 10} aria-busy={busy} onClick={run}>
              {busy ? <><span className="spin" aria-hidden="true" />{t.processing} {prog}</> : t.shrink}
            </button>
            {busy && <button type="button" className="btn ghost" onClick={() => { stop.current = true; }}>{t.cancel}</button>}
          </div>
          </aside>
        </div>
      )}
      {msg && <p className="badge ok" role="status"><Icon name="check" /><span>{msg}</span></p>}
      {err && <p className="err" role="alert">{err}</p>}
      {out && (
        <div className="result" aria-live="polite">
          <div>
            <p className="stats">{t.before} {out.before} KB → {t.after} {out.after} KB</p>
            <p className={out.ok ? 'badge ok' : 'badge bad'}><Icon name={out.ok ? 'check' : 'x'} /><span>{out.ok ? t.pass : t.noReach}</span></p>
            <div className="actions"><a className="btn" href={out.url} download={`${saveAs ?? (file ? baseName(file.name) + '-compressed' : 'compressed')}.${{ pdf: 'pdf', jpeg: 'jpg', png: 'png' }[out.fmt]}`}>{t.download}</a>{onUse && out.ok && <button type="button" className="btn" onClick={() => onUse(out.blob, out.fmt)}>{t.useFile}</button>}</div>
          </div>
        </div>
      )}
    </div>
  );
}
