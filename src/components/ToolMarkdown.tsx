import { useState } from 'react';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName } from '../lib/pdfutil';
import { ChangeBtn, DropPdf, Downloads, jpegOf, mkOut, tick, useOuts } from './ToolParts';
import { Icon } from './Icons';
import Preview from './Preview';
import { pageLines, toMarkdown } from '../lib/pdftext';

export default function ToolMarkdown({ lang }: { lang: Lang }) {
  const t = T[lang], p = P[lang];
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [md, setMd] = useState('');
  const [outs, setOuts] = useOuts();
  async function run() {
    if (!file) return;
    setBusy(true); setErr(''); setOuts([]);
    try {
      const text = toMarkdown(await pageLines(await file.arrayBuffer()));
      setMd(text); setOuts([mkOut(`${baseName(file.name)}.md`, new Blob([text], { type: 'text/markdown' }))]);
    } catch { setErr(t.errPdf); } finally { setBusy(false); }
  }
  return (
    <div className="tool">
      {!file ? <DropPdf lang={lang} onFile={(f) => { setFile(f); setMd(''); setOuts([]); setErr(''); }} /> : (
        <div className="ws">
          <div className="ws-main">
            <div className="filecard"><p className="stats">{file.name}</p><ChangeBtn lang={lang} onFile={(f) => { setFile(f); setMd(''); setOuts([]); }} /></div>
            <Preview lang={lang} original={file} results={[]} />
            {md && <pre className="mdprev" tabIndex={0}>{md.slice(0, 8000)}</pre>}
          </div>
          <aside className="ws-side">
            <h2 className="h3">{t.options}</h2>
            <p className="notice">{p.mdNote}</p>
            <div className="actions"><button type="button" className="btn" disabled={busy} aria-busy={busy} onClick={run}>{busy ? <><span className="spin" aria-hidden="true" />{t.processing}</> : p.aMd}</button></div>
            {err && <p className="err" role="alert">{err}</p>}
            <Downloads lang={lang} outs={outs} />
          </aside>
        </div>
      )}
    </div>
  );
}
