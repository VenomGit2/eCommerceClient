import { useCallback, useEffect, useState } from 'react';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { OIDC_ACCESS_TOKEN_KEY } from '../utils/moduleAccess';

const appUrl = `${window.location.origin}/`;
const loginUrl = `${window.location.origin}/login`;
const oidcConfig = {
  authority: process.env.REACT_APP_OPENID_AUTHORITY,
  client_id: process.env.REACT_APP_OPENID_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_OPENID_REDIRECT_URL || appUrl,
  response_type: process.env.REACT_APP_OPENID_RESPONSE_TYPE || 'code',
  scope: process.env.REACT_APP_OPENID_SCOPE || 'openid profile email',
  post_logout_redirect_uri: process.env.REACT_APP_OPENID_POST_LOGOUT_REDIRECT_URI || loginUrl,
  silent_redirect_uri: process.env.REACT_APP_OPENID_SILENT_REDIRECT_URI || appUrl,
  automaticSilentRenew: true,
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const missingConfig = ['authority', 'client_id'].filter((key) => !oidcConfig[key]);
export const oidcConfigurationError = missingConfig.length
  ? `Missing OIDC configuration: ${missingConfig.join(', ')}`
  : null;

export const userManager = oidcConfigurationError ? null : new UserManager(oidcConfig);

function isSigninCallback() {
  const query = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return [query, fragment].some((params) => params.has('state') && (
    params.has('code')
    || params.has('id_token')
    || params.has('access_token')
    || params.has('error')
  ));
}

function isSignoutCallback() {
  const callbackUrl = new URL(oidcConfig.post_logout_redirect_uri);
  const query = new URLSearchParams(window.location.search);
  return window.location.pathname === callbackUrl.pathname
    && query.has('state')
    && !isSigninCallback();
}

export async function getOidcAccessToken() {
  return (await userManager?.getUser())?.access_token || null;
}

export async function clearOidcSession() {
  localStorage.removeItem(OIDC_ACCESS_TOKEN_KEY);
  await userManager?.removeUser();
}

export default function useOidc() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!userManager) {
      setError(oidcConfigurationError);
      setStatus('error');
      return undefined;
    }

    const userLoaded = (loadedUser) => {
      if (loadedUser.access_token) localStorage.setItem(OIDC_ACCESS_TOKEN_KEY, loadedUser.access_token);
      if (active) setUser(loadedUser);
    };
    const userUnloaded = () => {
      localStorage.removeItem(OIDC_ACCESS_TOKEN_KEY);
      if (active) setUser(null);
    };
    const silentRenewError = (renewError) => {
      if (active) setError(renewError.message || 'The session could not be renewed.');
    };

    userManager.events.addUserLoaded(userLoaded);
    userManager.events.addUserUnloaded(userUnloaded);
    userManager.events.addSilentRenewError(silentRenewError);

    (async () => {
      try {
        const handlingCallback = isSigninCallback();
        const handlingSignoutCallback = isSignoutCallback();
        let loadedUser;

        if (handlingSignoutCallback) {
          await userManager.signoutRedirectCallback();
          window.history.replaceState({}, document.title, window.location.pathname);
          loadedUser = null;
        } else {
          loadedUser = handlingCallback
            ? await userManager.signinRedirectCallback()
            : await userManager.getUser();
        }
        if (handlingCallback) {
          const returnPath = loadedUser?.state?.returnPath;
          window.history.replaceState({}, document.title,
            typeof returnPath === 'string' && returnPath.startsWith('/') ? returnPath : '/');
        }
        if (loadedUser?.access_token && !loadedUser.expired) {
          localStorage.setItem(OIDC_ACCESS_TOKEN_KEY, loadedUser.access_token);
        } else {
          localStorage.removeItem(OIDC_ACCESS_TOKEN_KEY);
        }
        if (active) {
          setUser(loadedUser && !loadedUser.expired ? loadedUser : null);
          setStatus('idle');
        }
      } catch (callbackError) {
        if (active) {
          setError(callbackError.message || 'Authentication failed.');
          setStatus('error');
        }
      }
    })();

    return () => {
      active = false;
      userManager.events.removeUserLoaded(userLoaded);
      userManager.events.removeUserUnloaded(userUnloaded);
      userManager.events.removeSilentRenewError(silentRenewError);
    };
  }, []);

  const signIn = useCallback(async (returnPath) => {
    if (!userManager) throw new Error(oidcConfigurationError);
    setError(null);
    setStatus('loading');
    await userManager.signinRedirect({ state: { returnPath } });
  }, []);

  const logout = useCallback(async () => {
    if (!userManager) throw new Error(oidcConfigurationError);
    localStorage.removeItem(OIDC_ACCESS_TOKEN_KEY);
    await userManager.signoutRedirect();
  }, []);

  return { user, status, error, signIn, logout };
}
