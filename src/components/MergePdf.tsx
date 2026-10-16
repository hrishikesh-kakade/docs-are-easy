import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { Icon } from './Icons';
import Preview from './Preview';

type Item = { id: number; name: string; file: File; pages: number };
type Out = { url: string; blob: Blob; kb: string; pages: number };
const MAX_FILES = 10;
let uid = 0;
const tick = () => new Promise((r) => setTimeout(r));

export default function MergePdf({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState('');
  const [err, setErr] = useState('');
  const [out, setOut] = useState<Out | null>(null);
  const [selIdx, setSelIdx] = useState(0);

  function clearOut() {
    if (out) URL.revokeObjectURL(out.url);
    setOut(null);
  }
  async function add(files: File[]) {
    setErr(''); clearOut();
    const next = [...items];
    for (const f of files) {
      if (next.length >= MAX_FILES) { setErr(t.tooManyPdf); break; }
      try {
        const doc = await PDFDocument.load(await f.arrayBuffer());
        next.push({ id: ++uid, name: f.name, file: f, pages: doc.getPageCount() });
      } catch { setErr(t.errPdf); }
    }
    setItems(next);
  }
  function move(i: number, d: number) {
    const n = [...items]; [n[i], n[i + d]] = [n[i + d], n[i]];
    setItems(n); clearOut();
  }
  function remove(i: number) { setItems(items.filter((_, x) => x !== i)); clearOut(); }
  async function make() {
    setBusy(true); setErr(''); clearOut();
    try {
      const merged = await PDFDocument.create();
      let total = 0;
      for (let i = 0; i < items.length; i++) {
        setProg(`${i + 1} / ${items.length}`);
        await tick();
        const src = await PDFDocument.load(await items[i].file.arrayBuffer());
        const pgs = await merged.copyPages(src, src.getPageIndices());
        pgs.forEach((p) => merged.addPage(p));
        total += pgs.length;
      }
      const blob = new Blob([(await merged.save()) as BlobPart], { type: 'application/pdf' });
      setOut({ blob, url: URL.createObjectURL(blob), kb: (blob.size / 1024).toFixed(1), pages: total });
    } catch { setErr(t.errMake); }
    setBusy(false); setProg('');
  }

  const input = (
    <input type="file" accept="application/pdf,.pdf" multiple className="vh"
      onChange={(e) => { const f = Array.from(e.target.files ?? []); e.target.value = ''; add(f); }} />
  );

  return (
    <div className="tool">
      {items.length === 0 ? (
        <label className="drop" onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); add(Array.from(e.dataTransfer.files)); }}>
          {input}
          <strong>{t.dropPdfs}</strong>
          <span>PDF</span>
        </label>
      ) : (
        <div className="ws">
          <div className="ws-main">
          <ol className="files">
            {items.map((it, i) => (
              <li key={it.id}>
                <button type="button" className="fname linkbtn" aria-pressed={selIdx === i} onClick={() => setSelIdx(i)}>{it.name} · {it.pages} {t.pages}</button>
                <button type="button" className="icon" aria-label={t.up} disabled={i === 0} onClick={() => move(i, -1)}><Icon name="up" /></button>
                <button type="button" className="icon" aria-label={t.down} disabled={i === items.length - 1} onClick={() => move(i, 1)}><Icon name="down" /></button>
                <button type="button" className="icon" aria-label={t.remove} onClick={() => remove(i)}><Icon name="x" /></button>
              </li>
            ))}
          </ol>
          <label className="btn ghost">{input}{t.addPdf}</label>
          <Preview lang={lang} original={items[Math.min(selIdx, items.length - 1)]?.file ?? null} results={out ? [{ name: 'docsareeasy-merged.pdf', blob: out.blob, url: out.url }] : []} />
          </div>
          <aside className="ws-side">
          <h2 className="h3">{t.options}</h2>
          <p className="stats">{items.length} PDF · {items.reduce((n, x) => n + x.pages, 0)} {t.pages}</p>
          <div className="actions">
            <button type="button" className="btn" disabled={busy || items.length < 2} aria-busy={busy} onClick={make}>
              {busy ? <><span className="spin" aria-hidden="true" />{t.processing} {prog}</> : t.merge}
            </button>
          </div>
          </aside>
        </div>
      )}
      {err && <p className="err" role="alert">{err}</p>}
      {out && (
        <div className="result" aria-live="polite">
          <div>
            <p className="stats">{out.pages} {t.pages} · {out.kb} KB</p>
            <a className="btn" href={out.url} download="docsareeasy-merged.pdf">{t.download}</a>
          </div>
        </div>
      )}
    </div>
  );
}
