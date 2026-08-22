import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import { ROUTES } from '../routes/routePaths';
import ModuleAccess from '../utils/moduleAccess';
import ThemeToggle from './common/ThemeToggle';

function SearchIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>; }
function UserIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>; }
function CartIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h2l2.4 10.3a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>; }
function HeartIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>; }
function SparkIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 2 1.5 5.2L19 9l-5.5 1.8L12 16l-1.5-5.2L5 9l5.5-1.8L12 2Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></svg>; }
function ShopIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></svg>; }
function OrdersIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4" /></svg>; }
function AdminIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 4.8 3.4 8 8 9 4.6-1 8-4.2 8-9V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>; }
function SignOutIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" /></svg>; }

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, session, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const hasAdminAccess = ModuleAccess('PRODUCT', null, session?.access_token);
  const closeMenu = () => setMenuOpen(false);

  return <>
    {!hasAdminAccess && <div className="announcement-bar">FREE SHIPPING ON EVERYDAY ESSENTIALS <span>—</span> SHOP THE LATEST DROP</div>}
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="nav page-container" aria-label="Main navigation">
        <button className="nav__toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
        <div className={`nav__links nav__links--primary ${menuOpen ? 'nav__links--open' : ''}`}>
          {!hasAdminAccess && <NavLink className="nav__icon-link" to={ROUTES.newIn} onClick={closeMenu} aria-label="New arrivals" title="New arrivals"><SparkIcon /><span>New in</span></NavLink>}
          {!hasAdminAccess && <NavLink className="nav__icon-link" to={ROUTES.products} onClick={closeMenu} aria-label="Shop products" title="Shop"><ShopIcon /><span>Shop</span></NavLink>}
          {isAuthenticated && !hasAdminAccess && <NavLink className="nav__icon-link" to={ROUTES.orders} onClick={closeMenu} aria-label="Your orders" title="Orders"><OrdersIcon /><span>Orders</span></NavLink>}
          {hasAdminAccess && <NavLink className="nav__icon-link" to={ROUTES.admin} onClick={closeMenu} aria-label="Administration" title="Administration"><AdminIcon /><span>Admin</span></NavLink>}
          {isAuthenticated && <button type="button" className="nav__signout nav__icon-link" aria-label="Sign out" title="Sign out" onClick={() => { logout(); closeMenu(); }}><SignOutIcon /><span>Sign out</span></button>}
        </div>
        <Link className="brand" to={hasAdminAccess ? ROUTES.admin : ROUTES.home} onClick={closeMenu} aria-label={hasAdminAccess ? 'Circuit and Grain administration dashboard' : 'Circuit and Grain home'}>
          <img className="brand__mark" src={`${process.env.PUBLIC_URL}/favicon.svg`} alt="" width="30" height="30" />
          <span className="brand__full">CIRCUIT &amp; GRAIN</span>
          <span className="brand__compact" aria-hidden="true">C&amp;G</span>
        </Link>
        <div className="nav__utilities">
          <ThemeToggle />
          {!hasAdminAccess && <Link to={ROUTES.products} aria-label="Search products"><SearchIcon /></Link>}
          {!hasAdminAccess && <Link className="wishlist-link" to={ROUTES.wishlist} aria-label={`Wishlist with ${wishlistCount} items`} title="Wishlist"><HeartIcon />{isAuthenticated && wishlistCount > 0 && <span className="nav-icon__count">{wishlistCount}</span>}</Link>}
          {!hasAdminAccess && <Link to={isAuthenticated ? ROUTES.account : ROUTES.login} aria-label={isAuthenticated ? 'My account' : 'Sign in'}><UserIcon /></Link>}
          {!hasAdminAccess && <Link className="cart-link" to={ROUTES.cart} aria-label={`Cart with ${itemCount} items`}><CartIcon /><span className="cart-link__count">{itemCount}</span></Link>}
        </div>
      </nav>
    </header>
  </>;
}
