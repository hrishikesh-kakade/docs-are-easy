import { useEffect, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName, cornerFor, MM, parseRanges, toRoman } from '../lib/pdfutil';
import { FONTS, imagePng, textPng } from '../lib/pdfdraw';
import { Icon } from './Icons';
import Preview from './Preview';

export type PdfId = 'split' | 'rotate' | 'organize' | 'pagenum' | 'watermark' | 'crop' | 'pdf2jpg' | 'sign' | 'repair';
type OutFile = { name: string; url: string; blob: Blob; kb: string };
type Row = { orig: number; rot: number };
type Pos = 'bl' | 'bc' | 'br' | 'tc' | 'tr';
const tick = () => new Promise((r) => setTimeout(r));
const pdfBlob = async (d: PDFDocument) => new Blob([(await d.save()) as BlobPart], { type: 'application/pdf' });
const png = (cv: HTMLCanvasElement) => new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('png'))), 'image/png'));
const jpeg = (cv: HTMLCanvasElement, q: number) => new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('jpg'))), 'image/jpeg', q));
const FONT = '"Segoe Script","Brush Script MT","Noto Sans Devanagari",cursive';

export default function PdfTool({ lang, id }: { lang: Lang; id: PdfId }) {
  const t = T[lang], p = P[lang];
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState('');
  const [err, setErr] = useState('');
  const [outs, setOuts] = useState<OutFile[]>([]);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [ranges, setRanges] = useState('');
  const [rot, setRot] = useState(90);
  const [rows, setRows] = useState<Row[]>([]);
  const [pos, setPos] = useState<Pos>(id === 'sign' ? 'br' : 'bc');
  const [start, setStart] = useState(1);
  const [wm, setWm] = useState('');
  const [numFmt, setNumFmt] = useState<'num' | 'rl' | 'ru' | 'of'>('num');
  const [skipFirst, setSkipFirst] = useState(false);
  const [wmKind, setWmKind] = useState<'text' | 'image'>('text');
  const [wmFont, setWmFont] = useState<keyof typeof FONTS>('sans');
  const [wmSizeK, setWmSizeK] = useState<'s' | 'm' | 'l'>('m');
  const [wmColor, setWmColor] = useState('#808080');
  const [wmOpacity, setWmOpacity] = useState(30);
  const [wmRot, setWmRot] = useState(45);
  const [wmPos, setWmPos] = useState<[number, number]>([1, 1]);
  const [wmTile, setWmTile] = useState(false);
  const [wmPages, setWmPages] = useState<'all' | 'range'>('all');
  const [wmRange, setWmRange] = useState('');
  const [wmLayer, setWmLayer] = useState<'over' | 'under'>('over');
  const [wmImg, setWmImg] = useState<File | null>(null);
  const [mm, setMm] = useState(10);
  const [signPage, setSignPage] = useState(1);
  const [tab, setTab] = useState<'draw' | 'type'>('draw');
  const [typed, setTyped] = useState('');
  const [inked, setInked] = useState(false);
  const pad = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => () => { outs.forEach((o) => URL.revokeObjectURL(o.url)); }, [outs]);
  function clearOut() { setOuts([]); }

  async function pick(f: File | undefined) {
    if (!f) return;
    setErr(''); clearOut();
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), id === 'repair' ? { ignoreEncryption: true, throwOnInvalidObject: false } : undefined);
      const n = doc.getPageCount();
      setFile(f); setCount(n); setRanges(''); setSignPage(1);
      setRows(Array.from({ length: n }, (_, i) => ({ orig: i, rot: 0 })));
    } catch { setErr(t.errPdf); }
  }

  async function signature(): Promise<Blob | null> {
    if (tab === 'draw') return inked && pad.current ? png(pad.current) : null;
    if (!typed.trim()) return null;
    const cv = document.createElement('canvas');
    let ctx = cv.getContext('2d')!;
    ctx.font = `italic 72px ${FONT}`;
    const w = Math.ceil(ctx.measureText(typed).width) + 40;
    cv.width = w; cv.height = 130;
    ctx = cv.getContext('2d')!;
    ctx.font = `italic 72px ${FONT}`; ctx.fillStyle = '#000'; ctx.textBaseline = 'middle';
    ctx.fillText(typed, 20, 65);
    return png(cv);
  }

  async function run() {
    if (!file) return;
    setBusy(true); setErr(''); clearOut();
    try {
      const bytes = await file.arrayBuffer();
      const base = baseName(file.name);
      const res: [string, Blob][] = [];
      if (id === 'split') {
        const groups = splitMode === 'all' ? Array.from({ length: count }, (_, i) => [i]) : parseRanges(ranges, count);
        if (!groups) { setErr(p.badRange); return; }
        const src = await PDFDocument.load(bytes);
        for (let g = 0; g < groups.length; g++) {
          setProg(`${g + 1} / ${groups.length}`); await tick();
          const out = await PDFDocument.create();
          (await out.copyPages(src, groups[g])).forEach((pg) => out.addPage(pg));
          const tag = splitMode === 'all' ? String(g + 1) : ranges.split(',').filter((s) => s.trim())[g].replace(/\s+/g, '');
          res.push([`${base}-${tag}.pdf`, await pdfBlob(out)]);
        }
      } else if (id === 'rotate') {
        const doc = await PDFDocument.load(bytes);
        doc.getPages().forEach((pg) => pg.setRotation(degrees((pg.getRotation().angle + rot) % 360)));
        res.push([`${base}-rotated.pdf`, await pdfBlob(doc)]);
      } else if (id === 'organize') {
        if (rows.length === 0) { setErr(p.badRange); return; }
        const src = await PDFDocument.load(bytes), out = await PDFDocument.create();
        (await out.copyPages(src, rows.map((r) => r.orig))).forEach((pg, i) => {
          pg.setRotation(degrees((pg.getRotation().angle + rows[i].rot) % 360));
          out.addPage(pg);
        });
        res.push([`${base}-organized.pdf`, await pdfBlob(out)]);
      } else if (id === 'pagenum') {
        const doc = await PDFDocument.load(bytes), font = await doc.embedFont(StandardFonts.Helvetica), total = doc.getPageCount();
        const last = start + (skipFirst ? total - 2 : total - 1);
        doc.getPages().forEach((pg, i) => {
          if (skipFirst && i === 0) return;
          const n = start + (skipFirst ? i - 1 : i);
          const s = numFmt === 'rl' ? toRoman(n, false) : numFmt === 'ru' ? toRoman(n, true) : numFmt === 'of' ? `Page ${n} of ${last}` : String(n);
          const { width, height } = pg.getSize(), size = 11, tw = font.widthOfTextAtSize(s, size);
          const x = pos === 'bc' || pos === 'tc' ? (width - tw) / 2 : width - tw - 28;
          pg.drawText(s, { x, y: pos === 'bc' || pos === 'br' ? 20 : height - 30, size, font, color: rgb(0.2, 0.2, 0.2) });
        });
        res.push([`${base}-numbered.pdf`, await pdfBlob(doc)]);
      } else if (id === 'watermark') {
        const pagesSel = wmPages === 'all' ? null : parseRanges(wmRange, count);
        if (wmPages === 'range' && !pagesSel) { setErr(p.badRange); return; }
        const allowed = new Set((pagesSel ?? []).flat());
        let stampPng: Blob;
        if (wmKind === 'text') {
          if (!wm.trim()) { setErr(p.needText); return; }
          stampPng = await textPng(wm, FONTS[wmFont], wmColor);
        } else {
          if (!wmImg) { setErr(p.needImage); return; }
          stampPng = await imagePng(wmImg);
        }
        const src = await PDFDocument.load(bytes);
        const out = wmLayer === 'under' ? await PDFDocument.create() : src;
        const img = await out.embedPng(new Uint8Array(await stampPng.arrayBuffer()));
        const factor = { s: 0.2, m: 0.35, l: 0.6 }[wmSizeK];
        const stamp = (pg: any, W: number, H: number) => {
          const w = W * factor, h = (w * img.height) / img.width;
          const spots: [number, number][] = wmTile
            ? [0.2, 0.5, 0.8].flatMap((x) => [0.15, 0.38, 0.62, 0.85].map((y): [number, number] => [x, y]))
            : [[[0.15, 0.5, 0.85][wmPos[1]], [0.85, 0.5, 0.15][wmPos[0]]]];
          for (const [fx, fy] of spots) {
            const c = cornerFor(W * fx, H * fy, w, h, wmRot);
            pg.drawImage(img, { x: c.x, y: c.y, width: w, height: h, rotate: degrees(wmRot), opacity: wmOpacity / 100 });
          }
        };
        const pagesIn = src.getPages();
        for (let i = 0; i < pagesIn.length; i++) {
          const { width, height } = pagesIn[i].getSize();
          if (wmLayer === 'under') {
            const np = out.addPage([width, height]);
            if (!pagesSel || allowed.has(i)) stamp(np, width, height);
            const [emb] = await out.embedPages([pagesIn[i]]);
            np.drawPage(emb);
          } else if (!pagesSel || allowed.has(i)) stamp(pagesIn[i], width, height);
        }
        res.push([`${base}-watermarked.pdf`, await pdfBlob(out)]);
      } else if (id === 'crop') {
        const doc = await PDFDocument.load(bytes), m = mm * MM;
        doc.getPages().forEach((pg) => {
          const b = pg.getMediaBox(), w = b.width - 2 * m, h = b.height - 2 * m;
          if (w <= 0 || h <= 0) throw new Error('crop');
          pg.setCropBox(b.x + m, b.y + m, w, h); pg.setMediaBox(b.x + m, b.y + m, w, h);
        });
        res.push([`${base}-cropped.pdf`, await pdfBlob(doc)]);
      } else if (id === 'pdf2jpg') {
        if (count > 30) { setErr(t.tooBig); return; }
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        const src = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
        for (let i = 1; i <= src.numPages; i++) {
          setProg(`${i} / ${src.numPages}`); await tick();
          const page = await src.getPage(i), vp = page.getViewport({ scale: 150 / 72 });
          const cv = document.createElement('canvas');
          cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          res.push([`${base}-${i}.jpg`, await jpeg(cv, 0.85)]);
          cv.width = 0; page.cleanup();
        }
      } else if (id === 'sign') {
        const sig = await signature();
        if (!sig) { setErr(p.signFirst); return; }
        const doc = await PDFDocument.load(bytes);
        const img = await doc.embedPng(new Uint8Array(await sig.arrayBuffer()));
        const pg = doc.getPage(Math.min(Math.max(signPage, 1), count) - 1), { width } = pg.getSize();
        const w = 150, h = (w * img.height) / img.width;
        pg.drawImage(img, { x: pos === 'bl' ? 36 : pos === 'bc' ? (width - w) / 2 : width - w - 36, y: 36, width: w, height: h });
        res.push([`${base}-signed.pdf`, await pdfBlob(doc)]);
      } else {
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: false });
        res.push([`${base}-repaired.pdf`, await pdfBlob(doc)]);
      }
      setOuts(res.map(([name, blob]) => ({ name, blob, url: URL.createObjectURL(blob), kb: (blob.size / 1024).toFixed(1) })));
    } catch { setErr(t.errMake); } finally { setBusy(false); setProg(''); }
  }

  async function zip() {
    const { default: JSZip } = await import('jszip');
    const z = new JSZip();
    outs.forEach((o) => z.file(o.name, o.blob));
    const url = URL.createObjectURL(await z.generateAsync({ type: 'blob' }));
    const a = document.createElement('a');
    a.href = url; a.download = `docsareeasy-${id}.zip`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const move = (i: number, d: number) => { const n = [...rows]; [n[i], n[i + d]] = [n[i + d], n[i]]; setRows(n); clearOut(); };

  // Drawing pad: pointer events for touch and mouse. The Type tab is the keyboard-friendly alternative.
  const at = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [(e.clientX - r.left) * (e.currentTarget.width / r.width), (e.clientY - r.top) * (e.currentTarget.height / r.height)];
  };
  const label: Record<PdfId, string> = { split: p.aSplit, rotate: p.aRotate, organize: p.aOrganize, pagenum: p.aPagenum, watermark: p.aWatermark, crop: p.aCrop, pdf2jpg: p.aJpg, sign: p.aSign, repair: p.aRepair };
  const posOpts: [Pos, string][] = id === 'sign' ? [['bl', p.pBL], ['bc', p.pBC], ['br', p.pBR]] : [['bc', p.pBC], ['br', p.pBR], ['tc', p.pTC], ['tr', p.pTR]];
  const changed = () => clearOut();

  return (
    <div className="tool">
      {!file ? (
        <label className="drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}>
          <input type="file" accept="application/pdf,.pdf" className="vh" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; pick(f); }} />
          <strong>{t.dropPdf}</strong>
          <span>PDF</span>
        </label>
      ) : (
        <div className="ws">
          <div className="ws-main"><div className="filecard">
          <p className="stats">{file.name} · {count} {t.pages}</p>
          <label className="btn ghost">
            <input type="file" accept="application/pdf,.pdf" className="vh" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; pick(f); }} />
            {t.change}
          </label>
          </div>
          <Preview lang={lang} original={file} results={outs} />
          </div>
          <aside className="ws-side">
          <h2 className="h3">{t.options}</h2>

          {id === 'split' && (
            <>
              <div className="seg" role="group" aria-label={p.pagesLbl}>
                <button type="button" aria-pressed={splitMode === 'all'} onClick={() => { setSplitMode('all'); changed(); }}>{p.splitAll}</button>
                <button type="button" aria-pressed={splitMode === 'range'} onClick={() => { setSplitMode('range'); changed(); }}>{p.splitRange}</button>
              </div>
              {splitMode === 'range' && (
                <div className="grid one"><label>{p.pagesLbl}<input type="text" inputMode="text" placeholder="1-3, 5, 8-10" value={ranges} onChange={(e) => { setRanges(e.target.value); changed(); }} /></label><p className="hint">{p.rangeHint}</p></div>
              )}
            </>
          )}
          {id === 'rotate' && (
            <div className="grid one"><label>{p.rotLbl}
              <select value={rot} onChange={(e) => { setRot(Number(e.target.value)); changed(); }}>
                <option value={90}>{p.r90}</option><option value={180}>{p.r180}</option><option value={270}>{p.r270}</option>
              </select></label></div>
          )}
          {id === 'organize' && (
            <ol className="files">
              {rows.map((r, i) => (
                <li key={r.orig}>
                  <span className="fname">{p.pageN} {r.orig + 1}{r.rot ? ` · ${r.rot}°` : ''}</span>
                  <button type="button" className="icon" aria-label={`${t.up}: ${r.orig + 1}`} disabled={i === 0} onClick={() => move(i, -1)}><Icon name="up" /></button>
                  <button type="button" className="icon" aria-label={`${t.down}: ${r.orig + 1}`} disabled={i === rows.length - 1} onClick={() => move(i, 1)}><Icon name="down" /></button>
                  <button type="button" className="icon" aria-label={`${p.rotLbl}: ${r.orig + 1}`} onClick={() => { setRows(rows.map((x, k) => (k === i ? { ...x, rot: (x.rot + 90) % 360 } : x))); changed(); }}><Icon name="reset" /></button>
                  <button type="button" className="icon" aria-label={`${t.remove}: ${r.orig + 1}`} onClick={() => { setRows(rows.filter((_, k) => k !== i)); changed(); }}><Icon name="x" /></button>
                </li>
              ))}
            </ol>
          )}
          {(id === 'pagenum' || id === 'sign') && (
            <div className="grid">
              <label>{id === 'sign' ? p.whereLbl : p.posLbl}
                <select value={pos} onChange={(e) => { setPos(e.target.value as Pos); changed(); }}>
                  {posOpts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select></label>
              {id === 'pagenum'
                ? <label>{p.startLbl}<input type="number" inputMode="numeric" min={0} value={start} onChange={(e) => { setStart(Number(e.target.value) || 0); changed(); }} /></label>
                : <label>{p.pageLbl}<input type="number" inputMode="numeric" min={1} max={count} value={signPage} onChange={(e) => { setSignPage(Number(e.target.value) || 1); changed(); }} /></label>}
            </div>
          )}
          {id === 'pagenum' && (
            <>
              <div className="grid one"><label>{p.fmtLbl}
                <select value={numFmt} onChange={(e) => { setNumFmt(e.target.value as typeof numFmt); changed(); }}>
                  <option value="num">{p.fmtNum}</option><option value="rl">{p.fmtRomanL}</option><option value="ru">{p.fmtRomanU}</option><option value="of">{p.fmtPageOf}</option>
                </select></label></div>
              <label className="check"><input type="checkbox" checked={skipFirst} onChange={(e) => { setSkipFirst(e.target.checked); changed(); }} />{p.skipFirst}</label>
            </>
          )}
          {id === 'watermark' && (
            <>
              <div className="seg" role="group" aria-label={p.wmType}>
                <button type="button" aria-pressed={wmKind === 'text'} onClick={() => { setWmKind('text'); changed(); }}>{p.wmTextTab}</button>
                <button type="button" aria-pressed={wmKind === 'image'} onClick={() => { setWmKind('image'); changed(); }}>{p.wmImgTab}</button>
              </div>
              {wmKind === 'text' ? (
                <>
                  <div className="grid one"><label>{p.wmText}<input type="text" maxLength={40} value={wm} onChange={(e) => { setWm(e.target.value); changed(); }} /></label></div>
                  <div className="grid">
                    <label>{p.wmFont}
                      <select value={wmFont} onChange={(e) => { setWmFont(e.target.value as keyof typeof FONTS); changed(); }}>
                        <option value="sans">{p.fSans}</option><option value="serif">{p.fSerif}</option><option value="mono">{p.fMono}</option><option value="script">{p.fScript}</option>
                      </select></label>
                    <label>{p.wmColor}<input type="color" value={wmColor} onChange={(e) => { setWmColor(e.target.value); changed(); }} /></label>
                  </div>
                </>
              ) : (
                <label className="btn ghost">
                  <input type="file" accept="image/*,.heic,.heif" className="vh" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) { setWmImg(f); changed(); } }} />
                  {wmImg ? wmImg.name : p.wmImage}
                </label>
              )}
              <div className="grid">
                <label>{p.wmSize}
                  <select value={wmSizeK} onChange={(e) => { setWmSizeK(e.target.value as 's' | 'm' | 'l'); changed(); }}>
                    <option value="s">{p.sS}</option><option value="m">{p.sM}</option><option value="l">{p.sL}</option>
                  </select></label>
                <label>{p.wmRot}
                  <select value={wmRot} onChange={(e) => { setWmRot(Number(e.target.value)); changed(); }}>
                    {[0, 30, 45, 90, 315, 330].map((d) => <option key={d} value={d}>{d > 180 ? `−${360 - d}` : d}°</option>)}
                  </select></label>
              </div>
              <label>{p.wmOpacity}: {wmOpacity}%
                <input type="range" min={10} max={100} step={5} value={wmOpacity} onChange={(e) => { setWmOpacity(Number(e.target.value)); changed(); }} />
              </label>
              <div role="group" aria-label={p.wmPos}>
                <span className="hint">{p.wmPos}</span>
                <div className="posgrid">
                  {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => (
                    <button key={`${r}${c}`} type="button" disabled={wmTile} aria-pressed={!wmTile && wmPos[0] === r && wmPos[1] === c}
                      aria-label={`${[p.rTop, p.rMid, p.rBot][r]} ${[p.cLeft, p.cCtr, p.cRight][c]}`} onClick={() => { setWmPos([r, c]); changed(); }}>
                      <span className="dot" aria-hidden="true" />
                    </button>
                  )))}
                </div>
              </div>
              <label className="check"><input type="checkbox" checked={wmTile} onChange={(e) => { setWmTile(e.target.checked); changed(); }} />{p.wmTile}</label>
              <div className="grid">
                <label>{p.wmPages}
                  <select value={wmPages} onChange={(e) => { setWmPages(e.target.value as 'all' | 'range'); changed(); }}>
                    <option value="all">{p.allPages}</option><option value="range">{p.somePages}</option>
                  </select></label>
                <label>{p.wmLayer}
                  <select value={wmLayer} onChange={(e) => { setWmLayer(e.target.value as 'over' | 'under'); changed(); }}>
                    <option value="over">{p.lOver}</option><option value="under">{p.lUnder}</option>
                  </select></label>
              </div>
              {wmPages === 'range' && <div className="grid one"><label>{p.pagesLbl}<input type="text" placeholder="1-3, 5" value={wmRange} onChange={(e) => { setWmRange(e.target.value); changed(); }} /></label><p className="hint">{p.rangeHint}</p></div>}
              {wmLayer === 'under' && <p className="hint">{p.lUnderNote}</p>}
            </>
          )}
          {id === 'crop' && (
            <div className="grid one"><label>{p.cropMm}<input type="number" inputMode="numeric" min={0} value={mm} onChange={(e) => { setMm(Math.max(0, Number(e.target.value) || 0)); changed(); }} /></label></div>
          )}
          {id === 'sign' && (
            <>
              <div className="seg" role="group" aria-label={p.aSign}>
                <button type="button" aria-pressed={tab === 'draw'} onClick={() => { setTab('draw'); setInked(false); }}>{p.drawTab}</button>
                <button type="button" aria-pressed={tab === 'type'} onClick={() => { setTab('type'); setInked(false); }}>{p.typeTab}</button>
              </div>
              {tab === 'draw' ? (
                <div className="stage">
                  <canvas ref={pad} className="sigpad" width={600} height={240} aria-label={p.signHint}
                    onPointerDown={(e) => {
                      const ctx = e.currentTarget.getContext('2d')!, [x, y] = at(e);
                      e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true;
                      ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000';
                      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); ctx.stroke(); setInked(true); changed();
                    }}
                    onPointerMove={(e) => { if (!drawing.current) return; const [x, y] = at(e); const ctx = e.currentTarget.getContext('2d')!; ctx.lineTo(x, y); ctx.stroke(); }}
                    onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} />
                  <p className="hint">{p.signHint}</p>
                  <button type="button" className="btn ghost" onClick={() => { const c = pad.current; if (c) c.getContext('2d')!.clearRect(0, 0, c.width, c.height); setInked(false); }}>{p.clearSig}</button>
                </div>
              ) : (
                <div className="grid one"><label>{p.typeName}<input type="text" maxLength={40} value={typed} onChange={(e) => { setTyped(e.target.value); changed(); }} /></label></div>
              )}
            </>
          )}
          {id === 'repair' && <p className="notice">{p.repairNote}</p>}

          <div className="actions">
            <button type="button" className="btn" disabled={busy} aria-busy={busy} onClick={run}>
              {busy ? <><span className="spin" aria-hidden="true" />{t.processing} {prog}</> : label[id]}
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
                  <span className="fname">{o.name} · {o.kb} KB</span>
                  <a className="btn" href={o.url} download={o.name}>{t.download}</a>
                </li>
              ))}
            </ul>
            {outs.length > 1 && <button type="button" className="btn ghost" onClick={zip}>{t.downloadZip}</button>}
          </div>
        </div>
      )}
    </div>
  );
}
