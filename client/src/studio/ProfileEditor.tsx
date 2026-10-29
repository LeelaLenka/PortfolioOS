import { useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import type { Profile, RoleCard } from '../lib/types';
import { FieldInput } from './FieldInput';
import type { FieldSpec } from './fields';

const groups: { title: string; fields: FieldSpec[] }[] = [
  {
    title: 'Introduction',
    fields: [
      { key: 'fullName', label: 'Full name', type: 'text', required: true, max: 80 },
      { key: 'headline', label: 'Headline', type: 'text', max: 100, hint: 'e.g. Software Engineer' },
      { key: 'tagline', label: 'Big headline on your page', type: 'text', max: 160, wide: true, hint: 'One sentence: “Bharat builds full-stack web apps…”' },
      { key: 'intro', label: 'Short intro', type: 'textarea', max: 600, wide: true },
      { key: 'location', label: 'Location', type: 'text', max: 60 },
      { key: 'tags', label: 'Highlight chips', type: 'text', max: 340, hint: 'Comma-separated, up to 8' },
      { key: 'currentPosition', label: 'Currently', type: 'text', max: 160, wide: true, hint: 'Your current position, e.g. “B.Tech CSE (AI & ML) student at SRM, building full-stack and AI projects”' },
      { key: 'openTo', label: 'Open to roles', type: 'text', max: 320, wide: true, hint: 'Comma-separated, up to 5, e.g. Software Development Engineer, AI/ML Engineer, Database Engineer' },
    ],
  },
  {
    title: 'Profile card',
    fields: [
      { key: 'focus', label: 'Focus', type: 'text', max: 80 },
      { key: 'stack', label: 'Stack', type: 'text', max: 80 },
      { key: 'signal', label: 'Signal', type: 'text', max: 80, hint: 'A credential or strength' },
      { key: 'status', label: 'Status', type: 'text', max: 80, hint: 'e.g. Open to internships' },
      { key: 'avatarUrl', label: 'Your photo', type: 'image', wide: true, maxSide: 600, hint: 'A clear, well-lit head-and-shoulders photo. Leave empty to show your initials.' },
    ],
  },
  {
    title: 'About',
    fields: [{ key: 'about', label: 'About you', type: 'textarea', max: 2000, wide: true }],
  },
  {
    title: 'Links',
    fields: [
      { key: 'email', label: 'Public email', type: 'text', max: 120 },
      { key: 'githubUsername', label: 'GitHub username', type: 'text', max: 39, hint: 'Just the username. Shows your recent repos.' },
      { key: 'linkedinUrl', label: 'LinkedIn link', type: 'url' },
      { key: 'resumeUrl', label: 'Resume link', type: 'url', hint: 'e.g. a Google Drive PDF shared with “Anyone with the link”' },
    ],
  },
];

export function ProfileEditor({ initial, onSaved }: { initial: Profile; onSaved: (message: string) => void }) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const f: Record<string, string> = {};
    for (const [k, v] of Object.entries(initial)) if (typeof v === 'string') f[k] = v;
    f.tags = initial.tags.join(', ');
    f.openTo = (initial.openTo ?? []).join(', ');
    return f;
  });
  const [roles, setRoles] = useState<RoleCard[]>(initial.roles);
  const [state, setState] = useState<{ busy: boolean; msg: string; error: boolean }>({ busy: false, msg: '', error: false });

  async function save(e: FormEvent) {
    e.preventDefault();
    setState({ busy: true, msg: '', error: false });
    const body = {
      ...form,
      tags: (form.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean),
      openTo: (form.openTo ?? '').split(',').map((s) => s.trim()).filter(Boolean),
      roles: roles.filter((r) => r.title.trim()),
    };
    try {
      await api('/me/profile', { method: 'PUT', body });
      setState({ busy: false, msg: '', error: false });
      onSaved('Profile saved. Your public page is updated.');
    } catch (err) {
      setState({ busy: false, msg: (err as Error).message, error: true });
    }
  }

  return (
    <form onSubmit={save} className="editor">
      <div className="editor__head">
        <div>
          <h2>Profile</h2>
          <p className="muted small">The top of your page: who you are and how to reach you.</p>
        </div>
        <button className="btn btn--primary" disabled={state.busy}>{state.busy ? 'Saving…' : 'Save profile'}</button>
      </div>
      {state.msg && <p role="status" className={state.error ? 'error' : 'ok'}>{state.msg}</p>}

      {groups.map((g) => (
        <fieldset key={g.title} className="panel item">
          <legend className="mono">{g.title}</legend>
          <div className="grid2">
            {g.fields.map((f) => (
              <FieldInput key={f.key} spec={f} value={form[f.key] ?? ''} onChange={(v) => setForm({ ...form, [f.key]: v })} />
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className="panel item">
        <legend className="mono">What you do</legend>
        <p className="muted small">Up to 6 short cards shown under About.</p>
        {roles.map((r, i) => (
          <div key={i} className="grid2 role-row">
            <label className="field">Title
              <input maxLength={60} value={r.title} onChange={(e) => setRoles(roles.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
            </label>
            <label className="field">Description
              <input maxLength={300} value={r.description} onChange={(e) => setRoles(roles.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
            </label>
            <button type="button" className="icon-btn danger" onClick={() => setRoles(roles.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        {roles.length < 6 && (
          <button type="button" className="btn add" onClick={() => setRoles([...roles, { title: '', description: '' }])}>Add card</button>
        )}
      </fieldset>
    </form>
  );
}
