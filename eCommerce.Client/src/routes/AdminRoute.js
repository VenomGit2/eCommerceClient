import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ModuleAccess from '../utils/moduleAccess';
import { ROUTES } from './routePaths';
export default function AdminRoute() {
  const { isAuthenticated, session } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />;
  return ModuleAccess('PRODUCT', null, session?.access_token)
    ? <Outlet />
    : <Navigate to={ROUTES.forbidden} replace />;
}
