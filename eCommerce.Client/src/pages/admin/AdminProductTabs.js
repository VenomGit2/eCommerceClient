import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

export default function AdminProductTabs() {
  return (
    <nav className="admin-tabs" aria-label="Product administration">
      <NavLink end to={ROUTES.adminProducts}>Products</NavLink>
      <NavLink to={ROUTES.adminAddProduct}>Add product</NavLink>
      <NavLink to={ROUTES.adminUpdateProduct}>Update product</NavLink>
      <NavLink to={ROUTES.adminDeleteProduct}>Delete product</NavLink>
    </nav>
  );
}

