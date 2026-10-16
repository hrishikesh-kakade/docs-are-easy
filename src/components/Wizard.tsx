import { useEffect, useMemo, useRef, useState } from 'react';
import { T, type Lang } from '../i18n';
import { W } from '../lib/wizard-i18n';
import type { DocType, Notification, Spec } from '../data/types';
import { EXT, formatOf, type OutFmt } from '../lib/image';
import { baseName } from '../lib/pdfutil';
import { presetFor } from '../lib/validate';
import ImageTool from './ImageTool';
import CompressPdf from './CompressPdf';
import { Icon, type IconName } from './Icons';
import { STATES } from '../data/states';

type Plan = { id: string; docType: DocType; label: string; slug: string; required: boolean; spec: Spec | null };
type Done = { blob: Blob; w?: number; h?: number; format: OutFmt; before: number };
const COMMON: DocType[] = ['photo', 'signature', 'class10', 'class12', 'graduation', 'id', 'category', 'pwbd', 'domicile', 'declaration', 'thumb', 'guardian', 'special'];
const ICON: Record<DocType, IconName> = {
  photo: 'user', signature: 'pen', thumb: 'user', certificate: 'file', class10: 'file', class12: 'file', graduation: 'file', id: 'idcard',
  category: 'file', pwbd: 'file', domicile: 'file', declaration: 'pen', guardian: 'pen', special: 'file', other: 'file',
};
const SPECIFIC = ['phys', 'scribe', 'admit', 'app', 'diploma', 'coafp', 'mh', 'post', 'edu', 'entry'] as const;
type SKey = (typeof SPECIFIC)[number];
const CATS = ['ssc', 'upsc', 'banking', 'railway', 'defence', 'teaching'] as const;
const slugify = (s: string) => s.trim().replace(/[^\p{L}\p{M}\p{N}_-]+/gu, '_').slice(0, 40) || 'document';
const kb = (n: number) => (n / 1024).toFixed(1);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const smooth = () => (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth') as ScrollBehavior;

export default function Wizard({ lang, data }: { lang: Lang; data: Notification[] }) {
  const t = T[lang], w = W[lang];
  const [step, setStep] = useState(1);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [sel, setSel] = useState<Notification | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [specQ, setSpecQ] = useState('');
  const [customs, setCustoms] = useState<{ id: string; name: string }[]>([]);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [done, setDone] = useState<Record<string, Done>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [renames, setRenames] = useState<Record<string, string>>({});
  const [notFound, setNotFound] = useState(false);
  const [ask, setAsk] = useState(false);
  const [fromReport, setFromReport] = useState(false);
  const [stateSel, setStateSel] = useState<string | null>(null);
  const [myExams, setMyExams] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newExam, setNewExam] = useState('');
  const dlg = useRef<HTMLDialogElement>(null);
  const addDlg = useRef<HTMLDialogElement>(null);

  // Deep link: ?exam=<id>. Unknown ids show a message instead of a blank page.
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('exam');
    if (!id) return;
    const n = data.find((x) => x.id === id);
    if (n) { setSel(n); setStep(2); } else setNotFound(true);
  }, []);
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (ask && !d.open) d.showModal();
    if (!ask && d.open) d.close();
  }, [ask]);
  useEffect(() => {
    const d = addDlg.current;
    if (!d) return;
    if (addOpen && !d.open) d.showModal();
    if (!addOpen && d.open) d.close();
  }, [addOpen]);
  // Nothing about the exam picker is remembered. Clear anything an earlier version stored.
  useEffect(() => { try { localStorage.removeItem('ar-exams'); localStorage.removeItem('ar-state'); } catch { /* ignore */ } }, []);

  const L: Record<DocType, string> = {
    photo: w.dPhoto, signature: w.dSign, thumb: w.dThumb, certificate: w.dCert, class10: w.dC10, class12: w.dC12, graduation: w.dGrad, id: w.dId,
    category: w.dCat, pwbd: w.dPwbd, domicile: w.dDom, declaration: w.dDecl, guardian: w.dGuard, special: w.dSpecial, other: '',
  };
  const SL: Record<SKey, string> = { phys: w.xPhys, scribe: w.xScribe, admit: w.xAdmit, app: w.xApp, diploma: w.xDiploma, coafp: w.xCoafp, mh: w.xMh, post: w.xPost, edu: w.xEdu, entry: w.xEntry };
  const catLabel: Record<string, string> = { state: w.stateChip, ssc: w.catSsc, upsc: w.catUpsc, banking: w.catBanking, railway: w.catRailway, defence: w.catDefence, teaching: w.catTeaching };

  const plan: Plan[] = useMemo(() => {
    if (!sel) return [];
    const fromSpecs = sel.specs.map((s, i): Plan => ({ id: `${s.docType}-${i}`, docType: s.docType, label: L[s.docType], slug: s.docType, required: s.required, spec: s }));
    const common = COMMON.filter((d) => picked.includes(d) && !sel.specs.some((s) => s.docType === d))
      .map((d): Plan => ({ id: d, docType: d, label: L[d], slug: d, required: false, spec: null }));
    const specific = SPECIFIC.filter((k) => picked.includes(k)).map((k): Plan => ({ id: `x-${k}`, docType: 'other', label: SL[k], slug: k, required: false, spec: null }));
    const own = customs.map((c): Plan => ({ id: c.id, docType: 'other', label: c.name, slug: slugify(c.name), required: false, spec: null }));
    return [...fromSpecs, ...common, ...specific, ...own];
  }, [sel, picked, customs, lang]);
  const bases = useMemo(() => {
    const seen: Record<string, number> = {};
    return plan.map((p) => { const n = (seen[p.slug] = (seen[p.slug] ?? 0) + 1); return p.slug + (n > 1 ? '-' + n : ''); });
  }, [plan]);
  const stems = useMemo(() => {
    const seen: Record<string, number> = {};
    return plan.map((p, i) => {
      const raw = (renames[p.id] ?? '').trim(), s = raw ? baseName(raw) : bases[i];
      const n = (seen[s] = (seen[s] ?? 0) + 1);
      return n > 1 ? `${s}-${n}` : s;
    });
  }, [plan, bases, renames]);
  const fileName = (i: number, p: Plan) => `${stems[i]}.${EXT[done[p.id].format]}`;
  const urls = useMemo(() => Object.fromEntries((Object.entries(done) as [string, Done][]).map(([k, v]) => [k, URL.createObjectURL(v.blob)])), [done]);
  useEffect(() => () => { Object.values(urls).forEach((u) => URL.revokeObjectURL(u)); }, [urls]);

  const missing = plan.filter((p) => !done[p.id]);
  const doneCount = plan.length - missing.length;
  const toggle = (k: string) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const toN = (name: string): Notification => ({
    id: `custom-${name.toLowerCase().replace(/\s+/g, '-')}`, examId: 'custom', examName: name, category: 'custom', cycle: '', title: name,
    status: 'unverified', siteUrl: '', notificationUrl: null, specs: [],
  });
  const saveExams = (list: string[]) => setMyExams(list);
  function addExam(raw: string) {
    const name = raw.trim().slice(0, 60);
    if (!name) return;
    saveExams(myExams.some((x) => x.toLowerCase() === name.toLowerCase()) ? myExams : [name, ...myExams].slice(0, 20));
    setQ(''); setNewExam(''); setAddOpen(false);
    choose(toN(name));
  }
  const openState = (k: string) => setStateSel(k);
  function backToExams() { setCat('all'); setStateSel(null); setQ(''); setStep(1); }

  function choose(n: Notification) {
    setSel(n); setFiles({}); setDone({}); setOpen(null); setNotFound(false);
    setPicked([]); setCustoms([]); setRenames({}); setSpecQ(''); setStep(2);
  }
  function reset() { setSel(null); setFiles({}); setDone({}); setOpen(null); setPicked([]); setCustoms([]); setRenames({}); setFromReport(false); setCat('all'); setStateSel(null); setQ(''); setStep(1); }
  function addOwn(raw: string) {
    const name = raw.trim().slice(0, 40);
    if (!name) return;
    setCustoms((c) => [...c, { id: `own-${Date.now()}`, name }]);
    setSpecQ('');
  }
  function removePlan(p: Plan) {
    if (p.id.startsWith('own-')) setCustoms((x) => x.filter((y) => y.id !== p.id));
    else if (p.id.startsWith('x-')) toggle(p.id.slice(2));
    else toggle(p.docType);
  }
  function proceed() { if (missing.length === 0) setStep(4); else setAsk(true); }
  function jump(id: string) {
    setAsk(false);
    setTimeout(() => document.getElementById(`doc-${id}`)?.scrollIntoView({ behavior: smooth(), block: 'center' }), 60);
  }
  function finish(p: Plan, f: File, d: Omit<Done, 'before'>) {
    setDone((x) => ({ ...x, [p.id]: { ...d, before: f.size } }));
    setOpen(null);
    if (fromReport) { setFromReport(false); setStep(4); }
  }
  function closeEditor() {
    setOpen(null);
    if (fromReport) { setFromReport(false); setStep(4); }
  }
  async function zip() {
    if (!sel) return;
    const { default: JSZip } = await import('jszip');
    const z = new JSZip();
    plan.forEach((p, i) => { if (done[p.id]) z.file(fileName(i, p), done[p.id].blob); });
    const url = URL.createObjectURL(await z.generateAsync({ type: 'blob' }));
    const a = document.createElement('a');
    a.href = url; a.download = `docsareeasy-${sel.id}.zip`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  // One click, many files. Some browsers ask permission for multiple downloads; the ZIP is the dependable option.
  async function downloadAll() {
    for (let i = 0; i < plan.length; i++) {
      const p = plan[i];
      if (!done[p.id]) continue;
      const a = document.createElement('a');
      a.href = urls[p.id]; a.download = fileName(i, p);
      document.body.appendChild(a); a.click(); a.remove();
      await wait(400);
    }
  }
  const fileInput = (p: Plan) => (
    <input type="file" className="vh" accept="image/*,.heic,.heif,application/pdf,.pdf"
      onChange={(e) => {
        const nf = e.target.files?.[0]; e.target.value = '';
        if (!nf) return;
        setFiles((x) => ({ ...x, [p.id]: nf }));
        setDone((x) => { const n = { ...x }; delete n[p.id]; return n; });
        setOpen(p.id);
      }} />
  );

  const stepper = (
    <ol className="stepper">
      {[w.s1, w.s2, w.s3, w.s4].map((x, i) => (
        <li key={i} className={step > i + 1 ? 'done' : undefined} aria-current={step === i + 1 ? 'step' : undefined}>
          <span className="sn">{step > i + 1 ? <Icon name="check" /> : i + 1}</span><span className="sl">{x}</span>
        </li>
      ))}
    </ol>
  );
  const backBtn = (to: number) => (
    <button type="button" className="btn ghost" onClick={() => setStep(to)}><Icon name="left" />{w.back}</button>
  );

  // ---------- 1. Select exam ----------
  if (step === 1 || !sel) {
    const nq = q.trim().toLowerCase();
    const stObj = (k?: string) => STATES.find((s) => s.key === k);
    const mine = myExams.map(toN);
    const hit = (n: Notification) => {
      const st = stObj(n.state);
      return [n.examName, n.title, st?.en, st?.hi].some((x) => x && x.toLowerCase().includes(nq));
    };
    const row = (n: Notification) => {
      const own = n.category === 'custom';
      return (
        <li key={n.id} className={own ? 'rowwrap' : undefined}>
          <button type="button" className="rowbtn" onClick={() => choose(n)}>
            <span className="rtext"><strong>{n.examName}</strong><br /><span className="hint">{n.state ? stObj(n.state)?.[lang] : own ? w.yourExams : catLabel[n.category]}</span></span>
            <Icon name="right" />
          </button>
          {own && <button type="button" className="pickx" aria-label={`${t.remove}: ${n.examName}`} onClick={() => saveExams(myExams.filter((x) => x !== n.examName))}><Icon name="x" /></button>}
        </li>
      );
    };
    const stateTile = (k: string) => {
      const s = stObj(k);
      return s && (
        <button key={k} type="button" className="tile" onClick={() => openState(k)}>
          <span className="ti"><Icon name="pin" /></span>{s[lang]}
        </button>
      );
    };
    let body;
    if (nq) {
      const res = [...mine, ...data].filter(hit);
      body = res.length > 0 ? <ul className="list">{res.map(row)}</ul> : (
        <button type="button" className="tile add" onClick={() => addExam(q)}>
          <span className="ti"><Icon name="plus" /></span>
          <span><strong>{w.addExam}</strong><br /><span className="hint">“{q.trim()}”</span></span>
        </button>
      );
    } else if (cat === 'state') {
      body = stateSel === null ? (
        <>
          <h3 className="h3">{w.chooseState}</h3>
          <div className="tiles st">{STATES.filter((s) => !s.ut).map((s) => stateTile(s.key))}</div>
          <h3 className="h3">{w.unionT}</h3>
          <div className="tiles st">{STATES.filter((s) => s.ut).map((s) => stateTile(s.key))}</div>
        </>
      ) : (
        <>
          <button type="button" className="backlink" onClick={() => setStateSel(null)}><Icon name="left" />{w.back}</button>
          <nav className="crumbs" aria-label="Breadcrumb">
            <button type="button" onClick={() => setStateSel(null)}>{w.stateChip}</button>
            <Icon name="right" />
            <strong aria-current="page">{stObj(stateSel)?.[lang]}</strong>
          </nav>
          <ul className="list">{data.filter((n) => n.state === stateSel).map(row)}</ul>
        </>
      );
    } else {
      const list = data.filter((n) => (cat === 'all' ? n.category !== 'state' : n.category === cat));
      body = (
        <>
          {cat === 'all' && (
            <div className="tiles st">
              <button type="button" className="tile pinned" onClick={() => { setCat('state'); setStateSel(null); }}>
                <span className="ti"><Icon name="pin" /></span><span><strong>{w.stateChip}</strong><br /><span className="hint">{w.chooseState}</span></span>
              </button>
            </div>
          )}
          <ul className="list">{(cat === 'all' ? mine : []).map(row)}{list.map(row)}</ul>
        </>
      );
    }
    return (
      <div className="tool">
        {stepper}
        {notFound && <p className="err" role="alert">{w.notFound}</p>}
        <div className="search">
          <span className="si"><Icon name="search" /></span>
          <input type="search" aria-label={w.search} placeholder={w.search} value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button type="button" className="clr" aria-label={w.clear} onClick={() => setQ('')}><Icon name="x" /></button>}
        </div>
        <div className="chiprow">
        <div className="chips" role="group" aria-label={w.s1}>
          {['all', 'state', ...CATS].map((c) => (
            <button key={c} type="button" className="chipbtn" aria-pressed={cat === c} onClick={() => { setCat(c); setStateSel(null); }}>{c === 'all' ? w.all : catLabel[c]}</button>
          ))}
        </div>
        <button type="button" className="btn ghost addbtn" aria-label={w.addExam} onClick={() => setAddOpen(true)}><Icon name="plus" /><span className="lbl">{w.addExam}</span></button>
        </div>
        {body}

        <dialog ref={addDlg} className="sheet" aria-labelledby="add-t" onClose={() => setAddOpen(false)}>
          <h2 id="add-t" className="h2">{w.addExam}</h2>
          <label>{w.examNameLbl}
            <input type="text" maxLength={60} value={newExam} onChange={(e) => setNewExam(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addExam(newExam); }} />
          </label>
          <div className="actions">
            <button type="button" className="btn" disabled={!newExam.trim()} onClick={() => addExam(newExam)}>{w.addGo}</button>
            <button type="button" className="btn ghost" onClick={() => setAddOpen(false)}>{t.cancel}</button>
          </div>
        </dialog>
      </div>
    );
  }

  // ---------- 2. Documents ----------
  if (step === 2) {
    const q2 = specQ.trim().toLowerCase();
    const hits = q2 ? SPECIFIC.filter((k) => SL[k].toLowerCase().includes(q2)) : []; // exam-specific documents appear only when searched
    const inCommon = q2 ? COMMON.some((d) => L[d].toLowerCase().includes(q2)) : false;
    const pickedSpecific = SPECIFIC.filter((k) => picked.includes(k));
    return (
      <div className="tool">
        {stepper}
        <div className="ws">
        <div className="ws-main">
        <button type="button" className="backlink" onClick={backToExams}><Icon name="left" />{w.back}</button>
        <div className="titlerow">
          <h2 className="h2">{sel.examName}</h2>
          {sel.siteUrl && <a className="btn ghost" href={sel.siteUrl} target="_blank" rel="noopener noreferrer">{w.openSite}<Icon name="ext" /></a>}
        </div>

        <div className="search">
          <span className="si"><Icon name="search" /></span>
          <input type="search" aria-label={w.specificSearch} placeholder={w.specificSearch} value={specQ}
            onChange={(e) => setSpecQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && q2 && hits.length === 0 && !inCommon) addOwn(specQ); }} />
          {specQ && <button type="button" className="clr" aria-label={w.clear} onClick={() => setSpecQ('')}><Icon name="x" /></button>}
        </div>
        {q2 && (
          <div className="panel" aria-live="polite">
            {hits.map((k) => (
              <button key={k} type="button" className="tile" aria-pressed={picked.includes(k)} onClick={() => toggle(k)}>
                <span className="ti"><Icon name={picked.includes(k) ? 'check' : 'file'} /></span>{SL[k]}
              </button>
            ))}
            {hits.length === 0 && inCommon && <p className="hint">{w.inList}</p>}
            {hits.length === 0 && !inCommon && (
              <button type="button" className="tile add" onClick={() => addOwn(specQ)}>
                <span className="ti"><Icon name="plus" /></span>
                <span><strong>{w.addOwn}</strong><br /><span className="hint">“{specQ.trim()}”</span></span>
              </button>
            )}
          </div>
        )}
        {(pickedSpecific.length > 0 || customs.length > 0) && (
          <div className="picks">
            {pickedSpecific.map((k) => (
              <span key={k} className="pick">{SL[k]}<button type="button" className="pickx" aria-label={`${t.remove}: ${SL[k]}`} onClick={() => toggle(k)}><Icon name="x" /></button></span>
            ))}
            {customs.map((c) => (
              <span key={c.id} className="pick">{c.name}<button type="button" className="pickx" aria-label={`${t.remove}: ${c.name}`} onClick={() => setCustoms((x) => x.filter((y) => y.id !== c.id))}><Icon name="x" /></button></span>
            ))}
          </div>
        )}

        <h3 className="h3">{w.commonT}</h3>
        <div className="tiles" role="group" aria-label={w.s2}>
          {COMMON.filter((d) => !sel.specs.some((s) => s.docType === d)).map((d) => {
            const on = picked.includes(d);
            return (
              <button key={d} type="button" className="tile" aria-pressed={on} onClick={() => toggle(d)}>
                <span className="ti"><Icon name={on ? 'check' : ICON[d]} /></span>{L[d]}
              </button>
            );
          })}
        </div>

        </div>
        <aside className="ws-side summary">
          <h2 className="h3">{w.selectedN.replace('{n}', String(plan.length))}</h2>
          {plan.length === 0 ? <p className="hint">{w.emptyPick}</p> : (
            <ul className="mini">
              {plan.map((p) => (
                <li key={p.id}><span>{p.label}</span><button type="button" className="pickx" aria-label={`${t.remove}: ${p.label}`} onClick={() => removePlan(p)}><Icon name="x" /></button></li>
              ))}
            </ul>
          )}
          <button type="button" className="btn" disabled={plan.length === 0} onClick={() => setStep(3)}>{w.cont}</button>
        </aside>
        </div>
        <div className="sticky mobile-only">
          <span>{w.selectedN.replace('{n}', String(plan.length))}</span>
          <button type="button" className="btn" disabled={plan.length === 0} onClick={() => setStep(3)}>{w.cont}</button>
        </div>
      </div>
    );
  }

  // ---------- 3. Prepare ----------
  if (step === 3) {
    return (
      <div className="tool">
        {stepper}
        <div className="prog">
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={plan.length} aria-valuenow={doneCount}
            aria-label={w.progressN.replace('{a}', String(doneCount)).replace('{b}', String(plan.length))}>
            <span style={{ width: `${plan.length ? (doneCount / plan.length) * 100 : 0}%` }} />
          </div>
          <span>{w.progressN.replace('{a}', String(doneCount)).replace('{b}', String(plan.length))}</span>
        </div>
        <p className="info"><Icon name="alert" />{w.refreshNote}</p>

        <ul className="list">
          {plan.map((p, pi) => {
            const f = files[p.id], d = done[p.id], k = f ? `${p.id}-${f.name}-${f.size}` : p.id;
            return (
              <li key={p.id} id={`doc-${p.id}`} className={`dcard${d ? ' is-done' : ''}`}>
                <div className="dhead">
                  <span className="ti big"><Icon name={d ? 'check' : ICON[p.docType]} /></span>
                  <div className="dtext">
                    <strong>{p.label}{p.required && <span className="tag">{w.required}</span>}</strong>
                    <span className={`chip2${d ? ' ok' : f ? '' : ' warn'}`}>{d ? w.prepared : f ? w.notPrepared : w.notUploaded}</span>
                  </div>
                </div>
                {f && <p className="fmeta">{f.name} · {kb(f.size)} KB</p>}
                {d && open !== p.id && <p className="fmeta">{kb(d.blob.size)} KB · {EXT[d.format].toUpperCase()}{d.w ? ` · ${d.w}×${d.h} px` : ''}</p>}
                {!f ? (
                  <label className="up">
                    {fileInput(p)}
                    <Icon name="upload" />
                    <span><strong>{w.upload}</strong><br /><span className="hint">{w.uploadHint}</span></span>
                  </label>
                ) : (
                  <div className="actions">
                    {open !== p.id
                      ? <button type="button" className="btn" onClick={() => setOpen(p.id)}>{d ? w.edit : w.prepare}</button>
                      : <button type="button" className="btn ghost" onClick={closeEditor}>{t.cancel}</button>}
                    <label className="btn ghost">{fileInput(p)}{w.replaceFile}</label>
                  </div>
                )}
                {f && open === p.id && (formatOf(f) === 'pdf' ? (
                  <CompressPdf key={k} lang={lang} file={f} target={p.spec?.maxKB} hideChange saveAs={bases[pi]}
                    onUse={(b, fmt) => finish(p, f, { blob: b, format: fmt })} />
                ) : (
                  <ImageTool key={k} lang={lang} file={f} preset={p.spec ? presetFor(p.spec) : undefined} hideChange saveAs={bases[pi]}
                    onUse={(r) => finish(p, f, { blob: r.blob, w: r.spec.format === 'pdf' ? undefined : r.spec.w, h: r.spec.format === 'pdf' ? undefined : r.spec.h, format: r.spec.format })} />
                ))}
              </li>
            );
          })}
        </ul>

        <div className="sticky">
          {backBtn(2)}
          <button type="button" className="btn" onClick={proceed}>{w.cont}</button>
        </div>

        <dialog ref={dlg} className="sheet" aria-labelledby="miss-t" onClose={() => setAsk(false)}>
          <div className="sheet-ico"><Icon name="alert" /></div>
          <h2 id="miss-t" className="h2">{w.missT}</h2>
          <p className="hint">{w.missSub}</p>
          <ul className="list">
            {missing.map((p) => (
              <li key={p.id} className="mrow">
                <span className="ti"><Icon name={ICON[p.docType]} /></span>
                <span className="mlabel">{p.label}</span>
                <span className="chip2 warn">{files[p.id] ? w.notPrepared : w.notUploaded}</span>
              </li>
            ))}
          </ul>
          <div className="actions">
            <button type="button" className="btn" onClick={() => jump(missing[0].id)}>{w.goUpload}</button>
            {doneCount > 0 && <button type="button" className="btn ghost" onClick={() => { setAsk(false); setStep(4); }}>{w.skip}</button>}
          </div>
        </dialog>
      </div>
    );
  }

  // ---------- 4. Your files ----------
  const ready = plan.map((p, i) => ({ p, i, d: done[p.id] })).filter((x) => x.d);
  const totalBytes = ready.reduce((s, x) => s + x.d.blob.size, 0);
  return (
    <div className="tool">
      {stepper}
      <div className="hero2">
        <span className="ti big okbg"><Icon name="check" /></span>
        <div>
          <h2 className="h2">{w.repT}</h2>
          <p className="hint">{w.readyN.replace('{n}', String(ready.length))} · {kb(totalBytes)} KB</p>
        </div>
      </div>
      <ul className="list">
        {ready.map(({ p, i, d }) => (
          <li key={p.id} className="dcard is-done">
            <div className="dhead">
              <span className="ti big"><Icon name={ICON[p.docType]} /></span>
              <div className="dtext">
                <strong>{p.label}</strong>
                <label className="rename"><span className="vh">{w.fileNameLbl}</span><span className="namefield"><input type="text" maxLength={60} aria-label={w.fileNameLbl} value={renames[p.id] ?? bases[i]} onChange={(e) => setRenames((x) => ({ ...x, [p.id]: e.target.value }))} /><span className="ext">.{EXT[d.format]}</span></span></label>
              </div>
              <span className="size">{kb(d.blob.size)} KB</span>
            </div>
            <div className="actions">
              <a className="btn" href={urls[p.id]} download={fileName(i, p)}><Icon name="download" />{t.download}</a>
              <button type="button" className="btn ghost"
                onClick={() => { setFromReport(true); setOpen(p.id); setStep(3); setTimeout(() => document.getElementById(`doc-${p.id}`)?.scrollIntoView({ behavior: smooth(), block: 'start' }), 80); }}>
                <Icon name="pen" />{w.reEdit}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="dlpanel">
        <button type="button" className="btn" onClick={zip}><Icon name="download" />{w.zip}</button>
        <button type="button" className="btn ghost" onClick={downloadAll}><Icon name="download" />{w.dlAll}</button>
      </div>
      <div className="actions">
        {backBtn(3)}
        <button type="button" className="btn ghost" onClick={reset}>{w.startOver}</button>
      </div>
    </div>
  );
}
