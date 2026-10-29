import type { FieldSpec } from './fields';

export function FieldInput({ spec, value, onChange }: { spec: FieldSpec; value: string; onChange: (v: string) => void }) {
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
