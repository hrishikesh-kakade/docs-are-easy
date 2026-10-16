import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName } from '../lib/pdfutil';
import { ChangeBtn, DropPdf, Downloads, jpegOf, mkOut, tick, useOuts } from './ToolParts';
import { Icon } from './Icons';
import Preview from './Preview';
import { loadPdfJs } from '../lib/pdftext';

type Box = [number, number, number, number]; // x, y, width, height as fractions of the page

export default function ToolRedact({ lang }: { lang: Lang }) {
  const t = T[lang], p = P[lang];
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [boxes, setBoxes] = useState<Record<number, Box[]>>({});
  const [temp, setTemp] = useState<Box | null>(null);
  const [num, setNum] = useState({ x: 10, y: 10, w: 30, h: 5 });
  const [ready, setReady] = useState(0);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState('');
  const [err, setErr] = useState('');
  const [outs, setOuts] = useOuts();
  const cv = useRef<HTMLCanvasElement>(null);
  const base = useRef<HTMLCanvasElement | null>(null);
  const doc = useRef<any>(null);
  const start = useRef<[number, number] | null>(null);

  async function pick(f: File) {
    setErr(''); setOuts([]);
    try {
      const pdfjs = await loadPdfJs();
      const d = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
      doc.current?.destroy?.(); doc.current = d;
      setFile(f); setCount(d.numPages); setPage(1); setBoxes({});
    } catch { setErr(t.errPdf); }
  }
  useEffect(() => () => { doc.current?.destroy?.(); }, []);
  useEffect(() => {
    const d = doc.current;
    if (!d || !file) return;
    let live = true;
    (async () => {
      const pg = await d.getPage(page), vp0 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: 700 / vp0.width });
      const b = document.createElement('canvas');
      b.width = Math.ceil(vp.width); b.height = Math.ceil(vp.height);
      const ctx = b.getContext('2d')!;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, b.width, b.height);
      await pg.render({ canvasContext: ctx, viewport: vp }).promise;
      if (live) { base.current = b; setReady((n) => n + 1); }
    })();
    return () => { live = false; };
  }, [file, page]);
  useEffect(() => {
    const c = cv.current, b = base.current;
    if (!c || !b) return;
    if (c.width !== b.width || c.height !== b.height) { c.width = b.width; c.height = b.height; }
    const ctx = c.getContext('2d')!;
    ctx.drawImage(b, 0, 0); ctx.fillStyle = '#000';
    for (const [x, y, w, h] of [...(boxes[page] ?? []), ...(temp ? [temp] : [])]) ctx.fillRect(x * c.width, y * c.height, w * c.width, h * c.height);
  }, [ready, boxes, temp, page]);

  const frac = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))];
  };
  const addBox = (b: Box) => { setBoxes((x) => ({ ...x, [page]: [...(x[page] ?? []), b] })); setOuts([]); };
  const total = Object.values(boxes).reduce((n, l) => n + l.length, 0);

  async function run() {
    const d = doc.current;
    if (!file || !d) return;
    setBusy(true); setErr(''); setOuts([]);
    try {
      const out = await PDFDocument.create();
      for (let i = 1; i <= d.numPages; i++) {
        setProg(`${i} / ${d.numPages}`); await tick();
        const pg = await d.getPage(i), one = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: 150 / 72 });
        const c = document.createElement('canvas');
        c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        await pg.render({ canvasContext: ctx, viewport: vp }).promise;
        ctx.fillStyle = '#000';
        for (const [x, y, w, h] of boxes[i] ?? []) ctx.fillRect(x * c.width, y * c.height, w * c.width, h * c.height);
        const jpg = await out.embedJpg(new Uint8Array(await (await jpegOf(c)).arrayBuffer()));
        out.addPage([one.width, one.height]).drawImage(jpg, { x: 0, y: 0, width: one.width, height: one.height });
        c.width = 0; pg.cleanup();
      }
      setOuts([mkOut(`${baseName(file.name)}-redacted.pdf`, new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' }))]);
    } catch { setErr(t.errMake); } finally { setBusy(false); setProg(''); }
  }
  return (
    <div className="tool">
      {!file ? <DropPdf lang={lang} onFile={pick} /> : (
        <div className="ws">
          <div className="ws-main">
            <div className="filecard"><p className="stats">{file.name} · {count} {t.pages}</p><ChangeBtn lang={lang} onFile={pick} /></div>
            <section className="previewcard">
              <div className="pdfbar">
                <span className="zoombtns">
                  <button type="button" className="icon" aria-label={t.down} disabled={page <= 1} onClick={() => setPage(page - 1)}><Icon name="left" /></button>
                  <span className="zv">{page} / {count}</span>
                  <button type="button" className="icon" aria-label={t.up} disabled={page >= count} onClick={() => setPage(page + 1)}><Icon name="right" /></button>
                </span>
                <span className="hint">{p.drawHint}</span>
              </div>
              <div className="pdfhost">
                <canvas ref={cv} className="pdfpage redactpad" aria-label={p.drawHint}
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); start.current = frac(e); }}
                  onPointerMove={(e) => { if (!start.current) return; const [x, y] = frac(e), [x0, y0] = start.current; setTemp([Math.min(x, x0), Math.min(y, y0), Math.abs(x - x0), Math.abs(y - y0)]); }}
                  onPointerUp={() => { if (temp && temp[2] > 0.01 && temp[3] > 0.005) addBox(temp); setTemp(null); start.current = null; }}
                  onPointerCancel={() => { setTemp(null); start.current = null; }} />
              </div>
            </section>
            <Preview lang={lang} results={outs} />
          </div>
          <aside className="ws-side">
            <h2 className="h3">{t.options}</h2>
            <p className="notice">{p.redactNote}</p>
            <div className="grid">
              <label>{p.xLbl}<input type="number" inputMode="numeric" min={0} max={100} value={num.x} onChange={(e) => setNum({ ...num, x: Number(e.target.value) || 0 })} /></label>
              <label>{p.yLbl}<input type="number" inputMode="numeric" min={0} max={100} value={num.y} onChange={(e) => setNum({ ...num, y: Number(e.target.value) || 0 })} /></label>
              <label>{p.wLbl}<input type="number" inputMode="numeric" min={1} max={100} value={num.w} onChange={(e) => setNum({ ...num, w: Number(e.target.value) || 1 })} /></label>
              <label>{p.hLbl}<input type="number" inputMode="numeric" min={1} max={100} value={num.h} onChange={(e) => setNum({ ...num, h: Number(e.target.value) || 1 })} /></label>
            </div>
            <button type="button" className="btn ghost" onClick={() => addBox([num.x / 100, num.y / 100, Math.min(num.w, 100 - num.x) / 100, Math.min(num.h, 100 - num.y) / 100])}><Icon name="plus" />{p.addBox}</button>
            <div className="actions">
              <button type="button" className="btn ghost" disabled={!(boxes[page] ?? []).length} onClick={() => { setBoxes((x) => ({ ...x, [page]: (x[page] ?? []).slice(0, -1) })); setOuts([]); }}>{p.undo}</button>
              <button type="button" className="btn ghost" disabled={!(boxes[page] ?? []).length} onClick={() => { setBoxes((x) => ({ ...x, [page]: [] })); setOuts([]); }}>{p.clearPage}</button>
            </div>
            <div className="actions"><button type="button" className="btn" disabled={busy || total === 0} aria-busy={busy} onClick={run}>{busy ? <><span className="spin" aria-hidden="true" />{t.processing} {prog}</> : p.aRedact}</button></div>
            {err && <p className="err" role="alert">{err}</p>}
            <Downloads lang={lang} outs={outs} />
          </aside>
        </div>
      )}
    </div>
  );
}
