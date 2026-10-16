import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName } from '../lib/pdfutil';
import { ChangeBtn, DropPdf, Downloads, jpegOf, mkOut, tick, useOuts } from './ToolParts';
import { Icon } from './Icons';
import Preview from './Preview';

export default function ToolSecure({ lang, mode }: { lang: Lang; mode: 'protect' | 'unlock' }) {
  const t = T[lang], p = P[lang];
  const [file, setFile] = useState<File | null>(null);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [outs, setOuts] = useOuts();

  async function run() {
    if (!file) return;
    if (!pw) { setErr(p.pwBad); return; }
    if (mode === 'protect' && pw !== pw2) { setErr(p.pwMismatch); return; }
    setBusy(true); setErr(''); setOuts([]);
    try {
      const bytes = await file.arrayBuffer();
      let out: Uint8Array;
      if (mode === 'protect') {
        const doc: any = await PDFDocument.load(bytes);
        await doc.encrypt({ userPassword: pw, ownerPassword: pw, permissions: { printing: 'highResolution', modifying: false, copying: true, annotating: false, fillingForms: false, contentAccessibility: true, documentAssembly: false } });
        out = await doc.save();
      } else {
        const doc: any = await PDFDocument.load(bytes, { password: pw } as any);
        out = await doc.save();
      }
      setOuts([mkOut(`${baseName(file.name)}-${mode === 'protect' ? 'protected' : 'unlocked'}.pdf`, new Blob([out as BlobPart], { type: 'application/pdf' }))]);
    } catch { setErr(mode === 'unlock' ? p.pwBad : t.errMake); } finally { setBusy(false); }
  }
  return (
    <div className="tool">
      {!file ? <DropPdf lang={lang} onFile={(f) => { setFile(f); setOuts([]); setErr(''); }} /> : (
        <div className="ws">
          <div className="ws-main">
            <div className="filecard"><p className="stats">{file.name}</p><ChangeBtn lang={lang} onFile={(f) => { setFile(f); setOuts([]); }} /></div>
            {mode === 'unlock' && <Preview lang={lang} results={outs} />}
          </div>
          <aside className="ws-side">
            <h2 className="h3">{t.options}</h2>
            <div className="grid one">
              <label>{p.pwLbl}<input type="password" autoComplete="off" value={pw} onChange={(e) => { setPw(e.target.value); setErr(''); }} /></label>
              {mode === 'protect' && <label>{p.pw2Lbl}<input type="password" autoComplete="off" value={pw2} onChange={(e) => { setPw2(e.target.value); setErr(''); }} /></label>}
            </div>
            {mode === 'protect' && <p className="notice">{p.protNote}</p>}
            <div className="actions"><button type="button" className="btn" disabled={busy} aria-busy={busy} onClick={run}>{busy ? <><span className="spin" aria-hidden="true" />{t.processing}</> : mode === 'protect' ? p.aProtect : p.aUnlock}</button></div>
            {err && <p className="err" role="alert">{err}</p>}
            <Downloads lang={lang} outs={outs} />
          </aside>
        </div>
      )}
    </div>
  );
}
