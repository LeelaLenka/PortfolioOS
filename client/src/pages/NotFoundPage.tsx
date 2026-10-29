import { Link } from 'react-router-dom';
import { StatusScreen } from '../components/Shell';

export function NotFoundPage() {
  return <StatusScreen title="Page not found" detail="Check the address, or go back to the home page." action={<Link className="btn" to="/">Go home</Link>} />;
}
