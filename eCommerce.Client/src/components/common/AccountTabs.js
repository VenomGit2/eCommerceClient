import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

function AccountTabIcon({ name }) {
  const icons = {
    overview: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    orders: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6m-6 4h6m-6 4h4" /></>,
    wishlist: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" />,
  };

  return (
    <svg className="account-tabs__icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function AccountTab({ to, icon, children, end = false }) {
  return (
    <NavLink end={end} to={to}>
      <AccountTabIcon name={icon} />
      <span>{children}</span>
    </NavLink>
  );
}

export default function AccountTabs() {
  return (
    <nav className="account-tabs" aria-label="My account sections">
      <AccountTab end to={ROUTES.account} icon="overview">Overview</AccountTab>
      <AccountTab to={ROUTES.orders} icon="orders">Orders</AccountTab>
      <AccountTab to={ROUTES.wishlist} icon="wishlist">Wishlist</AccountTab>
    </nav>
  );
}
