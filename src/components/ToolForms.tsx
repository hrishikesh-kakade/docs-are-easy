import { useEffect, useRef, useState } from 'react';
import { PDFCheckBox, PDFDocument, PDFDropdown, PDFOptionList, PDFRadioGroup, PDFTextField } from 'pdf-lib';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName } from '../lib/pdfutil';
import { ChangeBtn, DropPdf, Downloads, jpegOf, mkOut, tick, useOuts } from './ToolParts';
import { Icon } from './Icons';
import Preview from './Preview';

type Field = { name: string; kind: 'text' | 'check' | 'select'; options: string[] };

export default function ToolForms({ lang }: { lang: Lang }) {
  const t = T[lang], p = P[lang];
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [vals, setVals] = useState<Record<string, string | boolean>>({});
  const [flat, setFlat] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [outs, setOuts] = useOuts();

  async function pick(f: File) {
    setErr(''); setOuts([]);
    try {
      const form = (await PDFDocument.load(await f.arrayBuffer())).getForm();
      const list = form.getFields().map((x): Field | null => {
        const name = x.getName();
        if (x instanceof PDFTextField) return { name, kind: 'text', options: [] };
        if (x instanceof PDFCheckBox) return { name, kind: 'check', options: [] };
        if (x instanceof PDFDropdown || x instanceof PDFRadioGroup || x instanceof PDFOptionList) return { name, kind: 'select', options: x.getOptions() };
        return null;
      }).filter((x): x is Field => x !== null);
      setFile(f); setFields(list); setVals({});
    } catch { setErr(t.errPdf); }
  }
  async function run() {
    if (!file) return;
    setBusy(true); setErr(''); setOuts([]);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer()), form = doc.getForm();
      for (const fl of fields) {
        const v = vals[fl.name];
        if (v === undefined || v === '') continue;
        const f = form.getField(fl.name);
        if (f instanceof PDFTextField) f.setText(String(v));
        else if (f instanceof PDFCheckBox) { if (v) f.check(); else f.uncheck(); }
        else if (f instanceof PDFDropdown || f instanceof PDFRadioGroup || f instanceof PDFOptionList) f.select(String(v));
      }
      if (flat) form.flatten();
      setOuts([mkOut(`${baseName(file.name)}-filled.pdf`, new Blob([(await doc.save()) as BlobPart], { type: 'application/pdf' }))]);
    } catch (e) { setErr(String(e).includes('WinAnsi') ? p.formsFont : t.errMake); } finally { setBusy(false); }
  }
  return (
    <div className="tool">
      {!file ? <DropPdf lang={lang} onFile={pick} /> : (
        <div className="ws">
          <div className="ws-main">
            <div className="filecard"><p className="stats">{file.name}</p><ChangeBtn lang={lang} onFile={pick} /></div>
            <Preview lang={lang} original={file} results={outs} />
          </div>
          <aside className="ws-side">
            <h2 className="h3">{t.options}</h2>
            {fields.length === 0 ? <p className="notice">{p.formsEmpty}</p> : (
              <>
                {fields.map((fl) => (
                  <label key={fl.name} className={fl.kind === 'check' ? 'check' : undefined}>
                    {fl.kind === 'check' ? (<><input type="checkbox" checked={!!vals[fl.name]} onChange={(e) => { setVals({ ...vals, [fl.name]: e.target.checked }); setOuts([]); }} />{fl.name}</>) : (<>
                      {fl.name}
                      {fl.kind === 'text'
                        ? <input type="text" value={String(vals[fl.name] ?? '')} onChange={(e) => { setVals({ ...vals, [fl.name]: e.target.value }); setOuts([]); }} />
                        : <select value={String(vals[fl.name] ?? '')} onChange={(e) => { setVals({ ...vals, [fl.name]: e.target.value }); setOuts([]); }}><option value="" />{fl.options.map((o) => <option key={o} value={o}>{o}</option>)}</select>}
                    </>)}
                  </label>
                ))}
                <label className="check"><input type="checkbox" checked={flat} onChange={(e) => { setFlat(e.target.checked); setOuts([]); }} />{p.flatten}</label>
                <div className="actions"><button type="button" className="btn" disabled={busy} aria-busy={busy} onClick={run}>{busy ? <><span className="spin" aria-hidden="true" />{t.processing}</> : p.aForms}</button></div>
              </>
            )}
            {err && <p className="err" role="alert">{err}</p>}
            <Downloads lang={lang} outs={outs} />
          </aside>
        </div>
      )}
    </div>
  );
}
