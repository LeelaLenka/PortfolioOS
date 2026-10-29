import { Link, useParams } from 'react-router-dom';
import { PortfolioView } from '../components/PortfolioView';
import { StatusScreen } from '../components/Shell';
import { usePortfolio } from '../lib/usePortfolio';

function Loading() {
  return (
    <div className="desk loading" role="status">
      <p className="mono muted">loading portfolio…</p>
      <p className="muted small">The free server can take up to a minute to wake up on the first visit.</p>
    </div>
  );
}

/** "/" shows the site owner's portfolio */
export function HomePage() {
  const { data, error } = usePortfolio();
  if (error) return <StatusScreen title="This portfolio isn’t available yet" detail={error} />;
  if (!data) return <Loading />;
  return <PortfolioView data={data} />;
}

/** "/p/:slug" shows an approved member's portfolio */
export function MemberPage() {
  const { slug = '' } = useParams();
  const { data, error } = usePortfolio(slug);
  if (error) {
    return (
      <StatusScreen
        title="No portfolio at this address"
        detail={error}
        action={<Link className="btn" to="/demo">See an example portfolio</Link>}
      />
    );
  }
  if (!data) return <Loading />;
  return <PortfolioView data={data} />;
}

/** "/demo" shows the example person, with an invitation to request access */
export function DemoPage() {
  const { data, error } = usePortfolio('demo');
  if (error) return <StatusScreen title="The example portfolio isn’t available" detail={error} />;
  if (!data) return <Loading />;
  return (
    <PortfolioView
      data={data}
      banner={
        <div className="demo-banner" role="note">
          <p>
            This is an <strong>example portfolio</strong>. Request your own, and once it’s approved you’ll get an access
            key to replace this content with yours.
          </p>
          <div className="demo-banner__actions">
            <Link className="btn btn--primary" to="/join">Request my portfolio</Link>
            <Link className="btn" to="/login">I have an access key</Link>
          </div>
        </div>
      }
    />
  );
}
