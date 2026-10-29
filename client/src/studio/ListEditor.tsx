import { useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import { FieldInput } from './FieldInput';
import { fromForm, toForm, type FieldSpec } from './fields';

interface Props {
  title: string;
  help: string;
  itemLabel: string;
  endpoint: string;
  fields: FieldSpec[];
  initial: Record<string, unknown>[];
  max: number;
  onSaved: (message: string) => void;
}

/** Edits an ordered list (projects, skills…) and saves the whole list at once */
export function ListEditor({ title, help, itemLabel, endpoint, fields, initial, max, onSaved }: Props) {
  const [items, setItems] = useState(() => initial.map((i) => toForm(i, fields)));
  const [state, setState] = useState<{ busy: boolean; msg: string; error: boolean }>({ busy: false, msg: '', error: false });

  const update = (i: number, key: string, v: string) =>
    setItems((list) => list.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
  const move = (i: number, d: -1 | 1) =>
    setItems((list) => {
      const next = [...list];
      const j = i + d;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  const remove = (i: number) => {
    if (confirm(`Remove this ${itemLabel.toLowerCase()}? It disappears from your page when you save.`))
      setItems((list) => list.filter((_, idx) => idx !== i));
  };
  const add = () => setItems((list) => [...list, toForm({}, fields)]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setState({ busy: true, msg: '', error: false });
    try {
      await api(endpoint, { method: 'PUT', body: items.map((it) => fromForm(it, fields)) });
      setState({ busy: false, msg: '', error: false });
      onSaved(`${title} saved. Your public page is updated.`);
    } catch (err) {
      setState({ busy: false, msg: (err as Error).message, error: true });
    }
  }

  return (
    <form onSubmit={save} className="editor">
      <div className="editor__head">
        <div>
          <h2>{title}</h2>
          <p className="muted small">{help}</p>
        </div>
        <button className="btn btn--primary" disabled={state.busy}>{state.busy ? 'Saving…' : `Save ${title.toLowerCase()}`}</button>
      </div>
      {state.msg && <p role="status" className={state.error ? 'error' : 'ok'}>{state.msg}</p>}

      {items.length === 0 && <p className="panel empty muted">Nothing here yet. Add your first {itemLabel.toLowerCase()} below.</p>}

      {items.map((it, i) => (
        <fieldset key={i} className="panel item">
          <legend className="mono">{itemLabel} {i + 1}</legend>
          <div className="item__tools">
            <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${itemLabel} ${i + 1} up`}>↑</button>
            <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${itemLabel} ${i + 1} down`}>↓</button>
            <button type="button" className="icon-btn danger" onClick={() => remove(i)}>Remove</button>
          </div>
          <div className="grid2">
            {fields.map((f) => (
              <FieldInput key={f.key} spec={f} value={it[f.key] ?? ''} onChange={(v) => update(i, f.key, v)} />
            ))}
          </div>
        </fieldset>
      ))}

      {items.length < max && (
        <button type="button" className="btn add" onClick={add}>Add {itemLabel.toLowerCase()}</button>
      )}
    </form>
  );
}
