import { endpointPath } from '../hooks/useAxios';

export async function login(API, credentials, signal) {
  const { data } = await API.post(
    endpointPath('REACT_APP_AUTH_LOGIN_PATH'),
    { ...credentials, email: credentials.email.trim() },
    { signal },
  );
  return data;
}

export async function register(API, details, signal) {
  const { data } = await API.post(endpointPath('REACT_APP_AUTH_REGISTER_PATH'), details, { signal });
  return data;
}
