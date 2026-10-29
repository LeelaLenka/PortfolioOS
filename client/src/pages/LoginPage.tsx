import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { useAuth } from '../lib/auth';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/studio" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, accessKey);
      navigate('/studio');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="auth">
        <h1 className="auth__title">Log in to edit your portfolio</h1>
        <p className="muted">Use the email you requested access with and the access key you were sent.</p>
        <form className="panel form" onSubmit={submit}>
          <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
          <label>Access key<input required type="password" value={accessKey} onChange={(e) => setAccessKey(e.target.value)} autoComplete="current-password" placeholder="pos_…" className="mono" /></label>
          <button className="btn btn--primary" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
          {error && <p role="alert" className="error">{error}</p>}
        </form>
        <p className="muted small">No access key yet? <Link to="/join">Request your portfolio</Link>.</p>
      </div>
    </Shell>
  );
}
