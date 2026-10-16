import { useEffect, useRef, useState } from 'react';
import { T, type Lang } from '../i18n';
import { baseName } from '../lib/pdfutil';
import { clamp, cropRect, EXT, formatOf, loadImage, render, type OutFmt, type Spec } from '../lib/image';
import { Icon } from './Icons';

type NumKey = 'w' | 'h' | 'minKB' | 'maxKB';
type Out = { url: string; blob: Blob; ok: boolean; fmt: OutFmt };

const DEFAULT: Spec = { w: 300, h: 300, minKB: 0, maxKB: 100, cleanup: false, format: 'jpeg' };
const MAXPX = 16_000_000; // safe canvas size on phones (iOS limit is 16,777,216)

type Props = { lang: Lang; preset?: Partial<Spec>; file?: File; onUse?: (r: { blob: Blob; ok: boolean; spec: Spec }) => void; hideChange?: boolean; saveAs?: string };

export default function ImageTool({ lang, preset, file, onUse, hideChange, saveAs }: Props) {
  const t = T[lang];
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [spec, setSpec] = useState<Spec>(DEFAULT);
  const [zoom, setZoom] = useState(1);
  const [c, setC] = useState({ x: 0, y: 0 });
  const [out, setOut] = useState<Out | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [swap, setSwap] = useState(false);
  const [orig, setOrig] = useState<OutFmt>('jpeg');
  const [srcName, setSrcName] = useState('');
  const dlg = useRef<HTMLDialogElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number; on: boolean } | null>(null);

  const valid = spec.w >= 10 && spec.h >= 10 && spec.maxKB > 0 && spec.minKB <= spec.maxKB && spec.w * spec.h <= 16_777_216;
  const aspect = valid ? spec.w / spec.h : 1;
  const sc = valid ? Math.min(300 / spec.w, 300 / spec.h) : 1;
  const pw = valid ? Math.max(1, Math.round(spec.w * sc)) : 300;
  const ph = valid ? Math.max(1, Math.round(spec.h * sc)) : 300;
  const rect = img && valid ? cropRect(img.naturalWidth, img.naturalHeight, aspect, zoom, c) : null;
  const ip = { inputMode: 'numeric' as const, 'aria-describedby': valid ? undefined : 'spec-err' };

  useEffect(() => {
    const ctx = cv.current?.getContext('2d');
    if (!ctx || !img || !rect) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, pw, ph);
    ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, pw, ph);
  }, [img, rect?.sx, rect?.sy, rect?.sw, rect?.sh, pw, ph]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (swap && !d.open) d.showModal();
    if (!swap && d.open) d.close();
  }, [swap]);

  useEffect(() => { if (file) pick(file); }, [file]);

  function clearOut() {
    if (out) URL.revokeObjectURL(out.url);
    setOut(null);
  }
  async function pick(f: File) {
    setErr('');
    try {
      const i = await loadImage(f);
      let w = i.naturalWidth, h = i.naturalHeight;
      if (w * h > MAXPX) { const k = Math.sqrt(MAXPX / (w * h)); w = Math.floor(w * k); h = Math.floor(h * k); }
      clearOut();
      if (img) URL.revokeObjectURL(img.src);
      setImg(i); setZoom(1); setC({ x: i.naturalWidth / 2, y: i.naturalHeight / 2 });
      setSpec({ w: preset?.w ?? w, h: preset?.h ?? h, minKB: preset?.minKB ?? 0, maxKB: preset?.maxKB ?? Math.max(1, Math.ceil(f.size / 1000)), cleanup: preset?.cleanup ?? false, format: formatOf(f) });
      setOrig(formatOf(f)); setSrcName(f.name);
      setSwap(false);
    } catch { setErr(t.err); }
  }
  const num = (k: NumKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpec({ ...spec, [k]: Math.max(0, Number(e.target.value) || 0) }); clearOut();
  };
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = drag.current;
    if (!d || !img || !rect) return;
    if (!d.on && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 4) return; // drag threshold
    d.on = true;
    const k = pw / e.currentTarget.getBoundingClientRect().width;
    const dx = (e.clientX - d.x) * k, dy = (e.clientY - d.y) * k;
    d.x = e.clientX; d.y = e.clientY;
    const cx = rect.sx + rect.sw / 2, cy = rect.sy + rect.sh / 2;
    setC({
      x: clamp(cx - (dx * rect.sw) / pw, rect.sw / 2, img.naturalWidth - rect.sw / 2),
      y: clamp(cy - (dy * rect.sh) / ph, rect.sh / 2, img.naturalHeight - rect.sh / 2),
    });
    clearOut();
  }
  function shift(fx: number, fy: number) {
    if (!img || !rect) return;
    setC({
      x: clamp(rect.sx + rect.sw / 2 + fx * rect.sw, rect.sw / 2, img.naturalWidth - rect.sw / 2),
      y: clamp(rect.sy + rect.sh / 2 + fy * rect.sh, rect.sh / 2, img.naturalHeight - rect.sh / 2),
    });
    clearOut();
  }
  function resetCrop() {
    setZoom(1); clearOut();
    if (img) setC({ x: img.naturalWidth / 2, y: img.naturalHeight / 2 });
  }
  function onKey(e: React.KeyboardEvent<HTMLCanvasElement>) {
    const s = 0.05, zin = () => setZoom((z) => Math.min(4, z + 0.25));
    const keys: Record<string, () => void> = {
      ArrowLeft: () => shift(s, 0), ArrowRight: () => shift(-s, 0),
      ArrowUp: () => shift(0, s), ArrowDown: () => shift(0, -s),
      '+': zin, '=': zin, '-': () => setZoom((z) => Math.max(1, z - 0.25)), Home: resetCrop,
    };
    const act = keys[e.key];
    if (act) { e.preventDefault(); act(); clearOut(); }
  }
  async function make() {
    if (!img || !rect) return;
    setBusy(true); setErr(''); clearOut();
    try {
      const r = await render(img, rect, spec);
      setOut({ url: URL.createObjectURL(r.blob), blob: r.blob, ok: r.ok, fmt: spec.format });
    } catch { setErr(t.errMake); }
    setBusy(false);
  }

  const dropZone = (
    <label className="drop" onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) pick(f); }}>
      <input type="file" accept="image/*,.heic,.heif" className="vh"
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) pick(f); }} />
      <strong>{t.drop}</strong>
      <span>{t.formats}</span>
    </label>
  );

  if (!img) {
    return (
      <div className="tool">
        {dropZone}
        {err && <p className="err" role="alert">{err}</p>}
      </div>
    );
  }

  return (
    <div className="tool">
      <div className="ws">
        <div className="ws-main">
      <div className="stage">
        <canvas ref={cv} className="frame" width={pw} height={ph} tabIndex={0} aria-label={t.crop} aria-describedby="crop-hint" onKeyDown={onKey}
          style={{ maxWidth: '100%' }}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, on: false }; }}
          onPointerMove={move}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)} />
        <p className="hint" id="crop-hint">{t.drag}</p>
        <div className="pad">
          <button type="button" className="icon up" aria-label={t.up} onClick={() => shift(0, 0.05)}><Icon name="up" /></button>
          <button type="button" className="icon left" aria-label={t.left} onClick={() => shift(0.05, 0)}><Icon name="left" /></button>
          <button type="button" className="icon reset" aria-label={t.reset} onClick={resetCrop}><Icon name="reset" /></button>
          <button type="button" className="icon right" aria-label={t.right} onClick={() => shift(-0.05, 0)}><Icon name="right" /></button>
          <button type="button" className="icon down" aria-label={t.down} onClick={() => shift(0, -0.05)}><Icon name="down" /></button>
        </div>
        <label className="zoom">{t.zoom}
          <input type="range" min="1" max="4" step="0.05" value={zoom}
            onChange={(e) => { setZoom(Number(e.target.value)); clearOut(); }} />
        </label>
      </div>

      {out && (
        <div className="result" aria-live="polite">
          {out.fmt !== 'pdf' && <img src={out.url} alt={`${t.result}: ${spec.w}×${spec.h} px`} width={spec.w} height={spec.h} />}
          <div>
            <p className="stats">{spec.w}×{spec.h} px · {(out.blob.size / 1024).toFixed(1)} KB</p>
            <p className={out.ok ? 'badge ok' : 'badge bad'}><Icon name={out.ok ? 'check' : 'x'} /><span>{out.ok ? t.pass : t.fail}</span></p>
            <div className="actions"><a className="btn" href={out.url} download={`${saveAs ?? (srcName ? baseName(srcName) + '-resized' : 'resized')}.${EXT[out.fmt]}`}>{t.download}</a>{onUse && out.ok && <button type="button" className="btn" onClick={() => onUse({ blob: out.blob, ok: out.ok, spec: { ...spec, format: out.fmt } })}>{t.useFile}</button>}</div>
          </div>
        </div>
      )}
        </div>
        <aside className="ws-side">
          <h2 className="h3">{t.options}</h2>
      <div className="grid">
        <label>{t.width}<input type="number" {...ip} value={spec.w} onChange={num('w')} /></label>
        <label>{t.height}<input type="number" {...ip} value={spec.h} onChange={num('h')} /></label>
        <label>{t.minkb}<input type="number" {...ip} value={spec.minKB} onChange={num('minKB')} /></label>
        <label>{t.maxkb}<input type="number" {...ip} value={spec.maxKB} onChange={num('maxKB')} /></label>
        <label>{t.outFormat}
          <select value={spec.format} onChange={(e) => { setSpec({ ...spec, format: e.target.value as OutFmt }); clearOut(); }}>
            {(['jpeg', 'png', 'webp', 'pdf'] as OutFmt[]).map((f) => (
              <option key={f} value={f}>{f === 'jpeg' ? 'JPEG' : f === 'png' ? 'PNG' : f === 'webp' ? 'WebP' : 'PDF'}{f === orig ? ` (${t.sameAs})` : ''}</option>
            ))}
          </select>
        </label>
      </div>
      {spec.format === 'png' && <p className="hint">{t.pngNote}</p>}
      {!valid && <p className="err" id="spec-err">{t.invalid}</p>}

      <div className="actions">
        <button type="button" className="btn" disabled={!valid || busy} aria-busy={busy} onClick={make}>
          {busy ? <><span className="spin" aria-hidden="true" />{t.processing}</> : t.make}
        </button>
        {!hideChange && <button type="button" className="btn ghost" onClick={() => { setErr(''); setSwap(true); }}>{t.change}</button>}
      </div>
      {err && !swap && <p className="err" role="alert">{err}</p>}

        </aside>
      </div>
      <dialog ref={dlg} className="dlg" aria-labelledby="dlg-t" onClose={() => setSwap(false)}>
        <h2 id="dlg-t" className="h2">{t.change}</h2>
        {dropZone}
        {err && <p className="err" role="alert">{err}</p>}
        <button type="button" className="btn ghost" onClick={() => setSwap(false)}>{t.cancel}</button>
      </dialog>

    </div>
  );
}
