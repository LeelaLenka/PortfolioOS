import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Portfolio } from '../lib/types';
import { GithubIcon, LinkIcon, LinkedinIcon, MailIcon, PinIcon } from './Icons';
import { Logo } from './Logo';
import { ParticleField } from './ParticleField';

/** "Lenka Leela Krishna Sai Bharat" -> "LB" (first + last initial) */
function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'PO';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** Short lowercase handle for the terminal prompt, e.g. "bharat" */
function handleOf(p: Portfolio) {
  const last = p.profile.fullName.trim().split(/\s+/).pop() ?? p.slug;
  return last.toLowerCase().replace(/[^a-z0-9]/g, '') || p.slug;
}

const firstWordCap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export function PortfolioView({ data, banner }: { data: Portfolio; banner?: ReactNode }) {
  const { profile } = data;
  const tag = initials(profile.fullName);

  useEffect(() => {
    document.title = `${profile.fullName}${profile.headline ? ` | ${profile.headline}` : ''}`;
  }, [profile.fullName, profile.headline]);

  const visible = SECTIONS.filter((s) => {
    if (s.id === 'skills') return data.skillGroups.length > 0;
    if (s.id === 'projects') return data.projects.length > 0;
    if (s.id === 'experience') return data.experiences.length > 0 || data.certificates.length > 0;
    return true;
  });

  return (
    <div className="desk desk--live">
      <ParticleField />
      {banner}
      <header className="nav">
        <div className="wrap nav__inner">
          <a href="#top" className="nav__brand" aria-label={`${profile.fullName}, back to top`}>
            <Logo initials={tag} name={firstWordCap(handleOf(data))} />
          </a>
          <nav aria-label="Sections" className="nav__links">
            {visible.map((s) => (
              <a key={s.id} href={`#${s.id}`}>{s.label}</a>
            ))}
          </nav>
          <SocialLinks data={data} />
        </div>
      </header>

      <main id="top">
        <Hero data={data} tag={tag} />
        <About data={data} />
        {data.skillGroups.length > 0 && <Skills data={data} />}
        {data.projects.length > 0 && <Projects data={data} />}
        {(data.experiences.length > 0 || data.certificates.length > 0) && <ExperienceSection data={data} />}
        {profile.githubUsername && <GithubSection username={profile.githubUsername} />}
        <Contact data={data} />
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <span className="mono muted">© {new Date().getFullYear()} {profile.fullName}</span>
          <span className="muted">
            Built on PortfolioOS. <Link to="/demo">Get your own portfolio</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

function SocialLinks({ data }: { data: Portfolio }) {
  const p = data.profile;
  return (
    <div className="social">
      {p.githubUsername && (
        <a href={`https://github.com/${p.githubUsername}`} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon /></a>
      )}
      {p.linkedinUrl && (
        <a href={p.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>
      )}
      {p.email && <a href={`mailto:${p.email}`} aria-label="Email"><MailIcon /></a>}
    </div>
  );
}

function Hero({ data, tag }: { data: Portfolio; tag: string }) {
  const p = data.profile;
  const handle = handleOf(data);
  const scan = [
    ['focus', p.focus],
    ['stack', p.stack],
    ['signal', p.signal],
    ['status', p.status],
  ].filter(([, v]) => v);

  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div className="panel terminal">
          <div className="panel__bar">
            <span className="dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="mono muted">identity.session</span>
          </div>
          <div className="terminal__body">
            <p className="mono prompt">
              <span className="accent">{handle}@desk</span>:<span className="muted">~</span>$ <span className="typed">whoami</span>
            </p>
            <h1 className="hero__title">{p.tagline || p.fullName}</h1>
            {p.intro && <p className="hero__intro">{p.intro}</p>}
            <ul className="chips" aria-label="Highlights">
              {p.tags.map((t) => <li key={t}>{t}</li>)}
              {p.location && <li><PinIcon /> {p.location}</li>}
            </ul>
            <div className="actions">
              {data.projects.length > 0 && <a className="btn btn--primary" href="#projects">See my projects</a>}
              <a className="btn" href="#contact">Get in touch</a>
              {p.resumeUrl && <a className="btn" href={p.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}
            </div>
          </div>
        </div>

        <aside className="panel scan" aria-label="Profile summary">
          <div className="panel__bar">
            <span className="mono muted">profile.scan</span>
            <span className="mono online">online</span>
          </div>
          <div className="scan__body">
            {p.avatarUrl ? (
              <img className="avatar" src={p.avatarUrl} alt={p.fullName} />
            ) : (
              <div className="avatar avatar--initials mono" aria-hidden="true">{tag}</div>
            )}
            <p className="scan__name">{p.fullName}</p>
            {p.headline && <p className="muted">{p.headline}</p>}
            {p.currentPosition && (
              <p className="currently"><span className="mono">currently</span> {p.currentPosition}</p>
            )}
            {scan.length > 0 && (
              <dl className="scan__rows">
                {scan.map(([k, v]) => (
                  <div key={k}>
                    <dt className="mono">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function About({ data }: { data: Portfolio }) {
  const p = data.profile;
  const openTo = p.openTo ?? [];
  if (!p.about && !p.roles.length && !openTo.length) return null;
  return (
    <section id="about" className="section">
      <div className="wrap">
        <h2 className="section__title">About</h2>
        {p.about && <p className="lead">{p.about}</p>}
        {openTo.length > 0 && (
          <div className="open-to">
            <p className="open-to__label">Open to roles</p>
            <ul className="open-to__list">
              {openTo.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        )}
        {p.roles.length > 0 && (
          <div className="roles">
            {p.roles.map((r) => (
              <article key={r.title} className="panel role">
                <h3>{r.title}</h3>
                <p className="muted">{r.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Skills({ data }: { data: Portfolio }) {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <h2 className="section__title">Build pipeline</h2>
        <p className="section__sub muted">The tools I use, in the order I use them to turn an idea into a working product.</p>
        <ol className="pipeline">
          {data.skillGroups.map((g, i) => (
            <li key={g.name} className="panel stage">
              <span className="stage__no mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{g.name}</h3>
              {g.description && <p className="muted">{g.description}</p>}
              <ul className="tags">
                {g.items.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Projects({ data }: { data: Portfolio }) {
  const categories = useMemo(() => [...new Set(data.projects.map((p) => p.category))], [data.projects]);
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? data.projects : data.projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="wrap">
        <h2 className="section__title">Project case files</h2>
        <p className="section__sub muted">Each case shows the problem, what I built, and what changed.</p>
        {categories.length > 1 && (
          <div className="filters" role="group" aria-label="Filter projects">
            {['all', ...categories].map((c) => (
              <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c === 'all' ? 'All projects' : c}
              </button>
            ))}
          </div>
        )}
        <div className="cases">
          {shown.map((p) => (
            <article key={p.title} className="panel case">
              <header className="case__head">
                <span className="mono muted">case {String(data.projects.indexOf(p) + 1).padStart(2, '0')}</span>
                <span className="mono kind">{p.category}</span>
              </header>
              <h3>{p.title}</h3>
              {p.summary && <p className="muted">{p.summary}</p>}
              <dl className="bba">
                {p.before && <div><dt className="mono">before</dt><dd>{p.before}</dd></div>}
                {p.built && <div><dt className="mono">built</dt><dd>{p.built}</dd></div>}
                {p.after && <div><dt className="mono">after</dt><dd>{p.after}</dd></div>}
              </dl>
              <ul className="tags">
                {p.tech.map((t) => <li key={t}>{t}</li>)}
              </ul>
              {(p.liveUrl || p.repoUrl) && (
                <div className="case__links">
                  {p.liveUrl && (
                    <a className="live-btn" href={p.liveUrl} target="_blank" rel="noreferrer">
                      <span className="live-dot" aria-hidden="true" /> Live demo <LinkIcon />
                    </a>
                  )}
                  {p.repoUrl && <a className="code-link" href={p.repoUrl} target="_blank" rel="noreferrer"><GithubIcon /> Code</a>}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ data }: { data: Portfolio }) {
  return (
    <section id="experience" className="section">
      <div className="wrap exp">
        {data.experiences.length > 0 && (
          <div>
            <h2 className="section__title">Experience</h2>
            <ol className="timeline">
              {data.experiences.map((e) => (
                <li key={`${e.role}-${e.organization}`}>
                  <p className="timeline__role">{e.role}, {e.organization}</p>
                  {(e.period || e.location) && (
                    <p className="mono muted small">{[e.period, e.location].filter(Boolean).join(', ')}</p>
                  )}
                  <ul>
                    {e.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        )}
        {data.certificates.length > 0 && (
          <div>
            <h2 className="section__title">Certifications</h2>
            <ul className="certs">
              {data.certificates.map((c) => (
                <li key={c.name} className="panel cert">
                  {c.imageUrl && (
                    <a className="cert__thumb" href={c.url || c.imageUrl} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
                      <img src={c.imageUrl} alt="" loading="lazy" />
                    </a>
                  )}
                  <div className="cert__body">
                    <p className="cert__name">{c.name}</p>
                    <p className="muted small">{[c.issuer, c.date].filter(Boolean).join(', ')}</p>
                    {(c.url || c.imageUrl) && (
                      <a className="cert__verify small" href={c.url || c.imageUrl} target="_blank" rel="noreferrer">
                        {c.url ? 'Verify credential' : 'View certificate'} <LinkIcon />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

interface Repo { name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; fork: boolean }

function GithubSection({ username }: { username: string }) {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=12`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list: Repo[]) => setRepos(list.filter((r) => !r.fork).slice(0, 6)))
      .catch(() => setFailed(true));
  }, [username]);

  return (
    <section id="github" className="section">
      <div className="wrap">
        <h2 className="section__title">Recent on GitHub</h2>
        <p className="section__sub muted">
          The repositories I’ve pushed to most recently, live from{' '}
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">github.com/{username}</a>.
        </p>
        {failed && <p className="muted">GitHub isn’t responding right now. Open the profile link above to browse the code.</p>}
        {!repos && !failed && <p className="muted mono">loading repositories…</p>}
        {repos && (
          <ul className="repos">
            {repos.map((r) => (
              <li key={r.name} className="panel repo">
                <a href={r.html_url} target="_blank" rel="noreferrer" className="repo__name mono">{r.name}</a>
                {r.description && <p className="muted small">{r.description}</p>}
                {r.language && <p className="mono small kind">{r.language}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Contact({ data }: { data: Portfolio }) {
  const isDemo = data.role === 'DEMO';
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState<{ status: 'idle' | 'sending' | 'sent' | 'error'; msg: string }>({ status: 'idle', msg: '' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState({ status: 'sending', msg: '' });
    try {
      await api(`/portfolio/${data.slug}/contact`, { method: 'POST', body: form });
      setState({ status: 'sent', msg: 'Message sent. You’ll get a reply by email.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setState({ status: 'error', msg: (err as Error).message });
    }
  }

  return (
    <section id="contact" className="section">
      <div className="wrap contact">
        <div>
          <h2 className="section__title">Contact</h2>
          <p className="lead">Have a role, a project or a question? Send a message and I’ll reply by email.</p>
          {data.profile.email && (
            <p><a className="mono" href={`mailto:${data.profile.email}`}>{data.profile.email}</a></p>
          )}
        </div>
        <form className="panel form" onSubmit={submit}>
          <label>Name<input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Email<input required type="email" maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Message<textarea required minLength={5} maxLength={2000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
          <button className="btn btn--primary" disabled={state.status === 'sending' || isDemo}>
            {state.status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {isDemo && <p className="muted small">This is an example portfolio, so the form is turned off.</p>}
          {state.msg && <p role="status" className={state.status === 'error' ? 'error' : 'ok'}>{state.msg}</p>}
        </form>
      </div>
    </section>
  );
}
