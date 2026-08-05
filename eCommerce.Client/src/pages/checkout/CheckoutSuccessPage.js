import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
export default function CheckoutSuccessPage() { return <section className="empty-state"><p className="eyebrow">Order received</p><h1>Thank you for your order</h1><p>You can review its progress in your account.</p><Link className="button button--primary" to={ROUTES.orders}>View orders</Link></section>; }

