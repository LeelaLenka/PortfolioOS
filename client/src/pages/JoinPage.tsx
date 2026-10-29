import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { api } from '../lib/api';

export function JoinPage() {
  const [form, setForm] = useState({ name: '', email: '', slug: '', reason: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    // Page address: lowercase, spaces become hyphens, anything else is dropped
    const value = k === 'slug'
      ? e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g, '-')
      : e.target.value;
    setForm({ ...form, [k]: value });
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api('/access-requests', { method: 'POST', body: form });
      setStatus('sent');
    } catch (err) {
      setError((err as Error).message);
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <Shell>
        <div className="panel status">
          <h1 className="status__title">Request sent</h1>
          <p>
            Once it’s approved, you’ll receive an access key. Then log in with <strong>{form.email}</strong> and that key
            to edit your portfolio. It will be live at:
          </p>
          <p className="mono accent">{window.location.origin}/p/{form.slug}</p>
          <Link className="btn" to="/demo">Back to the example</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="auth">
        <h1 className="auth__title">Request your own portfolio</h1>
        <p className="muted">
          You’ll start with a copy of the <Link to="/demo">example portfolio</Link> and replace it with your own details.
          Every request is reviewed before an access key is issued.
        </p>
        <form className="panel form" onSubmit={submit}>
          <label>Full name<input required maxLength={80} value={form.name} onChange={set('name')} autoComplete="name" /></label>
          <label>Email<input required type="email" maxLength={120} value={form.email} onChange={set('email')} autoComplete="email" /></label>
          <label>
            Your page address
            <span className="slug-input">
              <span className="mono muted">/p/</span>
              <input required minLength={3} maxLength={30} value={form.slug} onChange={set('slug')} placeholder="your-name" />
            </span>
            <span className="hint">3–30 lowercase letters, numbers or hyphens.</span>
          </label>
          <label>What will you use it for? <span className="muted">(optional)</span>
            <textarea rows={3} maxLength={500} value={form.reason} onChange={set('reason')} />
          </label>
          <button className="btn btn--primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send request'}
          </button>
          {error && <p role="alert" className="error">{error}</p>}
        </form>
      </div>
    </Shell>
  );
}
