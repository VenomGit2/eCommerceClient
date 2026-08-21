import { useMemo } from 'react';
import AuthContext from '../context/AuthContext';
import useOidc from '../hooks/useOidc';

function hasRole(profile, role) {
  const claims = profile?.role ?? profile?.roles ?? [];
  return (Array.isArray(claims) ? claims : [claims])
    .some((claim) => claim.toLowerCase() === role.toLowerCase());
}

export default function AuthContainer({ children }) {
  const oidc = useOidc();
  const profile = oidc.user?.profile;
  const session = oidc.user ? {
    ...profile,
    user: profile,
    token: oidc.user.access_token,
    access_token: oidc.user.access_token,
  } : null;

  const value = useMemo(() => ({
    session,
    isAuthenticated: Boolean(oidc.user && !oidc.user.expired),
    isAdmin: hasRole(profile, 'Admin'),
    status: oidc.status,
    error: oidc.error,
    login: oidc.signIn,
    logout: oidc.logout,
  }), [session, oidc, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
