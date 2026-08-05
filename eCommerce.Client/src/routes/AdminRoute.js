import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from './routePaths';
export default function AdminRoute() {
  const { isAuthenticated, isSuperadmin } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />;
  return isSuperadmin ? <Outlet /> : <Navigate to={ROUTES.forbidden} replace />;
}
