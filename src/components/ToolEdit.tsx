import { useEffect, useRef, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName } from '../lib/pdfutil';
import { ChangeBtn, DropPdf, Downloads, jpegOf, mkOut, tick, useOuts } from './ToolParts';
import { Icon } from './Icons';
import Preview from './Preview';
import { FONTS, imagePng, textPng } from '../lib/pdfdraw';

type Kind = 'text' | 'image' | 'rect';
type Item = { id: number; kind: Kind; page: number; x: number; y: number; w: number; h: number; text: string; size: number; color: string; style: 'fill' | 'outline' | 'highlight'; img?: File };
let uid = 0;
const hex = (c: string) => rgb(parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255);

export default function ToolEdit({ lang }: { lang: Lang }) {
  const t = T[lang], p = P[lang];
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [d, setD] = useState<Omit<Item, 'id'>>({ kind: 'text', page: 1, x: 10, y: 10, w: 30, h: 10, text: '', size: 24, color: '#000000', style: 'fill' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [outs, setOuts] = useOuts();
  const set = (patch: Partial<typeof d>) => { setD({ ...d, ...patch }); setErr(''); };

  async function pick(f: File) {
    setErr(''); setOuts([]);
    try { const doc = await PDFDocument.load(await f.arrayBuffer()); setFile(f); setCount(doc.getPageCount()); setItems([]); } catch { setErr(t.errPdf); }
  }
  function add() {
    if (d.kind === 'text' && !d.text.trim()) { setErr(p.needText); return; }
    if (d.kind === 'image' && !d.img) { setErr(p.needImage); return; }
    setItems([...items, { ...d, id: ++uid, page: Math.min(Math.max(1, d.page), count) }]); setOuts([]); setErr('');
  }
  async function run() {
    if (!file || items.length === 0) return;
    setBusy(true); setErr(''); setOuts([]);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      for (const it of items) {
        const pg = doc.getPage(it.page - 1), { width: W, height: H } = pg.getSize();
        if (it.kind === 'rect') {
          const rw = (W * it.w) / 100, rh = (H * it.h) / 100, c = hex(it.color);
          pg.drawRectangle({ x: (W * it.x) / 100, y: H - (H * it.y) / 100 - rh, width: rw, height: rh, ...(it.style === 'outline' ? { borderColor: c, borderWidth: 2 } : { color: c, opacity: it.style === 'highlight' ? 0.35 : 1 }) });
        } else {
          const png = it.kind === 'text' ? await textPng(it.text, FONTS.sans, it.color) : await imagePng(it.img!);
          const img = await doc.embedPng(new Uint8Array(await png.arrayBuffer()));
          const w = it.kind === 'text' ? (img.width * it.size) / 120 : (W * it.w) / 100, h = (w * img.height) / img.width;
          pg.drawImage(img, { x: (W * it.x) / 100, y: H - (H * it.y) / 100 - h, width: w, height: h });
        }
      }
      setOuts([mkOut(`${baseName(file.name)}-edited.pdf`, new Blob([(await doc.save()) as BlobPart], { type: 'application/pdf' }))]);
    } catch { setErr(t.errMake); } finally { setBusy(false); }
  }
  const label = (it: Item) => (it.kind === 'text' ? it.text : it.kind === 'image' ? it.img?.name : p.itemRect) ?? '';
  return (
    <div className="tool">
      {!file ? <DropPdf lang={lang} onFile={pick} /> : (
        <div className="ws">
          <div className="ws-main">
            <div className="filecard"><p className="stats">{file.name} · {count} {t.pages}</p><ChangeBtn lang={lang} onFile={pick} /></div>
            <Preview lang={lang} original={file} results={outs} />
          </div>
          <aside className="ws-side">
            <h2 className="h3">{t.options}</h2>
            <div className="seg" role="group" aria-label={t.options}>
              {(['text', 'image', 'rect'] as Kind[]).map((k) => <button key={k} type="button" aria-pressed={d.kind === k} onClick={() => set({ kind: k })}>{k === 'text' ? p.itemText : k === 'image' ? p.itemImage : p.itemRect}</button>)}
            </div>
            <div className="grid">
              <label>{p.pageLbl}<input type="number" inputMode="numeric" min={1} max={count} value={d.page} onChange={(e) => set({ page: Number(e.target.value) || 1 })} /></label>
              <label>{p.xLbl}<input type="number" inputMode="numeric" min={0} max={100} value={d.x} onChange={(e) => set({ x: Number(e.target.value) || 0 })} /></label>
              <label>{p.yLbl}<input type="number" inputMode="numeric" min={0} max={100} value={d.y} onChange={(e) => set({ y: Number(e.target.value) || 0 })} /></label>
              {d.kind !== 'text' && <label>{p.wLbl}<input type="number" inputMode="numeric" min={1} max={100} value={d.w} onChange={(e) => set({ w: Number(e.target.value) || 1 })} /></label>}
              {d.kind === 'rect' && <label>{p.hLbl}<input type="number" inputMode="numeric" min={1} max={100} value={d.h} onChange={(e) => set({ h: Number(e.target.value) || 1 })} /></label>}
            </div>
            {d.kind === 'text' && (
              <>
                <div className="grid one"><label>{p.wmText}<input type="text" maxLength={80} value={d.text} onChange={(e) => set({ text: e.target.value })} /></label></div>
                <div className="grid"><label>{p.sizeLbl}<input type="number" inputMode="numeric" min={8} max={120} value={d.size} onChange={(e) => set({ size: Number(e.target.value) || 12 })} /></label><label>{p.wmColor}<input type="color" value={d.color} onChange={(e) => set({ color: e.target.value })} /></label></div>
              </>
            )}
            {d.kind === 'image' && <label className="btn ghost"><input type="file" accept="image/*,.heic,.heif" className="vh" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) set({ img: f }); }} />{d.img ? d.img.name : p.wmImage}</label>}
            {d.kind === 'rect' && (
              <div className="grid">
                <label>{p.styleLbl}<select value={d.style} onChange={(e) => set({ style: e.target.value as Item['style'] })}><option value="fill">{p.fFill}</option><option value="outline">{p.fOutline}</option><option value="highlight">{p.fHighlight}</option></select></label>
                <label>{p.wmColor}<input type="color" value={d.color} onChange={(e) => set({ color: e.target.value })} /></label>
              </div>
            )}
            <button type="button" className="btn ghost" onClick={add}><Icon name="plus" />{p.addItem}</button>
            <h3 className="h3">{p.itemsT}</h3>
            {items.length === 0 ? <p className="hint">{p.noItems}</p> : (
              <ul className="mini">{items.map((it) => <li key={it.id}><span>{it.page} · {label(it)}</span><button type="button" className="pickx" aria-label={`${t.remove}: ${label(it)}`} onClick={() => { setItems(items.filter((x) => x.id !== it.id)); setOuts([]); }}><Icon name="x" /></button></li>)}</ul>
            )}
            <div className="actions"><button type="button" className="btn" disabled={busy || items.length === 0} aria-busy={busy} onClick={run}>{busy ? <><span className="spin" aria-hidden="true" />{t.processing}</> : p.aEdit}</button></div>
            {err && <p className="err" role="alert">{err}</p>}
            <Downloads lang={lang} outs={outs} />
          </aside>
        </div>
      )}
    </div>
  );
}
