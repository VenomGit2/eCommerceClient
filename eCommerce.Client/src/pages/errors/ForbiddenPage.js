import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
export default function ForbiddenPage() { return <section className="empty-state"><h1>Access denied</h1><p>You do not have permission to view this page.</p><Link className="button button--primary" to={ROUTES.home}>Return home</Link></section>; }

