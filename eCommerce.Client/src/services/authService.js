import { apiRequest, endpointPath } from './apiClient';

export async function login(credentials, signal) {
  const response = await apiRequest(endpointPath('REACT_APP_AUTH_LOGIN_PATH'), {
    method: 'POST',
    body: { ...credentials, email: credentials.email.trim() },
    signal,
  });
  return response;
}

export const register = (details, signal) => apiRequest(endpointPath('REACT_APP_AUTH_REGISTER_PATH'), { method: 'POST', body: details, signal });
