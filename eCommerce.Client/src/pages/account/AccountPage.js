import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
import AccountTabs from '../../components/common/AccountTabs';
export default function AccountPage() {
  const { session } = useAuth();
  const user = session?.data?.data ?? session?.data ?? session;
  return <section className="account-page"><AccountTabs /><div className="account-page__heading"><p className="eyebrow">Your account</p><h1>My account</h1><p>Signed in{user?.email ? ` as ${user.email}` : ''}.</p></div><div className="link-cards"><Link className="card card__body" to={ROUTES.orders}><h2>Orders</h2><p>Review your order history.</p></Link><Link className="card card__body" to={ROUTES.wishlist}><h2>Wishlist</h2><p>View your saved products.</p></Link></div></section>;
}
