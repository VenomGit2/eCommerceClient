import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/routePaths';

export default function AppFooter() {
  return <footer className="site-footer">
    <div className="page-container footer-grid">
      <div className="footer-intro"><Link className="footer-brand" to={ROUTES.home}>COMMERCE</Link><p>Everyday products, clearly presented and easy to shop.</p></div>
      <div><h2>SHOP</h2><Link to={ROUTES.newIn}>New in</Link><Link to={ROUTES.products}>All products</Link><Link to={ROUTES.cart}>Cart</Link></div>
      <div><h2>ACCOUNT</h2><Link to={ROUTES.account}>My account</Link><Link to={ROUTES.orders}>Track orders</Link><Link to={ROUTES.wishlist}>Wishlist</Link></div>
      <div><h2>INFORMATION</h2><p>Clear availability, straightforward pricing, and protected account access.</p></div>
    </div>
    <div className="page-container footer-wordmark" aria-hidden="true">COMMERCE</div>
    <div className="page-container footer-bottom"><small>© {new Date().getFullYear()} COMMERCE</small><small>ALL RIGHTS RESERVED</small></div>
  </footer>;
}
