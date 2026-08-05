import { apiRequest, endpointPath } from './apiClient';
const path = () => endpointPath('REACT_APP_USERS_PATH');
export const getCurrentUser = (token, signal) => apiRequest(path(), { token, signal });
export const updateCurrentUser = (user, token) => apiRequest(path(), { method: 'PUT', body: user, token });

