import { useCallback, useMemo, useState } from 'react';
import AuthContext from '../context/AuthContext';
import useOidc from '../hooks/useOidc';
import useAxios from '../hooks/useAxios';
import * as authService from '../services/authService';

function hasRole(profile, role) {
  const claims = profile?.role ?? profile?.roles ?? [];
  return (Array.isArray(claims) ? claims : [claims])
    .some((claim) => claim.toLowerCase() === role.toLowerCase());
}

export default function AuthContainer({ children }) {
  const oidc = useOidc();
  const API = useAxios();
  const [registration, setRegistration] = useState({ status: 'idle', error: null });
  const profile = oidc.user?.profile;
  const session = oidc.user ? {
    ...profile,
    user: profile,
    token: oidc.user.access_token,
    access_token: oidc.user.access_token,
  } : null;

  const register = useCallback(async (details) => {
    setRegistration({ status: 'loading', error: null });
    try {
      const response = await authService.register(API, details);
      setRegistration({ status: 'success', error: null });
      return response;
    } catch (error) {
      setRegistration({ status: 'error', error: error.message });
      throw error;
    }
  }, [API]);

  const value = useMemo(() => ({
    session,
    isAuthenticated: Boolean(oidc.user && !oidc.user.expired),
    isAdmin: hasRole(profile, 'Admin'),
    status: oidc.status === 'idle' ? registration.status : oidc.status,
    error: oidc.error || registration.error,
    login: oidc.signIn,
    logout: oidc.logout,
    register,
  }), [session, oidc, profile, registration, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
