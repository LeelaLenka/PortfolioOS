import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import type { Portfolio } from '../lib/types';
import { AdminPanel } from './AdminPanel';
import { ListEditor } from './ListEditor';
import { MessagesPanel } from './MessagesPanel';
import { ProfileEditor } from './ProfileEditor';
import { certificateFields, experienceFields, projectFields, skillFields } from './fields';

type Tab = 'profile' | 'projects' | 'skills' | 'experience' | 'certificates' | 'messages' | 'access';

export function StudioPage() {
  const { user, loading, logout } = useAuth();
  const [data, setData] = useState<Portfolio | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('profile');
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState('');

  const load = useCallback(() => {
    api<Portfolio>('/me/portfolio')
      .then((p) => {
        setData(p);
        setVersion((v) => v + 1);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  /** After a save: show the confirmation, then reload so editors match the database */
  const saved = useCallback(
    (message: string) => {
      setNotice(message);
      load();
    },
    [load],
  );
  const openTab = (t: Tab) => {
    setTab(t);
    setNotice('');
  };

  if (loading) return <div className="desk loading"><p className="mono muted">checking your session…</p></div>;
  if (!user) return <Navigate to="/login" replace />;

  const isOwner = user.role === 'OWNER';
  const publicPath = isOwner ? '/' : `/p/${user.slug}`;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'messages', label: 'Messages' },
    ...(isOwner ? [{ id: 'access' as Tab, label: 'Access' }] : []),
  ];

  // Re-mounting editors after a save keeps their state in sync with the database
  const key = `${tab}-${version}`;

  return (
    <div className="desk studio">
      <header className="nav">
        <div className="wrap nav__inner">
          <span className="nav__brand mono">studio://{user.slug}</span>
          <div className="row">
            <a className="btn" href={publicPath} target="_blank" rel="noreferrer">View my page</a>
            <button className="btn" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <div className="wrap studio__layout">
        <nav className="studio__tabs" aria-label="Studio sections">
          {tabs.map((t) => (
            <button key={t.id} type="button" aria-current={tab === t.id ? 'page' : undefined} onClick={() => openTab(t.id)}>
              {t.label}
            </button>
          ))}
          <p className="muted small studio__url">
            Your page:<br />
            <Link className="mono" to={publicPath}>{window.location.host}{publicPath}</Link>
          </p>
        </nav>

        <main className="studio__main">
          {error && <p role="alert" className="error">{error}</p>}
          {notice && <p role="status" className="ok notice">{notice}</p>}
          {!data && !error && <p className="mono muted">loading your portfolio…</p>}
          {data && tab === 'profile' && <ProfileEditor key={key} initial={data.profile} onSaved={saved} />}
          {data && tab === 'projects' && (
            <ListEditor key={key} title="Projects" itemLabel="Project" endpoint="/me/projects" max={20} fields={projectFields}
              help="Shown as case files. Order here is the order on your page." initial={data.projects as unknown as Record<string, unknown>[]} onSaved={saved} />
          )}
          {data && tab === 'skills' && (
            <ListEditor key={key} title="Skills" itemLabel="Stage" endpoint="/me/skills" max={10} fields={skillFields}
              help="Group your skills into the stages of how you build." initial={data.skillGroups as unknown as Record<string, unknown>[]} onSaved={saved} />
          )}
          {data && tab === 'experience' && (
            <ListEditor key={key} title="Experience" itemLabel="Role" endpoint="/me/experiences" max={10} fields={experienceFields}
              help="Internships, jobs and positions of responsibility." initial={data.experiences as unknown as Record<string, unknown>[]} onSaved={saved} />
          )}
          {data && tab === 'certificates' && (
            <ListEditor key={key} title="Certificates" itemLabel="Certificate" endpoint="/me/certificates" max={20} fields={certificateFields}
              help="Add a credential link so recruiters can verify it." initial={data.certificates as unknown as Record<string, unknown>[]} onSaved={saved} />
          )}
          {tab === 'messages' && <MessagesPanel />}
          {isOwner && tab === 'access' && <AdminPanel />}
        </main>
      </div>
    </div>
  );
}
