import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
export default function NotFoundPage() { return <section className="empty-state"><h1>Page not found</h1><p>The page you requested does not exist.</p><Link className="button button--primary" to={ROUTES.home}>Return home</Link></section>; }

