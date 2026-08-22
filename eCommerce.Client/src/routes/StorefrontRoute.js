import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ModuleAccess from '../utils/moduleAccess';
import { ROUTES } from './routePaths';

export default function StorefrontRoute() {
  const { session, status } = useAuth();

  if (status === 'loading') {
    return <div className="section-status" role="status"><span className="loader__spinner" aria-hidden="true" />Loading…</div>;
  }

  const hasAdminAccess = ModuleAccess('PRODUCT', null, session?.access_token);
  return hasAdminAccess ? <Navigate to={ROUTES.admin} replace /> : <Outlet />;
}
