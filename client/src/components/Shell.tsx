import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Page frame for the non-portfolio screens (join, login, studio) */
export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="desk shell">
      <header className="nav">
        <div className="wrap nav__inner">
          <Link to="/" className="nav__brand mono">PortfolioOS</Link>
          <nav className="nav__links" aria-label="Main">
            <Link to="/demo">Example</Link>
            <Link to="/join">Get your own</Link>
            <Link to="/login">Log in</Link>
          </nav>
        </div>
      </header>
      <main className={`wrap shell__main${wide ? ' shell__main--wide' : ''}`}>{children}</main>
    </div>
  );
}

export function StatusScreen({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <Shell>
      <div className="panel status">
        <h1 className="status__title">{title}</h1>
        {detail && <p className="muted">{detail}</p>}
        {action}
      </div>
    </Shell>
  );
}
