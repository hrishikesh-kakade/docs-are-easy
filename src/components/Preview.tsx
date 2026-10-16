import { useEffect, useRef, useState } from 'react';
import { T, type Lang } from '../i18n';
import { Icon } from './Icons';

type Res = { name: string; blob: Blob; url: string };
const MAX_PAGES = 30;
const isPdf = (b: Blob) => b.type === 'application/pdf' || ((b as File).name ?? '').toLowerCase().endsWith('.pdf');

function PdfViewer({ blob, lang }: { blob: Blob; lang: Lang }) {
  const t = T[lang];
  const host = useRef<HTMLDivElement>(null);
  const docRef = useRef<any>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pages, setPages] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let live = true;
    setState('loading');
    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        const doc = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
        if (!live) { doc.destroy(); return; }
        docRef.current?.destroy?.();
        docRef.current = doc; setPages(doc.numPages); setState('ready');
      } catch { if (live) setState('error'); }
    })();
    return () => { live = false; };
  }, [blob]);
  useEffect(() => () => { docRef.current?.destroy?.(); }, []);

  // Draws the pages (up to 30) one after another inside a scrollable box.
  useEffect(() => {
    const doc = docRef.current, el = host.current;
    if (state !== 'ready' || !doc || !el) return;
    let live = true;
    el.replaceChildren();
    (async () => {
      try {
        const width = Math.max(200, el.clientWidth - 24), dpr = Math.min(window.devicePixelRatio || 1, 2);
        for (let i = 1; i <= Math.min(doc.numPages, MAX_PAGES); i++) {
          if (!live) return;
          const page = await doc.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const vp = page.getViewport({ scale: (width / base.width) * zoom * dpr });
          const cv = document.createElement('canvas');
          cv.className = 'pdfpage'; cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
          cv.style.width = `${Math.ceil(vp.width / dpr)}px`;
          cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', `${i} / ${doc.numPages}`);
          el.appendChild(cv);
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          page.cleanup();
        }
      } catch { /* the viewer was closed while drawing */ }
    })();
    return () => { live = false; };
  }, [state, zoom, pages]);

  return (
    <div className="pdfview">
      <div className="pdfbar">
        <span className="hint">{pages > 0 ? `${pages} ${t.pages}` : ''}</span>
        <span className="zoombtns">
          <button type="button" className="icon" aria-label={t.zoomOut} disabled={zoom <= 0.5} onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}><Icon name="minus" /></button>
          <span className="zv">{Math.round(zoom * 100)}%</span>
          <button type="button" className="icon" aria-label={t.zoomIn} disabled={zoom >= 3} onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}><Icon name="plus" /></button>
        </span>
      </div>
      {state === 'loading' && <p className="hint">{t.processing}</p>}
      {state === 'error' && <p className="err" role="alert">{t.errPdf}</p>}
      <div ref={host} className="pdfhost" tabIndex={0} role="region" aria-label={t.previewLbl} hidden={state !== 'ready'} />
      {pages > MAX_PAGES && <p className="hint">{t.moreThan}</p>}
    </div>
  );
}

/** Shows the uploaded document and, once it exists, the result next to a download button with its size. */
export default function Preview({ lang, original, results }: { lang: Lang; original?: Blob | null; results: Res[] }) {
  const t = T[lang];
  const [sel, setSel] = useState<'orig' | number>('orig');
  useEffect(() => { setSel(results.length ? 0 : 'orig'); }, [results.length, results[0]?.url]);
  const cur = sel === 'orig' ? null : results[sel] ?? null;
  const blob = sel === 'orig' ? original ?? null : cur?.blob ?? null;
  if (!blob) return null;
  return (
    <section className="previewcard">
      <div className="pdfbar">
        {original && results.length > 0 ? (
          <div className="seg" role="group" aria-label={t.previewLbl}>
            <button type="button" aria-pressed={sel === 'orig'} onClick={() => setSel('orig')}>{t.original}</button>
            <button type="button" aria-pressed={sel !== 'orig'} onClick={() => setSel(0)}>{t.result}</button>
          </div>
        ) : <strong>{sel === 'orig' ? t.original : t.result}</strong>}
        {results.length > 1 && sel !== 'orig' && (
          <select aria-label={t.result} value={sel} onChange={(e) => setSel(Number(e.target.value))}>
            {results.map((r, i) => <option key={r.url} value={i}>{r.name}</option>)}
          </select>
        )}
        {cur && (
          <span className="dl">
            <span className="stats">{(cur.blob.size / 1024).toFixed(1)} KB</span>
            <a className="btn" href={cur.url} download={cur.name}><Icon name="download" />{t.download}</a>
          </span>
        )}
      </div>
      {isPdf(blob) ? <PdfViewer blob={blob} lang={lang} /> : blob.type.startsWith('image/') && cur ? <img className="imgprev" src={cur.url} alt={cur.name} /> : null}
    </section>
  );
}
