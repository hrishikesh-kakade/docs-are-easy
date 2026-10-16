import { STATES } from './states';
export type DocType = 'photo' | 'signature' | 'thumb' | 'certificate' | 'class10' | 'class12' | 'graduation' | 'id' | 'category' | 'pwbd' | 'domicile' | 'declaration' | 'guardian' | 'special' | 'other';
export type Fmt = 'jpeg' | 'png' | 'webp' | 'pdf';
export type Status = 'verified' | 'unverified' | 'outdated';
export type Category = 'ssc' | 'upsc' | 'banking' | 'railway' | 'defence' | 'teaching' | 'state' | 'custom';

export type Spec = {
  docType: DocType; required: boolean; outputFormats: Fmt[];
  width?: number; height?: number; unit?: 'px' | 'mm' | 'cm'; dpi?: number; // official unit kept as written
  minKB?: number; maxKB?: number; sourceNote?: string;
};
export type Notification = {
  id: string; examId: string; examName: string; category: Category; cycle: string; title: string; status: Status; state?: string;
  lastVerified?: string; published?: string; siteUrl: string; notificationUrl: string | null;
  supersededBy?: string; specs: Spec[]; note?: string;
};

// Maintained by hand. https alone does not make a link official.
export const OFFICIAL_DOMAINS = ['.gov.in', '.nic.in', 'ibps.in', 'sbi.co.in', 'cdac.in', 'mscepune.in'];

export function isOfficialUrl(u: string): boolean {
  let x: URL;
  try { x = new URL(u); } catch { return false; }
  if (x.protocol !== 'https:') return false;
  const h = x.hostname.toLowerCase();
  return OFFICIAL_DOMAINS.some((d) => (d.startsWith('.') ? h.endsWith(d) : h === d || h.endsWith('.' + d)));
}

/** A verified record becomes outdated when superseded or 180 days after last verification. */
export function effectiveStatus(n: Notification, today: Date): Status {
  if (n.status !== 'verified') return n.status;
  if (n.supersededBy) return 'outdated';
  if (!n.lastVerified) return 'unverified';
  const days = (today.getTime() - new Date(n.lastVerified + 'T00:00:00Z').getTime()) / 86400000;
  return days > 180 ? 'outdated' : 'verified';
}

/** Rules a schema cannot express. Returns problems; an empty list means the record is acceptable. */
export function checkRecord(n: Notification): string[] {
  const e: string[] = [];
  if (!isOfficialUrl(n.siteUrl)) e.push(`${n.id}: siteUrl is not an official https address`);
  if (n.category === 'state' && !STATES.some((s) => s.key === n.state)) e.push(`${n.id}: state exams need a known state key`);
  if (n.notificationUrl && !isOfficialUrl(n.notificationUrl)) e.push(`${n.id}: notificationUrl is not an official https address`);
  if (n.status === 'verified') {
    if (!n.lastVerified) e.push(`${n.id}: verified needs lastVerified`);
    if (!n.notificationUrl) e.push(`${n.id}: verified needs a direct notificationUrl`);
    if (!n.specs.length) e.push(`${n.id}: verified needs specs`);
  }
  n.specs.forEach((s, i) => {
    if ((s.width == null) !== (s.height == null)) e.push(`${n.id}[${i}]: width and height go together`);
    if (s.minKB != null && s.maxKB != null) {
      if (s.minKB > s.maxKB) e.push(`${n.id}[${i}]: minKB is above maxKB`);
      else if (s.minKB * 1024 > s.maxKB * 1000) e.push(`${n.id}[${i}]: KB interval is empty under both readings of KB, review this spec`);
    }
  });
  return e;
}

export function checkAll(list: Notification[]): string[] {
  const e = list.flatMap(checkRecord);
  const ids = new Set(list.map((n) => n.id));
  if (ids.size !== list.length) e.push('duplicate notification ids');
  list.forEach((n) => { if (n.supersededBy && !ids.has(n.supersededBy)) e.push(`${n.id}: supersededBy points to a missing id`); });
  return e;
}
