import { useState } from 'react';
import { uploadImage } from '../lib/upload';
import type { FieldSpec } from './fields';

export function FieldInput({ spec, value, onChange }: { spec: FieldSpec; value: string; onChange: (v: string) => void }) {
  if (spec.type === 'image') return <ImageField spec={spec} value={value} onChange={onChange} />;
  const common = {
    value,
    required: spec.required,
    maxLength: spec.max,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };
  return (
    <label className={spec.wide ? 'field field--wide' : 'field'}>
      {spec.label}
      {spec.type === 'textarea' || spec.type === 'lines' ? (
        <textarea rows={spec.type === 'lines' ? 4 : 2} {...common} />
      ) : (
        <input type={spec.type === 'url' ? 'url' : 'text'} placeholder={spec.type === 'url' ? 'https://' : undefined} {...common} />
      )}
      {spec.hint && <span className="hint">{spec.hint}</span>}
    </label>
  );
}

/** Upload from the computer (resized in the browser) or paste a link */
function ImageField({ spec, value, onChange }: { spec: FieldSpec; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file, spec.maxSide ?? 1200));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={spec.wide ? 'field field--wide' : 'field'}>
      <span>{spec.label}</span>
      <div className="image-field">
        {value ? <img src={value} alt="" className="image-field__preview" /> : <div className="image-field__preview image-field__empty mono">no image</div>}
        <div className="image-field__controls">
          <label className="btn upload-btn">
            {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
            <input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={(e) => void pick(e.target.files?.[0])} />
          </label>
          {value && <button type="button" className="icon-btn danger" onClick={() => onChange('')}>Remove</button>}
          <input type="url" placeholder="or paste an image link: https://" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
      {spec.hint && <span className="hint">{spec.hint}</span>}
      {error && <span className="error small">{error}</span>}
    </div>
  );
}
