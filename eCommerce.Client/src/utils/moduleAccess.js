export const OIDC_ACCESS_TOKEN_KEY = 'commerce.oidc.access_token';

const modulePermissions = {
  PRODUCT: {
    SUPADM: ['VW', 'ADD', 'EDT', 'DEL'],
  },
};

function decodeJwtPayload(accessToken) {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

export function ModuleAccess(module, permission, accessToken) {
  const rolesForModule = modulePermissions[module];
  if (!rolesForModule) return false;

  const token = accessToken || localStorage.getItem(OIDC_ACCESS_TOKEN_KEY);
  const payload = token ? decodeJwtPayload(token) : null;
  const roleClaims = payload?.roles ?? payload?.role ?? [];
  const userRoles = Array.isArray(roleClaims) ? roleClaims : [roleClaims];
  const permissions = userRoles.flatMap((role) => rolesForModule[role] || []);

  return permission ? permissions.includes(permission) : permissions.length > 0;
}

export default ModuleAccess;
