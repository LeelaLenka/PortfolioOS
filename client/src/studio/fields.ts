/** Field definitions drive the generic editors, so each section is described once */
export type FieldType = 'text' | 'textarea' | 'url' | 'list' | 'lines';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  max?: number;
  wide?: boolean;
}

/** Arrays are edited as text: comma-separated ("list") or one per line ("lines") */
export function toForm(item: Record<string, unknown>, fields: FieldSpec[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    const v = item[f.key];
    if (Array.isArray(v)) out[f.key] = v.join(f.type === 'lines' ? '\n' : ', ');
    else out[f.key] = typeof v === 'string' ? v : '';
  }
  return out;
}

export function fromForm(form: Record<string, string>, fields: FieldSpec[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = (form[f.key] ?? '').trim();
    if (f.type === 'list') out[f.key] = v.split(',').map((s) => s.trim()).filter(Boolean);
    else if (f.type === 'lines') out[f.key] = v.split('\n').map((s) => s.trim()).filter(Boolean);
    else out[f.key] = v;
  }
  return out;
}

export const projectFields: FieldSpec[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, max: 80 },
  { key: 'category', label: 'Category', type: 'text', hint: 'One word, used for the filter buttons: web, ai, backend…', max: 20 },
  { key: 'summary', label: 'One-line summary', type: 'textarea', max: 400, wide: true },
  { key: 'before', label: 'Before: the problem', type: 'textarea', max: 400, wide: true },
  { key: 'built', label: 'Built: what you made and with what', type: 'textarea', max: 400, wide: true },
  { key: 'after', label: 'After: what changed', type: 'textarea', max: 400, wide: true },
  { key: 'tech', label: 'Tech', type: 'list', hint: 'Comma-separated, up to 12', wide: true },
  { key: 'liveUrl', label: 'Live demo link', type: 'url' },
  { key: 'repoUrl', label: 'Code link', type: 'url' },
];

export const skillFields: FieldSpec[] = [
  { key: 'name', label: 'Stage name', type: 'text', required: true, max: 40, hint: 'e.g. Design, Store, Serve, Ship' },
  { key: 'description', label: 'What happens at this stage', type: 'text', max: 200 },
  { key: 'items', label: 'Skills', type: 'list', hint: 'Comma-separated, up to 15', wide: true },
];

export const experienceFields: FieldSpec[] = [
  { key: 'role', label: 'Role', type: 'text', required: true, max: 80 },
  { key: 'organization', label: 'Organization', type: 'text', required: true, max: 80 },
  { key: 'period', label: 'Dates', type: 'text', max: 40, hint: 'e.g. Jun 2025 – Aug 2025' },
  { key: 'location', label: 'Location', type: 'text', max: 60 },
  { key: 'points', label: 'What you did', type: 'lines', hint: 'One point per line, up to 6', wide: true },
];

export const certificateFields: FieldSpec[] = [
  { key: 'name', label: 'Certificate', type: 'text', required: true, max: 100 },
  { key: 'issuer', label: 'Issued by', type: 'text', max: 80 },
  { key: 'date', label: 'Date', type: 'text', max: 30 },
  { key: 'url', label: 'Credential link', type: 'url' },
];
