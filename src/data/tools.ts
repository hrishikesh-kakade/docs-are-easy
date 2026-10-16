import type { IconName } from '../components/Icons';

export type ToolDef = { id: string; slug: string; icon: IconName; live: boolean; group: 'image' | 'organize' | 'edit' | 'optimize' | 'secure' | 'read' | 'soon' };

// Tools that work fully in the browser are live. The rest are listed as coming soon.
export const TOOLS: ToolDef[] = [
  { id: 'resizer', slug: 'image-resizer', icon: 'image', live: true, group: 'image' },
  { id: 'imgpdf', slug: 'image-to-pdf', icon: 'file', live: true, group: 'image' },
  { id: 'compress', slug: 'compress-pdf', icon: 'download', live: true, group: 'optimize' },
  { id: 'merge', slug: 'merge-pdf', icon: 'layers', live: true, group: 'organize' },
  { id: 'split', slug: 'split-pdf', icon: 'scissors', live: true, group: 'organize' },
  { id: 'rotate', slug: 'rotate-pdf', icon: 'reset', live: true, group: 'organize' },
  { id: 'organize', slug: 'organize-pdf', icon: 'layers', live: true, group: 'organize' },
  { id: 'pagenum', slug: 'page-numbers', icon: 'hash', live: true, group: 'edit' },
  { id: 'watermark', slug: 'watermark-pdf', icon: 'pen', live: true, group: 'edit' },
  { id: 'crop', slug: 'crop-pdf', icon: 'crop', live: true, group: 'organize' },
  { id: 'pdf2jpg', slug: 'pdf-to-jpg', icon: 'image', live: true, group: 'image' },
  { id: 'sign', slug: 'sign-pdf', icon: 'pen', live: true, group: 'edit' },
  { id: 'scan', slug: 'scan-to-pdf', icon: 'camera', live: true, group: 'image' },
  { id: 'repair', slug: 'repair-pdf', icon: 'file', live: true, group: 'optimize' },
  { id: 'edit', slug: 'edit-pdf', icon: 'pen', live: true, group: 'edit' },
  { id: 'forms', slug: 'pdf-forms', icon: 'file', live: true, group: 'edit' },
  { id: 'pdf2md', slug: 'pdf-to-markdown', icon: 'file', live: true, group: 'read' },
  { id: 'redact', slug: 'redact-pdf', icon: 'pen', live: true, group: 'secure' },
  { id: 'compare', slug: 'compare-pdf', icon: 'layers', live: true, group: 'read' },
  { id: 'ocr', slug: 'ocr-pdf', icon: 'search', live: true, group: 'read' },
  { id: 'protect', slug: 'protect-pdf', icon: 'idcard', live: true, group: 'secure' },
  { id: 'unlock', slug: 'unlock-pdf', icon: 'idcard', live: true, group: 'secure' },
];
