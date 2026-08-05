import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from './routePaths';
export default function PublicRoute() {
  return useAuth().isAuthenticated ? <Navigate to={ROUTES.account} replace /> : <Outlet />;
}

