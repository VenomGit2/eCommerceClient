import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
export default function AdminDashboardPage() { return <section><p className="eyebrow">Administration</p><h1>Dashboard</h1><div className="link-cards"><Link className="card card__body" to={ROUTES.adminProducts}><h2>Products</h2><p>Review and manage the catalog.</p></Link><Link className="card card__body" to={ROUTES.adminOrders}><h2>Orders</h2><p>Review customer orders.</p></Link></div></section>; }

