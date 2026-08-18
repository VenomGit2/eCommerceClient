import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

function AdminTabIcon({ name }) {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    products: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9" /></>,
    orders: <><rect x="5" y="4" width="14" height="17" rx="1" /><path d="M9 4V2m6 2V2M9 9h6m-6 4h6m-6 4h4" /></>,
    add: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8m-4-4h8" /></>,
    update: <><path d="m4 20 4.2-1 10.7-10.7-3.2-3.2L5 15.8 4 20Z" /><path d="m13.8 7 3.2 3.2" /></>,
    delete: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" /></>,
  };

  return (
    <svg className="admin-tabs__icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function AdminTab({ to, icon, children, end = false }) {
  return (
    <NavLink end={end} to={to}>
      <AdminTabIcon name={icon} />
      <span>{children}</span>
    </NavLink>
  );
}

export default function AdminProductTabs() {
  return (
    <nav className="admin-tabs" aria-label="Administration sections">
      <AdminTab end to={ROUTES.admin} icon="dashboard">Dashboard</AdminTab>
      <AdminTab end to={ROUTES.adminProducts} icon="products">Products</AdminTab>
      <AdminTab to={ROUTES.adminOrders} icon="orders">Orders</AdminTab>
      <AdminTab to={ROUTES.adminAddProduct} icon="add">Add product</AdminTab>
      <AdminTab to={ROUTES.adminUpdateProduct} icon="update">Update product</AdminTab>
      <AdminTab to={ROUTES.adminDeleteProduct} icon="delete">Delete product</AdminTab>
    </nav>
  );
}
