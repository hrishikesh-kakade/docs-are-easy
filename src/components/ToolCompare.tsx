import { useState } from 'react';
import { T, type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { baseName } from '../lib/pdfutil';
import { ChangeBtn, DropPdf, Downloads, mkOut, useOuts } from './ToolParts';
import { Icon } from './Icons';
import Preview from './Preview';
import { diffLines, pageLines } from '../lib/pdftext';

type Row = { t: '-' | '+'; s: string; page: number };

export default function ToolCompare({ lang }: { lang: Lang }) {
  const t = T[lang], p = P[lang];
  const [a, setA] = useState<File | null>(null);
  const [b, setB] = useState<File | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [outs, setOuts] = useOuts();

  async function run() {
    if (!a || !b) { setErr(p.pickBoth); return; }
    setBusy(true); setErr(''); setRows(null); setOuts([]);
    try {
      const flat = (pages: Awaited<ReturnType<typeof pageLines>>) => pages.flatMap((ls, pi) => ls.map((l) => ({ s: l.text, page: pi + 1 })));
      const A = flat(await pageLines(await a.arrayBuffer())), B = flat(await pageLines(await b.arrayBuffer()));
      if (A.length > 3000 || B.length > 3000) { setErr(p.cmpTooBig); return; }
      const ops = diffLines(A.map((x) => x.s), B.map((x) => x.s));
      let i = 0, j = 0;
      const out: Row[] = [];
      for (const op of ops) {
        if (op.t === '=') { i++; j++; } else if (op.t === '-') out.push({ t: '-', s: op.s, page: A[i++].page }); else out.push({ t: '+', s: op.s, page: B[j++].page });
      }
      setRows(out);
      if (out.length) setOuts([mkOut('comparison.txt', new Blob([out.map((r) => `${r.t} [${r.page}] ${r.s}`).join('\n') + '\n'], { type: 'text/plain' }))]);
    } catch { setErr(t.errPdf); } finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <div className="ws">
        <div className="ws-main">
          {([[a, setA, p.cmpA], [b, setB, p.cmpB]] as const).map(([f, set, label]) => (
            <div key={label} className="filecard">
              <strong>{label}</strong>
              {f ? <p className="stats">{f.name}</p> : null}
              {f ? <ChangeBtn lang={lang} onFile={(x) => { set(x); setRows(null); }} /> : <DropPdf lang={lang} label={label} onFile={(x) => { set(x); setRows(null); }} />}
            </div>
          ))}
          {rows && (
            <section className="previewcard">
              {rows.length === 0 ? <p className="badge ok"><Icon name="check" /><span>{p.cmpSame}</span></p> : (
                <ul className="diff">
                  {rows.map((r, i) => (
                    <li key={i} className={r.t === '+' ? 'add' : 'del'}>
                      <Icon name={r.t === '+' ? 'plus' : 'minus'} /><span className="vh">{r.t === '+' ? p.cmpAdded : p.cmpRemoved}</span>
                      <span className="pg">{r.page}</span><span>{r.s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
        <aside className="ws-side">
          <h2 className="h3">{t.options}</h2>
          <div className="actions"><button type="button" className="btn" disabled={busy || !a || !b} aria-busy={busy} onClick={run}>{busy ? <><span className="spin" aria-hidden="true" />{t.processing}</> : p.aCompare}</button></div>
          {rows && rows.length > 0 && <p className="hint">{p.cmpAdded}: {rows.filter((r) => r.t === '+').length} · {p.cmpRemoved}: {rows.filter((r) => r.t === '-').length}</p>}
          {err && <p className="err" role="alert">{err}</p>}
          <Downloads lang={lang} outs={outs} />
        </aside>
      </div>
    </div>
  );
}
