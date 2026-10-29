import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { AccessRequest, Member } from '../lib/types';

interface IssuedKey { name: string; email: string; slug: string; accessKey: string }

/** Owner-only: approve requests, and reset keys or remove members */
export function AdminPanel() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = useCallback(() => {
    Promise.all([api<AccessRequest[]>('/admin/requests'), api<Member[]>('/admin/members')])
      .then(([r, m]) => {
        setRequests(r);
        setMembers(m);
      })
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function run(id: string, fn: () => Promise<void>) {
    setBusyId(id);
    setError('');
    try {
      await fn();
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId('');
    }
  }

  const approve = (r: AccessRequest) =>
    run(r.id, async () => setIssued(await api<IssuedKey>(`/admin/requests/${r.id}/approve`, { method: 'POST' })));
  const reject = (r: AccessRequest) =>
    confirm(`Reject ${r.name}’s request?`) && run(r.id, () => api(`/admin/requests/${r.id}/reject`, { method: 'POST' }).then(() => undefined));
  const resetKey = (m: Member) =>
    confirm(`Issue a new access key for ${m.email}? Their old key stops working immediately.`) &&
    run(m.id, async () => {
      const { accessKey } = await api<{ accessKey: string }>(`/admin/members/${m.id}/reset-key`, { method: 'POST' });
      setIssued({ name: m.profile?.fullName ?? m.email, email: m.email, slug: m.slug, accessKey });
    });
  const removeMember = (m: Member) =>
    confirm(`Delete ${m.email} and their whole portfolio? This can’t be undone.`) &&
    run(m.id, () => api(`/admin/members/${m.id}`, { method: 'DELETE' }).then(() => undefined));

  const pending = requests.filter((r) => r.status === 'PENDING');
  const reviewed = requests.filter((r) => r.status !== 'PENDING').slice(0, 10);

  return (
    <section className="editor">
      <div className="editor__head">
        <div>
          <h2>Access</h2>
          <p className="muted small">Approve a request to create that person’s portfolio and get their access key.</p>
        </div>
      </div>
      {error && <p role="alert" className="error">{error}</p>}
      {issued && <KeyCard issued={issued} onClose={() => setIssued(null)} />}

      <h3 className="sub">Waiting for review ({pending.length})</h3>
      {pending.length === 0 && <p className="panel empty muted">No pending requests. Share {window.location.origin}/demo to invite people.</p>}
      {pending.map((r) => (
        <article key={r.id} className="panel item">
          <p><strong>{r.name}</strong> <span className="muted">{r.email}</span></p>
          <p className="mono small accent">/p/{r.slug}</p>
          {r.reason && <p className="muted">“{r.reason}”</p>}
          <p className="muted small">Requested {new Date(r.createdAt).toLocaleString()}</p>
          <div className="row">
            <button className="btn btn--primary" disabled={busyId === r.id} onClick={() => void approve(r)}>Approve</button>
            <button className="btn" disabled={busyId === r.id} onClick={() => void reject(r)}>Reject</button>
          </div>
        </article>
      ))}

      <h3 className="sub">Members ({members.length})</h3>
      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Page</th><th>Email</th><th /></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.profile?.fullName ?? '—'}{m.role === 'OWNER' && <span className="mono small accent"> owner</span>}</td>
                <td><a className="mono small" href={m.role === 'OWNER' ? '/' : `/p/${m.slug}`} target="_blank" rel="noreferrer">{m.role === 'OWNER' ? '/' : `/p/${m.slug}`}</a></td>
                <td className="small">{m.email}</td>
                <td className="row">
                  <button className="icon-btn" disabled={busyId === m.id} onClick={() => void resetKey(m)}>New key</button>
                  {m.role !== 'OWNER' && <button className="icon-btn danger" disabled={busyId === m.id} onClick={() => void removeMember(m)}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviewed.length > 0 && (
        <>
          <h3 className="sub">Recently reviewed</h3>
          <ul className="panel reviewed">
            {reviewed.map((r) => (
              <li key={r.id} className="small"><span className={r.status === 'APPROVED' ? 'ok' : 'muted'}>{r.status.toLowerCase()}</span> {r.name}, /p/{r.slug}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function KeyCard({ issued, onClose }: { issued: IssuedKey; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const origin = window.location.origin;
  const message =
    `Hi ${issued.name},\n\nYour PortfolioOS access is approved.\n\n` +
    `Log in: ${origin}/login\nEmail: ${issued.email}\nAccess key: ${issued.accessKey}\n\n` +
    `Your page: ${origin}/p/${issued.slug}\n\nIt starts with example content; replace it with your own in the Studio. Keep the key private.`;

  return (
    <div className="panel keycard" role="alert">
      <p><strong>Access key for {issued.name}</strong>. Copy it now; it won’t be shown again.</p>
      <p className="mono key">{issued.accessKey}</p>
      <div className="row">
        <button
          className="btn btn--primary"
          onClick={() => void navigator.clipboard.writeText(message).then(() => setCopied(true))}
        >
          {copied ? 'Copied' : 'Copy message with key'}
        </button>
        <a className="btn" href={`mailto:${issued.email}?subject=${encodeURIComponent('Your PortfolioOS access key')}&body=${encodeURIComponent(message)}`}>
          Email it
        </a>
        <button className="icon-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}
