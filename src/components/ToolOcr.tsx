import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName } from '../lib/pdfutil';
import { ChangeBtn, DropPdf, Downloads, jpegOf, mkOut, tick, useOuts } from './ToolParts';
import { Icon } from './Icons';
import Preview from './Preview';
import { loadPdfJs } from '../lib/pdftext';

export default function ToolOcr({ lang }: { lang: Lang }) {
  const t = T[lang], p = P[lang];
  const [file, setFile] = useState<File | null>(null);
  const [ocrLang, setOcrLang] = useState('eng');
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState('');
  const [err, setErr] = useState('');
  const [outs, setOuts] = useOuts();
  const stop = useRef(false);

  async function run() {
    if (!file) return;
    setBusy(true); setErr(''); setOuts([]); stop.current = false;
    let worker: any = null;
    try {
      const pdfjs = await loadPdfJs();
      const src = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      if (src.numPages > 30) throw new Error('big');
      const { createWorker } = await import('tesseract.js');
      worker = await createWorker(ocrLang);
      const out = await PDFDocument.create();
      for (let i = 1; i <= src.numPages; i++) {
        if (stop.current) return;
        setProg(`${i} / ${src.numPages}`); await tick();
        const pg = await src.getPage(i), vp = pg.getViewport({ scale: 200 / 72 });
        const c = document.createElement('canvas');
        c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        await pg.render({ canvasContext: ctx, viewport: vp }).promise;
        const { data } = await worker.recognize(c, {}, { pdf: true });
        const one = await PDFDocument.load(new Uint8Array(data.pdf as number[]));
        const [copy] = await out.copyPages(one, [0]);
        out.addPage(copy);
        c.width = 0; pg.cleanup();
      }
      setOuts([mkOut(`${baseName(file.name)}-searchable.pdf`, new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' }))]);
    } catch (e) { setErr(e instanceof Error && e.message === 'big' ? t.tooBig : t.errMake); }
    finally { try { await worker?.terminate(); } catch { /* ignore */ } setBusy(false); setProg(''); }
  }
  return (
    <div className="tool">
      {!file ? <DropPdf lang={lang} onFile={(f) => { setFile(f); setOuts([]); setErr(''); }} /> : (
        <div className="ws">
          <div className="ws-main">
            <div className="filecard"><p className="stats">{file.name}</p><ChangeBtn lang={lang} onFile={(f) => { setFile(f); setOuts([]); }} /></div>
            <Preview lang={lang} original={file} results={outs} />
          </div>
          <aside className="ws-side">
            <h2 className="h3">{t.options}</h2>
            <div className="grid one"><label>{p.ocrLang}
              <select value={ocrLang} onChange={(e) => setOcrLang(e.target.value)}><option value="eng">{p.langEng}</option><option value="hin">{p.langHin}</option><option value="eng+hin">{p.langBoth}</option></select></label></div>
            <p className="notice">{p.ocrNote}</p>
            <div className="actions">
              <button type="button" className="btn" disabled={busy} aria-busy={busy} onClick={run}>{busy ? <><span className="spin" aria-hidden="true" />{t.processing} {prog}</> : p.aOcr}</button>
              {busy && <button type="button" className="btn ghost" onClick={() => { stop.current = true; }}>{t.cancel}</button>}
            </div>
            {err && <p className="err" role="alert">{err}</p>}
            <Downloads lang={lang} outs={outs} />
          </aside>
        </div>
      )}
    </div>
  );
}
