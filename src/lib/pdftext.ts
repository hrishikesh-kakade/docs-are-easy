export type Line = { text: string; size: number; y: number };
export type DiffOp = { t: '=' | '-' | '+'; s: string };

export async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  return pdfjs;
}

/** Text lines of every page, top to bottom, with their font size. */
export async function pageLines(bytes: ArrayBuffer): Promise<Line[][]> {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
  const pages: Line[][] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p), tc = await page.getTextContent();
    const rows = new Map<number, { x: number; s: string; size: number }[]>();
    for (const it of tc.items as any[]) {
      if (!it.str || !it.str.trim()) continue;
      const y = Math.round(it.transform[5] / 2) * 2, size = Math.abs(it.transform[3]) || it.height || 10;
      const row = rows.get(y) ?? [];
      row.push({ x: it.transform[4], s: it.str, size }); rows.set(y, row);
    }
    pages.push([...rows.entries()].sort((a, b) => b[0] - a[0]).map(([y, cells]) => {
      cells.sort((a, b) => a.x - b.x);
      return { y, text: cells.map((c) => c.s).join(' ').replace(/\s+/g, ' ').trim(), size: Math.max(...cells.map((c) => c.size)) };
    }));
    page.cleanup();
  }
  doc.destroy();
  return pages;
}

export function toMarkdown(pages: Line[][]): string {
  const sizes = pages.flat().map((l) => l.size).sort((a, b) => a - b);
  const med = sizes.length ? sizes[Math.floor(sizes.length / 2)] : 10;
  const out: string[] = [];
  pages.forEach((lines, pi) => {
    let prevY: number | null = null, prevKind = '';
    const para: string[] = [];
    const flush = () => { if (para.length) { out.push(para.join(' ')); para.length = 0; } };
    for (const l of lines) {
      const bullet = /^([•▪◦*–-]|\d+[.)])\s+/.exec(l.text);
      const kind = l.size > med * 1.5 ? 'h1' : l.size > med * 1.2 ? 'h2' : bullet ? 'li' : 'p';
      const gap = prevY === null ? 0 : prevY - l.y;
      if (kind !== 'p' || prevKind !== 'p' || gap > l.size * 1.9) flush();
      if (kind === 'h1') out.push('# ' + l.text);
      else if (kind === 'h2') out.push('## ' + l.text);
      else if (kind === 'li') out.push('- ' + l.text.slice(bullet![0].length));
      else para.push(l.text);
      prevY = l.y; prevKind = kind;
    }
    flush();
    if (pi < pages.length - 1) out.push('---');
  });
  return out.join('\n\n') + '\n';
}

/** Line-by-line difference (longest common subsequence). */
export function diffLines(a: string[], b: string[]): DiffOp[] {
  const n = a.length, m = b.length, W = m + 1;
  const dp = new Uint16Array((n + 1) * W);
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i * W + j] = a[i] === b[j] ? dp[(i + 1) * W + j + 1] + 1 : Math.max(dp[(i + 1) * W + j], dp[i * W + j + 1]);
  const out: DiffOp[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ t: '=', s: a[i] }); i++; j++; }
    else if (dp[(i + 1) * W + j] >= dp[i * W + j + 1]) out.push({ t: '-', s: a[i++] });
    else out.push({ t: '+', s: b[j++] });
  }
  while (i < n) out.push({ t: '-', s: a[i++] });
  while (j < m) out.push({ t: '+', s: b[j++] });
  return out;
}
