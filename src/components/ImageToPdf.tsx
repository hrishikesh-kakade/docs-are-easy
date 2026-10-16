import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { loadImage } from '../lib/image';
import { Icon } from './Icons';
import Preview from './Preview';
import CameraDialog from './CameraDialog';
import { P } from '../lib/pdf-i18n';

type Item = { id: number; name: string; img: HTMLImageElement };
type OutFile = { name: string; url: string; blob: Blob; kb: string; pages: number };
const A4 = { w: 595.28, h: 841.89 };
const MAX_FILES = 20, MAX_SIDE = 2000;
let uid = 0;
const tick = () => new Promise((r) => setTimeout(r));
const base = (n: string) => n.replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '_') || 'image';

// Every image is re-drawn on a white canvas and saved as JPEG, so HEIC, WebP and PNG all work the same way.
async function toJpeg(img: HTMLImageElement): Promise<Uint8Array> {
  const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/jpeg', 0.85));
  return new Uint8Array(await blob.arrayBuffer());
}

export default function ImageToPdf({ lang, scan }: { lang: Lang; scan?: boolean }) {
  const t = T[lang], p = P[lang];
  const [items, setItems] = useState<Item[]>([]);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;
  const chain = useRef<Promise<void>>(Promise.resolve());
  const [camOpen, setCamOpen] = useState(false);
  const [size, setSize] = useState<'a4' | 'fit'>('a4');
  const [mode, setMode] = useState<'one' | 'each'>('one');
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState('');
  const [err, setErr] = useState('');
  const [outs, setOuts] = useState<OutFile[]>([]);

  function clearOut() {
    outs.forEach((o) => URL.revokeObjectURL(o.url));
    setOuts([]);
  }
  async function add(files: File[]) {
    setErr(''); clearOut();
    const loaded: Item[] = [];
    for (const f of files) {
      try { loaded.push({ id: ++uid, name: f.name, img: await loadImage(f) }); } catch { setErr(t.err); }
    }
    setItems((prev) => {
      const room = Math.max(0, MAX_FILES - prev.length);
      loaded.slice(room).forEach((x) => URL.revokeObjectURL(x.img.src));
      return [...prev, ...loaded.slice(0, room)];
    });
    if (itemsRef.current.length + loaded.length > MAX_FILES) setErr(t.tooMany);
  }
  function move(i: number, d: number) {
    const n = [...items]; [n[i], n[i + d]] = [n[i + d], n[i]];
    setItems(n); clearOut();
  }
  function remove(i: number) {
    URL.revokeObjectURL(items[i].img.src);
    setItems(items.filter((_, x) => x !== i)); clearOut();
  }
  async function build(list: Item[], showProgress: boolean): Promise<Blob> {
    const pdf = await PDFDocument.create();
    for (let i = 0; i < list.length; i++) {
      if (showProgress) setProg(`${i + 1} / ${list.length}`);
      await tick();
      const jpg = await pdf.embedJpg(await toJpeg(list[i].img));
      const land = jpg.width > jpg.height;
      const [pw, ph] = size === 'fit' ? [jpg.width, jpg.height] : land ? [A4.h, A4.w] : [A4.w, A4.h];
      const m = size === 'fit' ? 0 : 24;
      const k = Math.min((pw - 2 * m) / jpg.width, (ph - 2 * m) / jpg.height);
      const w = jpg.width * k, h = jpg.height * k;
      pdf.addPage([pw, ph]).drawImage(jpg, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
    }
    return new Blob([(await pdf.save()) as BlobPart], { type: 'application/pdf' });
  }
  const mk = (name: string, blob: Blob, pages: number): OutFile => ({ name, blob, pages, url: URL.createObjectURL(blob), kb: (blob.size / 1024).toFixed(1) });
  async function make() {
    setBusy(true); setErr(''); clearOut();
    try {
      const res: OutFile[] = [];
      if (mode === 'one') {
        res.push(mk('docsareeasy.pdf', await build(items, true), items.length));
      } else {
        for (let i = 0; i < items.length; i++) {
          setProg(`${i + 1} / ${items.length}`);
          res.push(mk(`${i + 1}-${base(items[i].name)}.pdf`, await build([items[i]], false), 1));
        }
      }
      setOuts(res);
    } catch { setErr(t.errMake); }
    setBusy(false); setProg('');
  }
  async function zip() {
    const { default: JSZip } = await import('jszip');
    const z = new JSZip();
    outs.forEach((o) => z.file(o.name, o.blob));
    const url = URL.createObjectURL(await z.generateAsync({ type: 'blob' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'docsareeasy-pdfs.zip'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const input = (
    <input type="file" accept="image/*,.heic,.heif" multiple className="vh"
      onChange={(e) => { const f = Array.from(e.target.files ?? []); e.target.value = ''; add(f); }} />
  );

  const cam = scan && (
    <div className="toolbar">
      <button type="button" className="btn" onClick={() => setCamOpen(true)}><Icon name="camera" />{p.takePhoto}</button>
    </div>
  );

  return (
    <div className="tool">
      {cam}
      {items.length === 0 ? (
        <label className="drop" onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); add(Array.from(e.dataTransfer.files)); }}>
          {input}
          <strong>{t.dropImgs}</strong>
          <span>{t.formats}</span>
        </label>
      ) : (
        <div className="ws">
          <div className="ws-main">
          <ol className="files pgrid">
            {items.map((it, i) => (
              <li key={it.id}>
                <img className="thumb" src={it.img.src} alt="" width="48" height="48" />
                <span className="fname">{it.name}</span>
                <button type="button" className="icon" aria-label={t.up} disabled={i === 0} onClick={() => move(i, -1)}><Icon name="up" /></button>
                <button type="button" className="icon" aria-label={t.down} disabled={i === items.length - 1} onClick={() => move(i, 1)}><Icon name="down" /></button>
                <button type="button" className="icon" aria-label={t.remove} onClick={() => remove(i)}><Icon name="x" /></button>
              </li>
            ))}
          </ol>
          <label className="btn ghost">{input}{t.add}</label>
          <Preview lang={lang} results={outs} />
          </div>
          <aside className="ws-side">
          <h2 className="h3">{t.options}</h2>
          <div className="grid one">
            <label>{t.pageSize}
              <select value={size} onChange={(e) => { setSize(e.target.value as 'a4' | 'fit'); clearOut(); }}>
                <option value="a4">{t.a4}</option>
                <option value="fit">{t.fit}</option>
              </select>
            </label>
          </div>
          {items.length > 1 && (
            <fieldset className="radios">
              <legend>{t.outputLabel}</legend>
              <label className="check"><input type="radio" name="mode" checked={mode === 'one'} onChange={() => { setMode('one'); clearOut(); }} />{t.modeOne}</label>
              <label className="check"><input type="radio" name="mode" checked={mode === 'each'} onChange={() => { setMode('each'); clearOut(); }} />{t.modeEach}</label>
            </fieldset>
          )}
          <div className="actions">
            <button type="button" className="btn" disabled={busy} aria-busy={busy} onClick={make}>
              {busy ? <><span className="spin" aria-hidden="true" />{t.processing} {prog}</> : t.convert}
            </button>
          </div>
          </aside>
        </div>
      )}
      {err && <p className="err" role="alert">{err}</p>}
      {outs.length > 0 && (
        <div className="result" aria-live="polite">
          <div>
            <ul className="files">
              {outs.map((o) => (
                <li key={o.name}>
                  <span className="fname">{o.name} · {o.pages} {t.pages} · {o.kb} KB</span>
                  <a className="btn" href={o.url} download={o.name}>{t.download}</a>
                </li>
              ))}
            </ul>
            {outs.length > 1 && <button type="button" className="btn ghost" onClick={zip}>{t.downloadZip}</button>}
          </div>
        </div>
      )}
      {scan && <CameraDialog lang={lang} open={camOpen} onClose={() => setCamOpen(false)} onShot={(f) => { chain.current = chain.current.then(() => add([f])); }} />}
    </div>
  );
}
