import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Message } from '../lib/types';

export function MessagesPanel() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Message[]>('/me/messages').then(setMessages).catch((e: Error) => setError(e.message));
  }, []);

  async function markRead(id: string) {
    await api(`/me/messages/${id}/read`, { method: 'PATCH' });
    setMessages((m) => m?.map((x) => (x.id === id ? { ...x, read: true } : x)) ?? null);
  }
  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    await api(`/me/messages/${id}`, { method: 'DELETE' });
    setMessages((m) => m?.filter((x) => x.id !== id) ?? null);
  }

  return (
    <section className="editor">
      <div className="editor__head">
        <div>
          <h2>Messages</h2>
          <p className="muted small">Sent through the contact form on your page. Reply by email.</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {messages?.length === 0 && <p className="panel empty muted">No messages yet. They’ll appear here when someone uses your contact form.</p>}
      {messages?.map((m) => (
        <article key={m.id} className={`panel item message${m.read ? '' : ' message--new'}`}>
          <header className="message__head">
            <p><strong>{m.name}</strong> <a href={`mailto:${m.email}?subject=Re: your message`}>{m.email}</a></p>
            <time className="mono muted small">{new Date(m.createdAt).toLocaleString()}</time>
          </header>
          <p className="message__body">{m.message}</p>
          <div className="row">
            <a className="btn" href={`mailto:${m.email}?subject=Re: your message`} onClick={() => !m.read && void markRead(m.id)}>Reply by email</a>
            {!m.read && <button type="button" className="btn" onClick={() => void markRead(m.id)}>Mark as read</button>}
            <button type="button" className="icon-btn danger" onClick={() => void remove(m.id)}>Delete</button>
          </div>
        </article>
      ))}
    </section>
  );
}
