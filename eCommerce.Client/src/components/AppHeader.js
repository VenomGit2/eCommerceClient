import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import { ROUTES } from '../routes/routePaths';

function SearchIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>; }
function UserIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>; }
function CartIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h2l2.4 10.3a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>; }

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isSuperadmin, logout } = useAuth();
  const { itemCount } = useCart();
  const closeMenu = () => setMenuOpen(false);

  return <>
    <div className="announcement-bar">FREE SHIPPING ON EVERYDAY ESSENTIALS <span>—</span> SHOP THE LATEST DROP</div>
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="nav page-container" aria-label="Main navigation">
        <button className="nav__toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
        <div className={`nav__links nav__links--primary ${menuOpen ? 'nav__links--open' : ''}`}>
          <NavLink to={ROUTES.products} onClick={closeMenu}>NEW IN</NavLink>
          <NavLink to={ROUTES.products} onClick={closeMenu}>SHOP</NavLink>
          {isAuthenticated && <NavLink to={ROUTES.orders} onClick={closeMenu}>ORDERS</NavLink>}
          {isSuperadmin && <NavLink to={ROUTES.admin} onClick={closeMenu}>ADMIN</NavLink>}
          {isAuthenticated && <button type="button" className="nav__signout" onClick={() => { logout(); closeMenu(); }}>SIGN OUT</button>}
        </div>
        <Link className="brand" to={ROUTES.home} onClick={closeMenu} aria-label="Commerce home">COMMERCE</Link>
        <div className="nav__utilities">
          <Link to={ROUTES.products} aria-label="Search products"><SearchIcon /></Link>
          <Link to={isAuthenticated ? ROUTES.account : ROUTES.login} aria-label={isAuthenticated ? 'My account' : 'Sign in'}><UserIcon /></Link>
          <Link className="cart-link" to={ROUTES.cart} aria-label={`Cart with ${itemCount} items`}><CartIcon /><span className="cart-link__count">{itemCount}</span></Link>
        </div>
      </nav>
    </header>
  </>;
}
